<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Bearbeiten: Verein</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12>
      <div class="icon-row">
        <mdc-icon icon="person" class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="name" label="Name" outline class="full"/>
        </div>
      </div>
      <div class="icon-row">
        <mdc-icon icon="person_pin_circle" class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="street" label="Straße" outline class="two-third"/>
          <mdc-textfield v-model="houseNr" label="Nummer" outline class="one-third"/>
        </div>
      </div>
      <div class="icon-row">
        <mdc-icon class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="zip" label="PLZ" outline class="one-third"/>
          <mdc-textfield v-model="city" label="Ort" outline class="two-third"/>
        </div>
      </div>
      <div v-for="(purpose, index) in purposes" :key="purpose.$id" class="icon-row">
        <mdc-icon v-if="index === 0" icon="flag" class="icon-row__icon"/>
        <mdc-icon v-else class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="purpose.desc" :label="`Zweck ${index + 1}`" outline class="full"/>
        </div>
      </div>
      {{purposes}}
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import Organization from '@/store/models/Organization'

export default {
  name: 'SettingsEditOrganization',
  data () {
    return {
      name: '',
      street: '',
      houseNr: '',
      zip: '',
      city: ''
    }
  },
  computed: {
    purposes: {
      get () {
        return this.organization && this.organization.purpose
      }
    },
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
  .icon-row
    display: flex

    &__icon
      align-self: center
      width: 35px
      margin: .7rem 1rem .5rem
      flex-grow: 0
      flex-shrink: 0
      font-size: 35px

    &__content
      flex-grow: 1
      flex-shrink: 1
      display: flex
      justify-content: space-between

  .full
    width: 100%
  .two-third
    width: 65%
  .one-third
    width: 30%
</style>
