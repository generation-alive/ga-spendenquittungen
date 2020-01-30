<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
import Organization from '@/store/models/Organization'
import GeneralSettings from '@/store/models/GeneralSettings'
// import Donator from '@/store/models/Donator'
// import persons from '@/assets/persons'
// import juristics from '@/assets/juristics'
// import { importPersons, importJuristics } from '@/helpers/importData'

export default {
  data () {
    return {}
  },
  async beforeCreate () {
    if (!Organization.all().length) {
      Organization.create({ data: {
        id: 1,
        address: {},
        purpose: []
      } })
    }

    if (!GeneralSettings.all().length) {
      GeneralSettings.new()
    }

    // importPersons(persons)
    // importJuristics(juristics)
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
  @import "views/print/printVars.sass";

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

  @media print {
    body {
      width: $a4width;
      height: $a4height;
      margin: 0mm 0mm 0mm 0mm;
      /* change the margins as you want them to be. */
    }
  }
</style>
