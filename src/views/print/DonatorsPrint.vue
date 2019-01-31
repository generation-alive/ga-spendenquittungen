<template>
  <div class="donators-print">
    <div class="page">

      <div class="header">
        <img :src="gaLogo" alt="" class="logo">
        <div class="header-window">
          <div class="from">
            <span class="from__name">{{name}}</span> |
            <span class="from__street">{{street}} {{houseNr}}</span> |
            <span class="from__city">{{zip}} {{city}}</span>
          </div>
          <div class="to">
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
        <div class="annotation">
          <p class="annotation__p">
            <span class="annotation__title">Hinweis:</span><br>
            Wer vorsätzlich oder grob fahrlässig eine unrichtige
            Zuwendungsbestätigung erstellt oder veranlasst, dass Zuwendungen
            nicht zu den in der Zuwendungsbestätigung ausgegebenen
            steuerbegünstigten Zwecken verwendet werden, haftet für die
            entgangene Steuer (§ 10b Abs. 4 EStG, § 9 Abs. 3 KStG, § 9 Nr. 5
            GewStG).
          </p>
          <p class="annotation__p">
            Diese Bestätigung wird nicht als Nachweis für die steuerliche
            Berücksichtigung der Zuwendung anerkannst, wenn das Datum des
            Freistellungsbescheides länger als 5 Jahre bzw. das Datum der
            Feststellung der Einhaltung der satzungsmäßigen Voraussetzungen nach
            § 60a Abs. 1 AO länger als 3 Jahre seit Ausstellung des Bescheides
            zurückliegt (§ 63 Abs. 5 AO).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import gaLogo from '@/assets/ga-logo.svg'
import { de as inWordsDe } from 'in-words'
import _ from 'lodash'
import moment from 'moment'
import { mapModelProps } from '@/store/helpers/mapModel'
import Organization from '@/store/models/Organization'
import GeneralSettings from '@/store/models/GeneralSettings'
import Donator from '@/store/models/Donator'

export default {
  name: 'DonatorsPrint',
  data () {
    return {
      sum: 1324.59
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
    }
  },
  created () {
    this.gaLogo = gaLogo
  }
}
</script>
<style lang="sass" scoped>
$a4width: 21cm
$a4height: 29.7cm
$pLeft: 2.4cm
$pRight: 1.2cm
$pTop: 1.5cm
$pBottom: 1cm
$width: $a4width - $pRight - $pLeft
$height: $a4height - $pTop - $pBottom

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

.logo
  position: absolute
  right: 1.2cm
  top: 1.5cm
  width: 6.4cm

.header-window
  margin-top: 3.2cm

.from
  font-size: 8pt
  &__name
    font-weight: 600

.to
  margin-top: 5mm

.intro
  margin-top: 1.5cm
  &__title
    font-size: 20pt
    line-height: 110%
    font-weight: 700
    margin-bottom: 1mm

.donator-details
  margin-top: 1cm

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

.signature
  font-family: Merriweather
  font-size: 9pt
  margin-top: 1cm
  margin-bottom: 5mm

.annotation
  font-size: 7pt
  line-height: 120%
  &__p
    margin-bottom: 3mm
  &__title
    font-weight: 600
    text-decoration: underline

</style>
