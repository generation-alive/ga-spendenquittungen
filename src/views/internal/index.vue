<template>
  <mdc-layout-app>

    <mdc-top-app-bar slot="toolbar" title="GA Spendenquittungen" event="toggle-drawer">
      <mdc-top-app-bar-action icon="help"></mdc-top-app-bar-action>
    </mdc-top-app-bar>

    <mdc-drawer slot="drawer" toggle-on="toggle-drawer" temporary>
      <mdc-drawer-list>
        <mdc-drawer-item start-icon="people">Spender</mdc-drawer-item>
        <mdc-drawer-divider class="divider-spacer"/>
        <mdc-drawer-item start-icon="settings">Einstellungen</mdc-drawer-item>
      </mdc-drawer-list>
    </mdc-drawer>

    <main>

    </main>

  </mdc-layout-app>
</template>

<script>
export default {
  name: 'Internal',
  props: {
  }
}
</script>

<style lang="sass">
  .divider-spacer
    margin-top: .5rem
    margin-bottom: .5rem

</style>
