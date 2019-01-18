import Donator from '@/store/models/Donator'
import _ from 'lodash'

export default (persons) => {
  let processedData = _.map(persons, (person) => ({
    id: person._id,
    name: `${person.first_name} ${person.last_name}`
  }))
  Donator.insert({ data: processedData })
}
