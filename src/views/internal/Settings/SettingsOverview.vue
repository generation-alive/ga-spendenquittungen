<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Einstellungen</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-headline>Verein</mdc-headline>
      <settings-overview-card
        :title="organization && organization.name"
        :subtitle="organizationAddress"
        :purposes="organizationPurposes"
        :infos="organizationInfos"
        :routeOnEdit="{name: 'settingsOrganization'}"
      />
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-headline>Allgemein</mdc-headline>
      <settings-overview-card
        :infos="generalInfos"
        :routeOnEdit="{name: 'settingsGeneral'}"
      />
      <import-card class="import-card"/>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import SettingsOverviewCard from './SettingsOverviewCard'
import ImportCard from './ImportCard'
import Organization from '@/store/models/Organization'
import GeneralSettings from '@/store/models/GeneralSettings'

export default {
  name: 'SettingsOverview',
  computed: {
    organization () {
      return Organization.query().with('address').with('purpose').find(1)
    },
    organizationAddress () {
      let address = this.organization && this.organization.address
      return address ? `${address.street} ${address.houseNr}, ${address.zip} ${address.city}` : ''
    },
    organizationPurposes () {
      return (this.organization &&
        this.organization.purpose &&
        this.organization.purpose.map((purpose) => purpose.desc))
    },
    organizationInfos () {
      let org = this.organization
      return org && {
        Finanzamt: org.taxName,
        StNr: org.taxNr,
        'Datum des Freistellungsbescheid': org.taxDate,
        'Veranlagungszeitraum': org.taxPeriod
      }
    },
    generalInfos () {
      let generalSettings = GeneralSettings.find(1)
      return generalSettings && {
        'Zeitraum der Spendenbescheinigung': generalSettings.period
      }
    }
  },
  components: {
    SettingsOverviewCard,
    ImportCard
  }
}
</script>

<style lang="sass" scoped>
  .import-card
    margin-top: 1rem
</style>
