<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Bankkonten</mdc-display>
      <mdc-button class="button" @click="$router.push({name: 'donatorsEdit', params: { id }})">
        <i class="material-icons mdc-button__icon">arrow_back</i>Zurück
      </mdc-button>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <div class="tools">
        <mdc-textfield v-model="search" label="Suchen (Name / IBAN)" outline
          trailing-icon="search" class="search"/>
      </div>
      <mdc-list two-line >
        <mdc-list-item v-for="bankAccount in pagedBankAccounts" :key="bankAccount.iban">
          <mdc-icon slot="start-detail" icon="account_balance" />
          <span>{{bankAccount.name}}</span>
          <span slot="secondary">{{bankAccount.iban}}</span>
          <template slot="end-detail">
            <mdc-button @click="addBankAccountToDonator(bankAccount)">
              <mdc-icon class="mdc-button__icon" icon="done" style="font-size: 20px; margin-right: 5px"/>
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
import _ from 'lodash'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'DonatorsAddBankAccount',
  data () {
    return {
      search: this.name,
      showItems: 0,
      infiniteId: +new Date()
    }
  },
  computed: {
    bankAccounts () {
      return _.sortBy(_.filter(BankAccount.all(), bankAccount => !bankAccount.donatorId), ['name'])
    },
    searchedBankAccounts () {
      if (this.search) {
        var self = this
        return _.filter(this.bankAccounts, (bankAccount) =>
          _.includes(_.toUpper(bankAccount.name), _.toUpper(self.search)) ||
          _.includes(_.toUpper(bankAccount.iban), _.toUpper(self.search))
        )
      }
      return this.bankAccounts
    },
    pagedBankAccounts () {
      var end = _.min([this.showItems, this.searchedBankAccounts.length])
      return _.slice(this.searchedBankAccounts, 0, end)
    }
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    name: {
      type: [Number, String],
      default: ''
    }
  },
  methods: {
    async infiniteHandler ($state) {
      this.showItems += 10
      await this.$nextTick()
      if (this.showItems < this.searchedBankAccounts.length) {
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    resetPaging () {
      this.showItems = 0
      this.infiniteId += 1
    },
    async addBankAccountToDonator (bankAccount) {
      await BankAccount.update({
        where: bankAccount.iban,
        data: { donatorId: this.id }
      })
      this.$router.push({ name: 'donatorsEdit', params: { id: this.id } })
    }
  },
  watch: {
    search: 'resetPaging'
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
</style>
