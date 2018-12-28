<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>

export default {
  data () {
    return {}
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
