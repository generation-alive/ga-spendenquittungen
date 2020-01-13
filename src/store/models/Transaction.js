import { Model } from '@vuex-orm/core'
import moment from 'moment'

export default class Transaction extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'transactions'

  static fields () {
    return {
      id: this.increment(),
      iban: this.attr(null),
      date: this.string(''),
      amount: this.number(0),
      purpose: this.string(''),
      category: this.string('')
    }
  }

  static mutators () {
    return {
      date (newDate) {
        return newDate && moment(newDate, 'DD.MM.YYYY').format('DD.MM.YYYY')
      }
    }
  }
}

window.Transaction = Transaction
