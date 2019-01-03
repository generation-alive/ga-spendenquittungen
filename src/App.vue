<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
import Organization from '@/store/models/Organization'
import GeneralSettings from '@/store/models/GeneralSettings'

export default {
  data () {
    return {}
  },
  beforeCreate () {
    Organization.create({ data: {
      id: 1,
      name: 'Generation Alive e.V.',
      address: {
        street: 'Eisenbahnstraße',
        houseNr: '23',
        zip: '51645',
        city: 'Gummersbach'
      },
      purpose: [
        { desc: 'Förderung der Religion im In- und Ausland' },
        { desc: 'Förderung der Volks- und Berufsbildung einschließlich Studentenhilfe' }
      ],
      taxName: 'Gummersbach',
      taxNr: '212/5825/2063',
      taxDate: '26.10.2016',
      taxPeriod: '2015'
    } })
    GeneralSettings.create({ data: {
      period: '01.2018 - 12.2018'
    } })
  }
}
</script>

<style lang="scss">
  $mdc-theme-primary: #212121;
  $mdc-theme-accent: #41b883;
  $mdc-theme-background: #fff;

  @import 'vue-mdc-adapter/dist/styles';

  // First, set the value for variable
  $mdc-typography-font-family: "Roboto Mono", monospace;

  // Then, import required files
  @import "@material/typography/mixins";

  html {
    width: 100%;
    height: 100%;
  }

  body {
    @include mdc-typography(body2);

    width: 100%;
    min-height: 100%;
    margin: 0;
  }
</style>
