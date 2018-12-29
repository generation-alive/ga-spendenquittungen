<template>
  <mdc-card>
    <mdc-card-header v-if="title || subtitle"
      :title="title"
      :subtitle="subtitle" >
    </mdc-card-header>
    <mdc-card-text v-if="purposes && purposes.length">
      <mdc-list>
        <mdc-list-item v-for="(purpose, index) in purposes" :key="index">
          <mdc-icon slot="start-detail" icon="flag" />
          {{purpose}}
        </mdc-list-item>
      </mdc-list>
    </mdc-card-text>
    <mdc-card-text>
      <mdc-list two-line>
        <mdc-list-item>
          <span>Gummersbach</span>
          <span slot="secondary">Finanzamt</span>
        </mdc-list-item>
        <mdc-list-item>
          <span>212/5825/2063</span>
          <span slot="secondary">Steuer Nummer</span>
        </mdc-list-item>
      </mdc-list>
    </mdc-card-text>
    <mdc-card-actions>
      <mdc-card-action-icons>
        <mdc-card-action-icon icon="edit" />
      </mdc-card-action-icons>
    </mdc-card-actions>
  </mdc-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    purposes: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
