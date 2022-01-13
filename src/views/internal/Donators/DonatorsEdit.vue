<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Spender {{verb}}{{donator.name ? ': ' : ''}}{{donator.name}}</mdc-display>
      <mdc-button class="button" @click="$router.push({name: 'donatorsOverview'})">
        <i class="material-icons mdc-button__icon">arrow_back</i>Zurück
      </mdc-button>
      <mdc-button class="button" @click="onSave" raised>
        <i class="material-icons mdc-button__icon">save</i>Speichern
      </mdc-button>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=8 tablet=10 phone=12>
      <mdc-subheading>Spender</mdc-subheading>
      <div class="icon-row">
        <mdc-icon icon="person" class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="donator.name" label="Name" outline class="full"/>
        </div>
      </div>
      <div class="icon-row">
        <mdc-icon icon="person_pin_circle" class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="donator.address.street" label="Straße" outline class="two-third"/>
          <mdc-textfield v-model="donator.address.houseNr" label="Nummer" outline class="one-third"/>
        </div>
      </div>
      <div class="icon-row">
        <mdc-icon class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="donator.address.zip" label="PLZ" outline class="one-third"/>
          <mdc-textfield v-model="donator.address.city" label="Ort" outline class="two-third"/>
        </div>
      </div>
      <div class="icon-row">
        <mdc-icon class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-checkbox label="Hat DSGVO unterzeichnet" v-model="donator.hasGdpr" />
        </div>
      </div>
      <mdc-subheading>Bank Konten</mdc-subheading>
      <div class="icon-row">
        <mdc-icon class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-grid-list with-support-text interactive ratio="1x1">
            <mdc-grid-tile
              v-for="bankAccount in bankAccounts" :key="bankAccount.iban"
              :src="icons.account"
              :title="newTransactionsLabel(bankAccount) + bankAccount.name"
              :support-text="bankAccount.iban"
              @click="onAddTransactions(bankAccount)"
            />
            <mdc-grid-tile
              v-if="id"
              :src="icons.add"
              title="Bankkonto hinzufügen"
              support-text=""
              @click="onAddBankAccount"
            />
          </mdc-grid-list>
        </div>
      </div>
      <mdc-subheading>Spenden</mdc-subheading>
      <div class="flex">
        <mdc-button class="button" outlined @click="deleteAllDonations">
          <i class="material-icons mdc-button__icon">delete_sweep</i>Spenden löschen
        </mdc-button>
      </div>
      <div v-for="(donation, index) in donator.donations" :key="donation.id" class="icon-row">
        <span class="icon-row__icon icon-row__icon--text">{{index + 1}}</span>
        <div class="icon-row__content">
          <mdc-textfield
            v-model="donation.date"
            :valid="index === donator.donations.length - 1 || isValidDate(donation.date)"
            label="Datum" outline class="one-third"
            @change="resortDonations(donation)"
          />
          <mdc-textfield
            v-model="donation.sum"
            :valid="index === donator.donations.length - 1 || isValidSum(donation.sum)"
            label="Betrag" outline class="one-third"
            :ref="`sum-${donation.id}`"
          />
          <div class="toggle-container one-third">
            <mdc-icon-toggle class="toggle" v-model="donation.isMemberschipFee"
              :toggle-on="{icon:'person', label: 'Mitgliedsbeitrag'}"
              :toggle-off="{icon: 'money', label: 'Spende'}">
            </mdc-icon-toggle>
            <span v-if="donation.isMemberschipFee">Mitgliedsbeitrag</span>
            <span v-else>Spende</span>
            <mdc-button @click="deleteDonation(donation)" style="margin-left: 5px;">
              <mdc-icon class="mdc-button__icon" icon="delete" style="font-size: 20px; margin-right: 5px"/>
            </mdc-button>
          </div>
        </div>
      </div>
    </mdc-layout-cell>
    <mdc-layout-cell span=12 >
      <mdc-button class="button" @click="$router.push({name: 'donatorsOverview'})">
        <i class="material-icons mdc-button__icon">arrow_back</i>Zurück
      </mdc-button>
      <mdc-button class="button" @click="onSave" raised>
        <i class="material-icons mdc-button__icon">save</i>Speichern
      </mdc-button>
    </mdc-layout-cell>
    <mdc-snackbar ref="snackbar"/>
  </mdc-layout-grid>
</template>

<script>
import Donator from '@/store/models/Donator'
import Address from '@/store/models/Address'
import Donation from '@/store/models/Donation'
import _ from 'lodash'
import moment from 'moment'
import uniqueId from '@/helpers/uniqueId'
import account from '@/assets/account_balance-24px.svg'
import add from '@/assets/add-24px.svg'

export default {
  name: 'DonatorsEdit',
  data () {
    return {
      icons: {
        account,
        add
      },
      donator: new Donator()
    }
  },
  computed: {
    verb () {
      return this.id ? 'bearbeiten' : 'erstellen'
    },
    isAllDonationsValid () {
      var self = this
      let foundIndex = _.findIndex(this.donator.donations, ({ date, sum }) => {
        return !self.isValidSum(sum) || !self.isValidDate(date)
      })
      let allValid = (
        foundIndex === this.donator.donations.length - 1 ||
        foundIndex === -1
      )
      return allValid
    },
    isAllDonationsDateValid () {
      var self = this
      var donations = this.donator.donations
      donations = _.slice(donations, 0, donations.length - 1)
      return !_.some(donations, (donation) => !self.isValidDonationDate(donation))
    },
    bankAccounts () {
      return this.donator && this.donator.bankAccounts
    }
  },
  props: {
    id: {
      type: [Number, String],
      default: null
    }
  },
  methods: {
    deleteDonation (donation) {
      // delete the donation in the store
      if (donation && donation.$delete) donation.$delete()

      // delete the donation in temp donator
      donation.date = ''
      donation.sum = ''

      this.removeEmptyDonations()
    },
    newTransactionsLabel (bankAccount) {
      return (bankAccount && bankAccount.transactions && bankAccount.transactions.length && `(${bankAccount.transactions.length}) `) || ''
    },
    async resortDonations (donation) {
      var self = this
      var isLastFieldWithData = this.isDonationWithContent(_.last(this.donator.donations))
      if (isLastFieldWithData) {
        this.donator.donations.push({ id: _.uniqueId('new_'), date: '', sum: '', isMemberschipFee: false })
      }

      this.removeEmptyDonations()

      // if all data is valid, sort donations by date
      if (this.isAllDonationsDateValid) {
        let validDonations = _.filter(this.donator.donations, this.isValidDonationDate)
        let invalidDonations = _.filter(this.donator.donations, (donation) => !self.isValidDonationDate(donation))
        let sortedDonations = [
          ..._.sortBy(validDonations, [this.unixTimeOfDonation]),
          ...invalidDonations
        ]
        // only change donations, if we really resorted them
        if (!_.isEqual(sortedDonations, this.donator.donations)) {
          this.donator.donations = sortedDonations
        }
      }

      if (!donation || !donation.id) return

      await this.$nextTick()
      _.first(this.$refs[`sum-${donation.id}`]).focus()
    },
    removeEmptyDonations () {
      for (var index in this.donator.donations) {
        if (
          _.toNumber(index) !== _.toNumber(this.donator.donations.length - 1) &&
          !this.isDonationWithContent(this.donator.donations[index])
        ) {
          _.pullAt(this.donator.donations, [index])
          this.donator.donations = _.clone(this.donator.donations)
        }
      }
    },
    unixTimeOfDonation (donation) {
      return moment(donation.date, 'DD.MM.YYYY').unix()
    },
    isDonationWithContent (donation) {
      return donation && (donation.date || donation.sum)
    },
    idWatcher (newId) {
      if (newId) {
        this.donator = _.cloneDeep(Donator.query().with('donations').with('address').with('bankAccounts.transactions').find(newId))
      } else {
        this.donator = new Donator()
      }
      this.donator.address = this.donator.address || new Address()
      this.donator.donations = this.donator.donations && this.donator.donations.length ? this.donator.donations : [new Donation()]
      // convert all sum numbers to string
      for (let donation of this.donator.donations) {
        if (_.isNumber(donation.sum)) {
          donation.sum = donation.sum ? _.replace(donation.sum.toString(), '.', ',') : ''
        }
      }
    },
    isValidDate (date) {
      return (
        /^[0-3]?\d\.[0-1]?\d\.\d{4}$/.test(date) &&
        moment(date, 'DD.MM.YYYY').isValid()
      )
    },
    isValidSum (sum) {
      return !!(sum && /^\d*(,\d\d?)?$/.test(sum))
    },
    isValidDonationDate (donation) {
      return this.isValidDate(donation.date)
    },
    async saveDonator () {
      // check, if all data is valid
      let allValid = this.isAllDonationsValid

      // if not, show a snackbar and return
      if (!allValid) {
        this.$refs.snackbar.show({ message: '😱 Einige Daten sind ungültig 😱' })
        return
      }

      // if valid, save to store and go back to overview
      var donator = _.cloneDeep(this.donator)
      donator.donations = _.filter(donator.donations, this.isDonationWithContent)
      donator.donations = _.map(donator.donations, (donation) => {
        var id = _.startsWith(donation.id, 'new_') ? undefined : donation.id
        return {
          id,
          date: donation.date,
          isMemberschipFee: donation.isMemberschipFee,
          isWaiverOfRefund: donation.isWaiverOfRefund,
          sum: _.toNumber(_.replace(donation.sum, ',', '.'))
        }
      })
      if (!this.id) {
        donator.id = uniqueId()
      }
      await Donator.insert({
        data: donator
      })
      return true
    },
    async onSave () {
      if (!await this.saveDonator()) return
      this.$router.push({ name: 'donatorsOverview' })
    },
    async onAddBankAccount () {
      if (!await this.saveDonator()) return
      this.$router.push({
        name: 'donatorsBankAccount',
        params: { id: this.id },
        query: { name: this.donator.name }
      })
    },
    async onAddTransactions (bankAccount) {
      if (!await this.saveDonator()) return
      this.$router.push({
        name: 'donatorsTransactions',
        params: { id: this.id, iban: bankAccount.iban }
      })
    },
    async deleteAllDonations () {
      for (var donation of this.donator.donations) {
        donation.$delete && donation.$delete()
      }
      this.donator.donations = [{ id: _.uniqueId('new_'), date: '', sum: '', isMemberschipFee: false }]
    }
  },
  watch: {
    id: {
      handler: 'idWatcher',
      immediate: true
    }
  },
  created () {
    this.resortDonations()
  }
}
</script>

<style lang="sass" scoped>
  .button
    margin-right: 1rem
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

  .flex
    display: flex
    justify-content: flex-end
    .button
      flex-grow: 0
      flex-shrink: 0
</style>
