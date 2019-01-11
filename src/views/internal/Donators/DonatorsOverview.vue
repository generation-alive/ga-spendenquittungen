<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Spender</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-list two-line >
        <mdc-list-item v-for="donator in donators" :key="donator.id">
          <mdc-icon slot="start-detail" icon="face" />
          <span>{{donator.name}}</span>
          <span slot="secondary">Summe: {{donator.totalSum | currency}}</span>
          <mdc-button slot="end-detail"><mdc-icon class="mdc-button__icon" icon="create" style="font-size: 18px"/>Bearbeiten</mdc-button>
        </mdc-list-item>
      </mdc-list>
    </mdc-layout-cell>
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

</style>
