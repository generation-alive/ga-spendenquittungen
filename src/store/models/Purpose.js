import { Model } from '@vuex-orm/core'

export default class Purpose extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'purposes'

  static fields () {
    return {
      id: this.increment(),
      organizationId: this.attr(),
      desc: this.string('')
    }
  }
}
