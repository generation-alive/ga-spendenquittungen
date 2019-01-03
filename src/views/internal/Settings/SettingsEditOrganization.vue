<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Bearbeiten: Verein</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12>
      <mdc-subheading>Verein</mdc-subheading>
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
      <mdc-subheading>Vereinszweck</mdc-subheading>
      <div v-for="(purpose, index) in purpose" :key="purpose.$id" class="icon-row">
        <mdc-icon v-if="index === 0" icon="flag" class="icon-row__icon"/>
        <mdc-icon v-else class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="purpose.desc" :label="`Zweck ${index + 1}`" outline class="full"/>
        </div>
      </div>
      <mdc-subheading>Freistellungsbescheid</mdc-subheading>
      <div class="icon-row">
        <mdc-icon icon="assignment_turned_in" class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="taxName" label="Name des Finanzamtes" outline class="half"/>
          <mdc-textfield v-model="taxNr" label="Steuernummer" outline class="half"/>
        </div>
      </div>
      <div class="icon-row">
        <mdc-icon class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="taxDate" label="Datum des Bescheids" outline class="half"/>
          <mdc-textfield v-model="taxPeriod" label="Veranlagungszeitraum" outline class="half"/>
        </div>
      </div>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import _ from 'lodash'
import Organization from '@/store/models/Organization'
import Purpose from '@/store/models/Purpose'
import { mapModelProps } from '@/store/helpers/mapModel'

export default {
  name: 'SettingsEditOrganization',
  data () {
    return {
    }
  },
  computed: {
    ...mapModelProps(Organization, 1, [
      'purpose'
    ], { withModels: ['purpose'], method: 'insertOrUpdate' }),
    ...mapModelProps(Organization, 1, [
      'name',
      'address.street',
      'address.houseNr',
      'address.zip',
      'address.city',
      'taxName',
      'taxNr',
      'taxDate',
      'taxPeriod'
    ], { withModels: ['address'] }),
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
  },
  methods: {
    addEmptyPurposeAsLast (val) {
      let isEmpty = val && val.length === 0
      let hasLastContent = !!(val && val.length && val[val.length - 1] && val[val.length - 1].desc)
      if (isEmpty || hasLastContent) {
        this.purpose = [...this.purpose, { desc: '' }]
      }
    },
    removeEmptyPurposeNotLast (val) {
      if (!val) {
        return
      }
      let emptyIndex
      for (let purpose of val) {
        if (purpose.desc === '') {
          emptyIndex = purpose.id
          break
        }
      }
      let hasEmptyIndex = !!emptyIndex
      let isNotLastIndex = emptyIndex !== _.last(val).id
      if (hasEmptyIndex && isNotLastIndex) {
        Purpose.delete(emptyIndex)
      }
    }
  },
  watch: {
    purpose: {
      handler (val, oldVal) {
        this.addEmptyPurposeAsLast(val)
        this.removeEmptyPurposeNotLast(val)
      },
      deep: true,
      immediate: true
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
  .half
    width: 47.5%
  .one-third
    width: 30%
</style>
