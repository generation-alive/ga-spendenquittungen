import Donator from '@/store/models/Donator'
import BankAccount from '@/store/models/BankAccount'
import _ from 'lodash'
import { promisify } from 'es6-promisify'
import parseCallback from 'csv-parse'
import moment from 'moment'

const parse = promisify(parseCallback)

const splitStreet = (street) => {
  if (!street) {
    return { street: '', houseNr: '' }
  }
  let matches = street.match(/(.*) ([0-9]+[a-zA-Z]*$)/)
  if (matches) {
    return { street: matches[1], houseNr: matches[2] }
  } else {
    return { street, houseNr: '' }
  }
}

export const importDonators = (persons) => {
  let processedData = _.map(persons, (person) => {
    if (person.address) {
      let { street, houseNr } = splitStreet(person.address.street)
      var address = {
        street,
        houseNr,
        zip: person.address.zip || '',
        city: person.address.city || ''
      }
    }
    return {
      id: person._id,
      name: person.name || _.trim(_.join([person.first_name, person.last_name], ' ')),
      address,
      hasGdpr: !!person.dsgvo_policy
    }
  })
  Donator.insertOrUpdate({ data: processedData })
}

export const importTransactions = async (transactions) => {
  let structuredData = null
  if (await isWindowsData(transactions)) {
    structuredData = await parseAndStructureWindows(transactions)
  }
  if (await isMacData(transactions)) {
    structuredData = await parseAndStructureMac(transactions)
  }

  if (!structuredData) throw Error('File seems not to contain processable data')

  // save it into the store
  var bankAccountsArray = _.map(structuredData, el => el)
  BankAccount.insertOrUpdate({ data: bankAccountsArray })
}

const requiredHeaders = {
  windows: [
    'Begünstigter/Absender - Kontonummer',
    'Begünstigter/Absender - Bankleitzahl',
    'Begünstigter/Absender - Name',
    'Betrag',
    'Verwendungszweckzeile 1',
    'Verwendungszweckzeile 2',
    'Buchungstag',
    'Kategorie',
    'Unterkategorie',
    'Splittbuchung - Kategorie',
    'Splittbuchung - Originalbetrag',
    'Splittbuchung - Unterkategorie'
  ],
  mac: [
    'BLZ/BIC',
    'Kontonummer/IBAN',
    'Empfänger/Absender',
    'VWZ 1',
    'VWZ 2',
    'Betrag',
    'Buchungsdatum',
    'Kategorie',
    'Unterkategorie',
    'Splitbuchung'
  ]
}

const checkForRequiredHeaders = async (transactions = '', format = '') => {
  var [headers] = await parse(transactions, {
    delimiter: ';',
    to: 1
  })
  for (const requiredHeader of requiredHeaders[format]) {
    if (!headers.includes(requiredHeader)) return false
  }

  return true
}

const isWindowsData = async (transactions) => {
  return checkForRequiredHeaders(transactions, 'windows')
}
const isMacData = async (transactions) => {
  return checkForRequiredHeaders(transactions, 'mac')
}

const parseAndStructureWindows = async (transactions) => {
// parse data
  var parsedData = await parse(transactions, {
    delimiter: ';',
    columns: header => _.map(header, (headerEl) =>
      _.includes(requiredHeaders.windows, headerEl)
        ? _.camelCase(headerEl)
        : null
    )
  })

  // structure data
  var structuredData = {}
  _.each(parsedData, ({
    begunstigterAbsenderBankleitzahl,
    begunstigterAbsenderKontonummer,
    begunstigterAbsenderName,
    verwendungszweckzeile1,
    verwendungszweckzeile2,
    betrag,
    buchungstag,
    kategorie,
    unterkategorie,
    splittbuchungKategorie,
    splittbuchungOriginalbetrag,
    splittbuchungUnterkategorie
  }) => {
    // initialize the data
    var accountData = structuredData[begunstigterAbsenderKontonummer] || {
      blz: begunstigterAbsenderBankleitzahl,
      iban: begunstigterAbsenderKontonummer,
      name: begunstigterAbsenderName,
      transactions: []
    }
    // add this transaction
    accountData.transactions.push({
      amount: _.toNumber(_.replace(splittbuchungOriginalbetrag || betrag, ',', '.')),
      date: buchungstag,
      purpose: `${verwendungszweckzeile1}\n${verwendungszweckzeile2}`,
      category: `${splittbuchungKategorie || kategorie} →→→ ${splittbuchungUnterkategorie || unterkategorie}`
    })

    // save into structuredData
    structuredData[begunstigterAbsenderKontonummer] = accountData
  })

  return structuredData
}

const parseAndStructureMac = async (transactions) => {
  // parse data
  var parsedData = await parse(transactions, {
    delimiter: ';',
    columns: header => _.map(header, (headerEl) =>
      _.includes(requiredHeaders.mac, headerEl)
        ? _.camelCase(headerEl)
        : null
    )
  })

  // structure data
  var structuredData = {}
  let lastUnsplittedTransaction = null
  _.each(parsedData, ({
    blzBic,
    kontonummerIban,
    empfangerAbsender,
    vwz1,
    vwz2,
    betrag,
    buchungsdatum,
    kategorie,
    unterkategorie,
    splitbuchung
  }) => {
    // initialize the data
    splitbuchung = _.toNumber(splitbuchung)
    if (splitbuchung) {
      kontonummerIban = lastUnsplittedTransaction.kontonummerIban
      blzBic = lastUnsplittedTransaction.blzBic
      vwz1 = lastUnsplittedTransaction.vwz1
      vwz2 = lastUnsplittedTransaction.vwz2
      empfangerAbsender = lastUnsplittedTransaction.empfangerAbsender
    }
    var accountData = structuredData[kontonummerIban] || {
      blz: blzBic,
      iban: kontonummerIban,
      name: empfangerAbsender,
      transactions: []
    }

    // add this transaction
    const transaction = {
      amount: _.toNumber(_.replace(betrag, ',', '.')),
      date: moment(buchungsdatum, 'YYYY-MM-DD').format('DD.MM.YYYY'),
      purpose: `${vwz1}\n${vwz2}`,
      category: `${kategorie} →→→ ${unterkategorie}`
    }
    if (splitbuchung) {
      accountData.transactions = accountData.transactions.filter(
        transaction => transaction !== lastUnsplittedTransaction.transaction
      )
    } else {
      lastUnsplittedTransaction = { kontonummerIban, blzBic, vwz1, vwz2, empfangerAbsender, transaction }
    }
    accountData.transactions.push(transaction)

    // save into structuredData
    structuredData[kontonummerIban] = accountData
  })

  return structuredData
}
