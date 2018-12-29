<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Einstellungen</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12 >
      <mdc-headline>Verein</mdc-headline>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import Organization from '@/store/models/Organization'

export default {
  name: 'SettingsEditOrganization',
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
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
