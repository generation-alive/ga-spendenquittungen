import Donator from '@/store/models/Donator'
import _ from 'lodash'

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
      name: person.name || `${person.first_name} ${person.last_name}`,
      address
    }
  })
  Donator.insertOrUpdate({ data: processedData })
}
