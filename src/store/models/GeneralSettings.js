import { Model } from '@vuex-orm/core'

export default class GeneralSettings extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'generalSettings'

  static fields () {
    return {
      id: this.increment(),
      period: this.string('')
    }
  }
}
