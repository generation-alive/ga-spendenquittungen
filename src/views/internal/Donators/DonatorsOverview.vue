<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Spender</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <div class="tools">
        <mdc-textfield v-model="search" label="Spender suchen" outline
          trailing-icon="search" class="search"/>
        <mdc-icon-toggle v-model="donatorsWithSum"
          toggle-on="attach_money"
          toggle-off="money_off"/>
      </div>
      <mdc-list two-line >
        <mdc-list-item v-for="donator in pagedDonators" :key="donator.id">
          <mdc-icon slot="start-detail" icon="account_circle" />
          <span>{{donator.name}}</span>
          <span slot="secondary">Summe: {{donator.totalSum | currency}}</span>
          <template slot="end-detail">
            <mdc-button @click="$router.push({name: 'donatorsPrint', params: {id: donator.id}})">
              <mdc-icon class="mdc-button__icon" icon="print" style="font-size: 20px; margin-right: 5px"/>
            </mdc-button>
            <mdc-button @click="$router.push({name: 'donatorsEdit', params: {id: donator.id}})">
              <mdc-icon class="mdc-button__icon" icon="create" style="font-size: 20px; margin-right: 5px"/>
            </mdc-button>
          </template>
        </mdc-list-item>
        <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
      </mdc-list>
    </mdc-layout-cell>
    <mdc-fab class="fab" icon="add" @click="$router.push({name: 'donatorsCreate'})" />
  </mdc-layout-grid>
</template>

<script>
import Donator from '@/store/models/Donator'
import _ from 'lodash'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'DonatorsOverview',
  data () {
    return {
      search: '',
      donatorsWithSum: false,
      showItems: 0,
      infiniteId: +new Date()
    }
  },
  computed: {
    donators () {
      return _.sortBy(Donator.query().with('donations').all(), ['name'])
    },
    searchedDonators () {
      if (this.search) {
        var self = this
        return _.filter(this.donators, (donator) =>
          _.includes(_.toUpper(donator.name), _.toUpper(self.search))
        )
      }
      return this.donators
    },
    filteredDonators () {
      if (this.donatorsWithSum) {
        return _.filter(this.searchedDonators, (donator) =>
          !!donator.totalSum
        )
      } else {
        return this.searchedDonators
      }
    },
    pagedDonators () {
      var end = _.min([this.showItems, this.filteredDonators.length])
      return _.slice(this.filteredDonators, 0, end)
    }
  },
  methods: {
    async infiniteHandler ($state) {
      this.showItems += 10
      await this.$nextTick()
      if (this.showItems < this.filteredDonators.length) {
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    resetPaging () {
      this.showItems = 0
      this.infiniteId += 1
    }
  },
  watch: {
    donatorsWithSum: 'resetPaging',
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
