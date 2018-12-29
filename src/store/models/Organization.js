import { Model } from '@vuex-orm/core'
import Address from './Address'
import Purpose from './Purpose'

export default class Organization extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'organizations'

  static fields () {
    return {
      id: this.increment(),
      name: this.string(''),
      address: this.morphOne(Address, 'ownerId', 'ownerType'),
      purpose: this.hasMany(Purpose, 'organizationId'),
      taxName: this.string(''),
      taxNr: this.string(''),
      taxDate: this.string(''),
      taxPeriod: this.string('')
    }
  }
}
