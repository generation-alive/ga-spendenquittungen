<template>
  <mdc-layout-app>

    <mdc-top-app-bar slot="toolbar" title="GA Spendenquittungen" event="toggle-drawer">
      <mdc-top-app-bar-action icon="help"></mdc-top-app-bar-action>
    </mdc-top-app-bar>

    <mdc-drawer slot="drawer" toggle-on="toggle-drawer" temporary>
      <mdc-drawer-list>
        <mdc-drawer-item @click="$router.push({ name: 'donatorsOverview' })" start-icon="people">Spender</mdc-drawer-item>
        <mdc-drawer-divider class="divider-spacer"/>
        <mdc-drawer-item start-icon="settings" @click="$router.push({ name: 'settingsOverview' })">Einstellungen</mdc-drawer-item>
      </mdc-drawer-list>
    </mdc-drawer>

    <main class="main">
      <router-view />
    </main>

  </mdc-layout-app>
</template>

<script>
export default {
  name: 'Internal',
  data () {
    return {
      to: { name: 'settingsOverview' }
    }
  },
  props: {
  },
  methods: {
  }
}
</script>

<style lang="sass" scoped>
  .divider-spacer
    margin-top: .5rem
    margin-bottom: .5rem

  .main
    margin-top: 64px
    @media (max-width: 600px)
      margin-top: 56px

</style>
