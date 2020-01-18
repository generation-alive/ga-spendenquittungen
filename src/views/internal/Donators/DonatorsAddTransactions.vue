<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Umsätze</mdc-display>
      <mdc-title>{{bankAccount.name}} <mdc-caption>{{bankAccount.iban}}</mdc-caption></mdc-title>
      <mdc-button class="button" @click="$router.push({name: 'donatorsEdit', params: { id }})">
        <i class="material-icons mdc-button__icon">arrow_back</i>Zurück
      </mdc-button>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=12 tablet=12 phone=12 >
      <div class="tools">
        <mdc-textfield v-model="search" label="Suchen (Verwendungszweck / Kategorie / Summe)" outline
          trailing-icon="search" class="search"/>
      </div>
      <mdc-list two-line >
        <mdc-list-item v-for="transaction in pagedTransactions" :key="transaction.id" class="list-item">
          <mdc-icon icon="money" slot="start-detail" />
          <span>{{transaction.purpose}}</span>
          <span slot="secondary">{{transaction.category}}</span>
          <template slot="end-detail">
            <span class="additional-info">{{transaction.amount | currency}}</span>
            <span class="additional-info date">{{transaction.date}}</span>
            <mdc-button @click="takeOverTransaction(transaction)">
              <mdc-icon class="mdc-button__icon" icon="done" style="font-size: 20px; margin-right: 5px"/>
            </mdc-button>
            <mdc-button @click="deleteTransaction(transaction)">
              <mdc-icon class="mdc-button__icon" icon="delete_forever" style="font-size: 20px; margin-right: 5px"/>
            </mdc-button>
          </template>
        </mdc-list-item>
        <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
      </mdc-list>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import BankAccount from '@/store/models/BankAccount'
import Transaction from '@/store/models/Transaction'
import Donation from '@/store/models/Donation'
import _ from 'lodash'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'DonatorsAddTransactions',
  data () {
    return {
      search: '',
      showItems: 10,
      infiniteId: +new Date()
    }
  },
  computed: {
    bankAccount () {
      return BankAccount.query().with('transactions').find(this.iban)
    },
    transactions () {
      return this.bankAccount && this.bankAccount.transactions
    },
    searchedTransactions () {
      if (this.search) {
        var self = this
        return _.filter(this.transactions, (transaction) =>
          _.includes(_.toUpper(transaction.purpose), _.toUpper(self.search)) ||
          _.includes(_.toUpper(transaction.category), _.toUpper(self.search)) ||
          _.includes(_.toUpper(transaction.amount), _.toUpper(self.search))
        )
      }
      return this.transactions
    },
    pagedTransactions () {
      var end = _.min([this.showItems, this.searchedTransactions.length])
      return _.slice(this.searchedTransactions, 0, end)
    }
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    iban: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    async infiniteHandler ($state) {
      this.showItems += 10
      await this.$nextTick()
      if (this.showItems < this.searchedTransactions.length) {
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    resetPaging () {
      this.showItems = 10
      this.infiniteId += 1
    },
    async takeOverTransaction (transaction) {
      // check, if the transaction is a memberschipFee
      var isMemberschipFee = _.includes(transaction.category, '02-01 Mitgliederbeiträge')

      // save the transaction as a new donation for the donators
      var newDonation = await Donation.new()
      var id = newDonation.id
      await Donation.update({
        where: id,
        data: {
          donatorId: this.id,
          date: transaction.date,
          isMemberschipFee,
          sum: transaction.amount
        }
      })

      // delete the transaction
      await Transaction.delete(transaction.id)
    },
    async deleteTransaction (transaction) {
      await Transaction.delete(transaction.id)
    }
  },
  watch: {
    searchedTransactions: {
      deep: true,
      handler: 'resetPaging'
    }
  },
  components: {
    InfiniteLoading
  }
}
</script>

<style lang="sass" scoped>
  .fab
    position: fixed
    bottom: 1rem
    right: 1rem
    @media(min-width: 1024px)
      bottom: 1.5rem
      right: 1.5rem
  .tools
    display: flex
    align-items: center
    padding-right: 1rem
  .search
    width: 100%
    padding-right: 1rem
  .additional-info
    display: inline-block
    vertical-align: text-top
    text-align: right
  .date
    width: 6.5rem
  .list-item /deep/ .mdc-list-item__meta
    flex-grow: 0
    flex-shrink: 0
</style>
