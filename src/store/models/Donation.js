import { Model } from '@vuex-orm/core'

export default class Donation extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'donations'

  static fields () {
    return {
      id: this.increment(),
      donatorId: this.attr(null),
      date: this.string(''),
      isMemberschipFee: this.boolean(false),
      isWaiverOfRefund: this.boolean(false),
      sum: this.number(0)
    }
  }
}
