<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Bearbeiten: Spender MAXI</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      EDIT ME
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import Donator from '@/store/models/Donator'

export default {
  name: 'DonatorsEdit',
  computed: {
    donators () {
      return Donator.query().with('donations').all()
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
