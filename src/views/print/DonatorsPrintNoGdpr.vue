<template>
  <div class="donators-print">
    <div class="page">

      <div class="header">
        <print-logo />
        <div class="header-window">
          <div class="header-window__wrapper">
            <div class="from">
              <span class="from__name">{{name}}</span><span> | </span>
              <span class="from__street">{{street}} {{houseNr}}</span><span> | </span>
              <span class="from__city">{{zip}} {{city}}</span>
            </div>
            <div class="to">
              <div class="to__wrapper">
                <div class="to__line">{{donator.name}}</div>
                <div v-if="donator.address" class="to__line">
                  {{donator.address.street}} {{donator.address.houseNr}}
                </div>
                <div v-if="donator.address" class="to__line">
                  {{donator.address.zip}} {{donator.address.city}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <print-footer />
      <img v-if="overlayActive" :src="overlay" alt="" class="overlay">
    </div>
  </div>
</template>
<script>
import gaLogo from '@/assets/ga-logo.svg'
import overlay from '@/assets/DIN_5008_Form_B.svg'
import { de as inWordsDe } from 'in-words'
import _ from 'lodash'
import moment from 'moment'
import { mapModelProps } from '@/store/helpers/mapModel'
import Organization from '@/store/models/Organization'
import GeneralSettings from '@/store/models/GeneralSettings'
import Donator from '@/store/models/Donator'
import PrintFooter from '@/views/print/PrintFooter'
import PrintLogo from '@/views/print/PrintLogo'

export default {
  name: 'DonatorsPrint',
  title: (context) => context.titleString,
  data () {
    return {
      overlayActive: false
    }
  },
  props: {
    id: String
  },
  computed: {
    ...mapModelProps(Organization, 1, [
      'name',
      'address.street',
      'address.houseNr',
      'address.zip',
      'address.city',
      'purpose',
      'taxName',
      'taxNr',
      'taxDate',
      'taxPeriod'
    ], { withModels: ['address', 'purpose'] }),
    ...mapModelProps(GeneralSettings, 1, [
      'period'
    ]),
    donator () {
      return Donator.query().with('address').with('donations').find(this.id)
    },
    donations () {
      return _.sortBy(this.donator.donations, [(donation) => moment(donation.date, 'DD.MM.YYYY').unix()])
    },
    inWords () {
      let sum = _.round(this.donator.totalSum, 2)
      let preCommaNumber = _.floor(sum)
      let postCommaNumber = _.round((_.floor(sum, 2) - preCommaNumber) * 100)
      let comma1Number = _.round(_.floor(postCommaNumber, -1) / 10)
      let comma2Number = _.round(postCommaNumber - comma1Number * 10)
      let preComma = inWordsDe(preCommaNumber)
      let comma1 = inWordsDe(_.floor(comma1Number))
      let comma2 = inWordsDe(_.floor(comma2Number))
      return `${preComma} Komma ${comma1} ${comma2}`
    },
    date () {
      return moment().format('dddd, Do MMMM YYYY')
    },
    titleString () {
      return this.donator.name
    }
  },
  methods: {
    purposesAsText (startWord) {
      startWord = startWord || ''
      var separators = {
        notLast: ', ' + startWord + ' ',
        last: ' und ' + startWord + ' '
      }
      let purposes = _.filter(this.purpose, (purpose) => purpose.desc)
      if (!purposes.length) {
        return 'NOCH KEINE VEREINSZWECKE DEFINIERT'
      }
      return _.reduce(
        purposes,
        (result, value, index, collection) => {
          if (!result) {
            return value.desc
          }
          let isNotLast = index < collection.length - 1
          return _.join(
            [result, value.desc],
            isNotLast ? separators.notLast : separators.last
          )
        },
        ''
      )
    }
  },
  components: {
    PrintFooter,
    PrintLogo
  },
  created () {
    this.gaLogo = gaLogo
    this.overlay = overlay
  }
}
</script>
<style lang="sass" scoped>
@import ./printVars

.donators-print
  background: rgb(204, 204, 204)
  padding: 0.5cm 0
  font-family: 'Open Sans', sans-serif
  font-size: 10pt
  letter-spacing: -.1pt
  line-height: 120%
  @media print
    padding: 0
    margin: 0

.page
  background: white
  display: block
  margin: 0 auto
  margin-bottom: 0.5cm
  width: $width
  height: $height
  padding-right: $pRight
  padding-left: $pLeft
  padding-top: $pTop
  padding-bottom: $pBottom
  position: relative
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5)
  @media print
    box-shadow: 0 0 0.5cm rgba(255, 255, 255, 1)
    margin: 0

.overlay
  position: absolute
  top: 0
  left: 0
  width: $a4width
  opacity: 0.5

.logo
  position: absolute
  right: 1.2cm
  top: 1.5cm
  width: 6.4cm

.header-window
  margin-top: 3cm
  margin-left: -0.5cm
  width: 8.5cm
  height: 4.5cm
  display: flex
  justify-content: space-around
  &__wrapper
    display: inline-block

.from
  font-size: 8pt
  height: 17.7mm
  display: flex
  align-items: flex-end
  span
    padding-bottom: 1mm
  &__name
    font-weight: 600

.to
  height: 27.3mm
  display: flex
  align-items: flex-start
  &__wrapper
    padding-top: 1mm

.intro
  margin-top: 8.46mm
  &__title
    font-size: 18pt
    line-height: 110%
    font-weight: 700
    margin-bottom: 1mm

.donator-details
  margin-top: 0.5cm

  &__line
    display: flex

.donator-detail
  margin-bottom: 4mm
  flex-shrink: 0
  &__label
    font-size: 7pt
    margin-bottom: 2mm
  &__data
    font-size: 9.5pt
    font-weight: 600

  &--large
    .donator-detail
      &__label
        margin: 0 auto
        font-size: 8pt
        margin-bottom: 2mm
      &__data
        font-size: 11pt
  &--centered
    margin-left: 1cm
    display: flex
    flex-direction: column
    align-items: center
    flex-shrink: 1
    .donator-detail
      &__label

      &__data

.text
  p
    margin-block-start: $textMargin
    margin-block-end: $textMargin

.signature
  font-family: Merriweather
  font-size: 9pt
  padding-top: 4.7mm

.title-attachment
  font-size: 15pt
  line-height: 110%
  font-weight: 700
  margin-top: 5cm
  margin-bottom: 1mm

.total-sum
  margin-top: 1cm
  display: flex
  justify-content: space-between
  font-weight: 700

.donation-table
  width: 100%
  border-collapse: collapse
  border-spacing: 0
  padding: 0
  thead, tr, th, tbody, td
    padding: .5mm 0

.cell
  &--date
    width: 3.4cm
    text-align: left
  &--type
    width: 5cm
    text-align: center
  &--waive
    width: 5.5cm
    text-align: center
  &--sum
    text-align: right

</style>
