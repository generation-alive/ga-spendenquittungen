<template>
  <mdc-layout-grid>
    <mdc-layout-cell span=12 >
      <mdc-display>Bearbeiten: Allgemein</mdc-display>
      <mdc-button @click="$router.push({name: 'settingsOverview'})" raised><i class="material-icons mdc-button__icon">arrow_back</i>Zurück</mdc-button>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=6 tablet=6 phone=12>
      <div class="icon-row">
        <mdc-icon icon="calendar_today" class="icon-row__icon"/>
        <div class="icon-row__content">
          <mdc-textfield v-model="period" label="Zeitraum der Spendenbescheinigung" outline class="full"/>
        </div>
      </div>
    </mdc-layout-cell>
    <mdc-layout-cell span=12 >
      <mdc-button @click="$router.push({name: 'settingsOverview'})" raised><i class="material-icons mdc-button__icon">arrow_back</i>Zurück</mdc-button>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import GeneralSettings from '@/store/models/GeneralSettings'
import { mapModelProps } from '@/store/helpers/mapModel'

export default {
  name: 'SettingsEditGeneral',
  computed: {
    ...mapModelProps(GeneralSettings, 1, [
      'period'
    ])
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
