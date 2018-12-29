<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Einstellungen</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-headline>Allgemein</mdc-headline>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import GeneralSettings from '@/store/models/GeneralSettings'

export default {
  name: 'SettingsEditGeneral',
  computed: {
    generalInfos () {
      let generalSettings = GeneralSettings.find(1)
      return generalSettings && {
        'Zeitraum der Spendenbescheinigung': generalSettings.period
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
