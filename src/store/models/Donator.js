import _ from 'lodash'

import { Model } from '@vuex-orm/core'
import Address from './Address'
import Donation from './Donation'

export default class Donator extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'donators'

  static fields () {
    return {
      id: this.increment(),
      name: this.string(''),
      address: this.morphOne(Address, 'ownerId', 'ownerType'),
      donations: this.hasMany(Donation, 'donatorId')
    }
  }

  get totalSum () {
    return _.sumBy(this.donations, 'sum')
  }
}

window.Donator = Donator
