import { Model } from '@vuex-orm/core'

export default class Address extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'addresses'

  static fields () {
    return {
      id: this.increment(),
      street: this.string(''),
      houseNr: this.string(''),
      zip: this.string(''),
      city: this.string(''),
      ownerId: this.attr(null),
      ownerType: this.attr(null),
      owner: this.morphTo('ownerId', 'ownerType')
    }
  }
}
