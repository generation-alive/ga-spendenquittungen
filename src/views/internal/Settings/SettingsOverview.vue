<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Einstellungen</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-headline>Verein</mdc-headline>
      <settings-overview-card
        title="Generation Alive e.V."
        subtitle="Eisenbahnstraße 23, 51645 Gummersbach"
        :purposes="[
          'Förderung der Religion im In- und Ausland',
          'Förderung der Volks- und Berufsbildung einschließlich Studentenhilfe'
        ]"
        :infos="{
          Finanzamt: 'Gummersbach',
          StNr: '212/5825/2063',
          'Datum des Freistellungsbescheid': '26.10.2016',
          'Veranlagungszeitraum': '2015'
        }"
        routeOnEdit="/"
      />
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-headline>Allgemein</mdc-headline>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import SettingsOverviewCard from './SettingsOverviewCard'

export default {
  components: {
    SettingsOverviewCard
  }
}
</script>

<style lang="sass" scoped>

</style>
