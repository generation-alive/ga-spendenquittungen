import Donator from '@/store/models/Donator'
import BankAccount from '@/store/models/BankAccount'
import _ from 'lodash'
import { promisify } from 'es6-promisify'
import parseCallback from 'csv-parse'

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
        zip: person.address.zip,
        city: person.address.city
      }
    }
    return {
      id: person._id,
      name: person.name || _.trim(_.join([person.first_name, person.last_name], ' ')),
      address
    }
  })
  Donator.insertOrUpdate({ data: processedData })
}

export const importTransactions = async (transactions) => {
  // parse data
  var parsedData = await parse(transactions, {
    delimiter: ';',
    columns: header => _.map(header, (headerEl) => _.includes([
      'Begünstigter/Absender - Kontonummer',
      'Begünstigter/Absender - Bankleitzahl',
      'Begünstigter/Absender - Name',
      'Betrag',
      'Verwendungszweckzeile 1',
      'Verwendungszweckzeile 2',
      'Buchungstag',
      'Kategorie'
    ], headerEl) ? _.camelCase(headerEl) : null)
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
    kategorie
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
      amount: _.toNumber(_.replace(betrag, ',', '.')),
      date: buchungstag,
      purpose: `${verwendungszweckzeile1}\n${verwendungszweckzeile2}`,
      category: kategorie
    })

    // save into structuredData
    structuredData[begunstigterAbsenderKontonummer] = accountData
  })

  // save it into the store
  var bankAccountsArray = _.map(structuredData, el => el)
  BankAccount.insertOrUpdate({ data: bankAccountsArray })
}
