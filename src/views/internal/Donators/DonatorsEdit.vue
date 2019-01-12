<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Spender bearbeiten: MAXI</mdc-display>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=8 tablet=10 phone=12>
      <mdc-subheading>Spender</mdc-subheading>
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
      <mdc-subheading>Spenden</mdc-subheading>
      <div v-for="(donation, index) in donations" :key="donation.id" class="icon-row">
        <span class="icon-row__icon icon-row__icon--text">{{index + 1}}</span>
        <div class="icon-row__content">
          <mdc-textfield v-model="donation.date" label="Datum" outline class="one-third"/>
          <mdc-textfield v-model="donation.sum" label="Betrag" outline class="one-third"/>
          <div class="toggle-container one-third">
            <mdc-icon-toggle class="toggle" v-model="donation.isMemberschipFee"
              :toggle-on="{icon:'person', label: 'Mitgliedsbeitrag'}"
              :toggle-off="{icon: 'money', label: 'Spende'}">
            </mdc-icon-toggle>
            <span v-if="donation.isMemberschipFee">Mitgliedsbeitrag</span>
            <span v-else>Spende</span>
          </div>
        </div>
      </div>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import Donator from '@/store/models/Donator'
import _ from 'lodash'

export default {
  name: 'DonatorsEdit',
  data () {
    return {
      name: '',
      street: '',
      houseNr: '',
      zip: '',
      city: '',
      donations: [
        { id: 1, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 2, date: '12.12.2012', sum: '123', isMemberschipFee: true },
        { id: 3, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 4, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 5, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 6, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 7, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 8, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 9, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 10, date: '12.12.2012', sum: '123', isMemberschipFee: false },
        { id: 11, date: '12.12.2012', sum: '123', isMemberschipFee: false }
      ]
    }
  },
  computed: {
    donators () {
      return Donator.query().with('donations').all()
    }
  },
  methods: {
    donationsWatcher (newDonations) {
      // auto add empty donation as last
      var isLastFieldWithData = this.isDonationWithContent(_.last(newDonations))
      if (isLastFieldWithData) {
        this.donations.push({ id: _.uniqueId('new_'), date: '', sum: '', isMemberschipFee: false })
      }

      // auto remove other empty donations
      for (var index in this.donations) {
        if (
          _.toNumber(index) !== _.toNumber(this.donations.length - 1) &&
          !this.isDonationWithContent(this.donations[index])
        ) {
          _.pullAt(this.donations, [index])
          this.donations = _.clone(this.donations)
        }
      }
    },
    isDonationWithContent (donation) {
      return donation && (donation.date || donation.sum)
    }
  },
  watch: {
    donations: {
      handler: 'donationsWatcher',
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
      &--text
        font-size: 25px
        text-align: center

    &__content
      flex-grow: 1
      flex-shrink: 1
      display: flex
      justify-content: space-between
      align-items: center

  .full
    width: 100%
  .two-third
    width: 65%
  .half
    width: 47.5%
  .one-third
    width: 30%

  .toggle-container
    display: flex
    align-items: center
  .toggle
    display: inline-flex
    margin-right: 1rem
</style>
