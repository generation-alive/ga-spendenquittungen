import { Model } from '@vuex-orm/core'
import uniqueId from '@/helpers/uniqueId'
import Transaction from './Transaction'

export default class BankAccount extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'bankAccount'

  static primaryKey = 'iban'

  static fields () {
    return {
      iban: this.string(uniqueId),
      blz: this.string(''),
      name: this.string(''),
      transactions: this.hasMany(Transaction, 'iban'),
      donatorId: this.attr(null)
    }
  }
}

window.BankAccount = BankAccount
