<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Spender</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-list two-line >
        <mdc-list-item v-for="donator in donators" :key="donator.id">
          <mdc-icon slot="start-detail" icon="account_circle" />
          <span>{{donator.name}}</span>
          <span slot="secondary">Summe: {{donator.totalSum | currency}}</span>
          <mdc-button slot="end-detail" @click="$router.push({name: 'donatorsEdit', params: {id: donator.id}})">
            <mdc-icon class="mdc-button__icon" icon="create" style="font-size: 18px"/>Bearbeiten
          </mdc-button>
        </mdc-list-item>
      </mdc-list>
    </mdc-layout-cell>
    <mdc-fab class="fab" icon="add" @click="$router.push({name: 'donatorsCreate'})" />
  </mdc-layout-grid>
</template>

<script>
import Donator from '@/store/models/Donator'

export default {
  name: 'DonatorsOverview',
  computed: {
    donators () {
      return Donator.query().with('donations').all()
    }
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

</style>
