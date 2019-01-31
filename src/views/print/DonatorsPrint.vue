<template>
  <div class="donators-print">
    <div class="page">

      <div class="header">
        <img :src="gaLogo" alt="" class="logo">
        <div class="header-window">
          <div class="from">
            <span class="from__name">Generation Alive e.V.</span> |
            <span class="from__street">Im Eulenspiegel 22a</span> |
            <span class="from__city">79591 Eimeldingen</span>
          </div>
          <div class="to">
            <div class="to__line">Kai Mario Wittmann</div>
            <div class="to__line">Weiherplatz 24</div>
            <div class="to__line">51674 Wiehl</div>
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
          <div class="donator-detail__data">Kai Mario Wittmann</div>
        </div>
        <div class="donator-details__line">
          <div class="donator-detail donator-detail">
            <div class="donator-detail__label">Gesamtbetrag der Zuwendung -in Ziffern-</div>
            <div class="donator-detail__data">€ - {{sum | currency('')}} -</div>
          </div>
          <div class="donator-detail donator-detail--centered">
            <div class="donator-detail__label">-in Buchstaben-</div>
            <div class="donator-detail__data">- {{inWords}} -</div>
          </div>
        </div>
        <div class="donator-detail">
          <div class="donator-detail__label">Zeitraum der Sammelbestätigung</div>
          <div class="donator-detail__data">siehe Anlage</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import gaLogo from '@/assets/ga-logo.svg'
import { de as inWordsDe } from 'in-words'
import _ from 'lodash'

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

    inWords () {
      let sum = _.round(this.sum, 2)
      let preCommaNumber = _.floor(sum)
      let postCommaNumber = _.round((_.floor(sum, 2) - preCommaNumber) * 100)
      let comma1Number = _.round(_.floor(postCommaNumber, -1) / 10)
      let comma2Number = _.round(postCommaNumber - comma1Number * 10)
      let preComma = inWordsDe(preCommaNumber)
      let comma1 = inWordsDe(_.floor(comma1Number))
      let comma2 = inWordsDe(_.floor(comma2Number))
      return `${preComma} Komma ${comma1} ${comma2}`
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
  font-size: 12pt
  letter-spacing: initial
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

</style>
