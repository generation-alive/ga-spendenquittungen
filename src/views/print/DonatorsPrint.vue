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

      <div class="intro">
        <div class="intro__title">
          Sammelbestätigung über Geldzuwendungen / Mitgliedsbeitrag
        </div>
        <div class="intro__text">
          im Sinne des § 10b EStG an eine der in § 5 Abs. 1 Nr. 9 des
          Körperschaftsteuergesetzes bezeichneten Körperschaften,
          Personenvereinigungen oder Vermögensmassen
        </div>
      </div>

      <div class="donator-details">
        <div class="donator-detail donator-detail--large">
          <div class="donator-detail__label">Name und Wohnort des Zuwendenden:</div>
          <div class="donator-detail__data">
            {{donator.name}}, {{donator.address && donator.address.city}}
          </div>
        </div>
        <div class="donator-details__line">
          <div class="donator-detail donator-detail">
            <div class="donator-detail__label">Gesamtbetrag der Zuwendung -in Ziffern-</div>
            <div class="donator-detail__data">€ - {{donator.totalSum | currency('')}} -</div>
          </div>
          <div class="donator-detail donator-detail--centered">
            <div class="donator-detail__label">-in Buchstaben-</div>
            <div class="donator-detail__data">- {{inWords}} -</div>
          </div>
        </div>
        <div class="donator-detail">
          <div class="donator-detail__label">Zeitraum der Sammelbestätigung</div>
          <div class="donator-detail__data">{{period}}</div>
        </div>
      </div>

      <div class="text">
        <p>
          Wir sind wegen {{purposesAsText}} nach dem Freistellungsbescheid des
          <strong>Finanzamtes {{taxName}}, St.Nr. {{taxNr}}, vom {{taxDate}} für
          den letzten Veranlagungszeitraum {{taxPeriod}}</strong>, nach § 5 Abs.
          1 Nr. 9 des Körperschaftsteuergesetzes von der Körperschaftsteuer und
          nach § 3 Nr. 6 des Gewerbesteuergesetzes von der Gewerbesteuer
          befreit.
        </p>
        <p>
          Es wird bestätigt, dass die Zuwendung nur zur {{purposesAsText}}
          verwendet wird.
        </p>
        <p>
          Es wird bestätigt, dass über die in der Gesamtsumme enthaltenen
          Zuwendungen keine weiteren Bestätigungen, weder formelle
          Zuwendungsbestätigungen noch Beitragsquittungen oder ähnliches
          ausgestellt wurden und werden.
        </p>
        <p>
          Ob es sich um einen Verzicht auf Erstattung von Aufwendungen handelt,
          ist der Anlage zur Sammelbestätigung zu entnehmen.
        </p>
        <p>
          {{city}}, {{date}}
        </p>
        <p class="signature">
          - KassenführerIn -
        </p>
      </div>

      <print-annotation />

      <print-footer />
      <img v-if="overlayActive" :src="overlay" alt="" class="overlay">
    </div>

    <div class="page">
      <print-logo />
      <div class="title-attachment">Anlage zur Sammelbestätigung vom {{date}}</div>
      <p v-if="donator">{{donator.name}}<span v-if="donator.address">,
        {{donator.address.street}} {{donator.address.houseNr}} in
        {{donator.address.zip}} {{donator.address.city}}
      </span></p>

      <table class="donation-table">
        <thead>
          <tr>
            <th class="cell--date">Datum</th>
            <th class="cell--type">Art der Zuwendung</th>
            <th class="cell--waive">Verzicht auf die Erstattung von Aufwendungen (ja/nein)</th>
            <th class="cell--sum">Betrag</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donation in donator.donations" :key="donation.id">
            <td class="cell--date">{{donation.date}}</td>
            <td class="cell--type">{{donation.isMemberschipFee ? 'Mitgliedsbeitrag' : 'Geldzuwendung'}}</td>
            <td class="cell--waive">{{donation.isWaiverOfRefund ? 'Ja' : 'Nein'}}</td>
            <td class="cell--sum">{{donation.sum | currency}}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-sum">
        <div class="total-sum__left">Gesamtsumme:</div>
        <div class="total-sum__right">
          {{donator.totalSum | currency}}
        </div>
      </div>

      <print-annotation />

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
import PrintAnnotation from '@/views/print/PrintAnnotation'
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
    purposesAsText () {
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
          return _.join([result, value.desc], isNotLast ? ', ' : ' und ')
        },
        ''
      )
    },
    date () {
      return moment().format('dddd, Do MMMM YYYY')
    },
    titleString () {
      return this.donator.name
    }
  },
  components: {
    PrintFooter,
    PrintAnnotation,
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
  padding-top: 1cm

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
