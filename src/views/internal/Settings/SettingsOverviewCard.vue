<template>
  <mdc-card>
    <mdc-card-header v-if="title || subtitle"
      :title="title"
      :subtitle="subtitle" >
    </mdc-card-header>
    <mdc-card-text v-if="purposes && purposes.length">
      <mdc-list>
        <mdc-list-item v-for="(purpose, index) in purposesNotEmpty" :key="index">
          <mdc-icon slot="start-detail" icon="flag" />
          {{purpose}}
        </mdc-list-item>
      </mdc-list>
    </mdc-card-text>
    <mdc-card-text v-if="infos">
      <mdc-list two-line>
        <mdc-list-item v-for="(info, type) in infos" :key="type">
          <span>{{info}}</span>
          <span slot="secondary">{{type}}</span>
        </mdc-list-item>
      </mdc-list>
    </mdc-card-text>
    <mdc-card-actions v-if="routeOnEdit">
      <mdc-card-action-icons>
        <router-link :to="routeOnEdit" class="router-link-button">
          <mdc-card-action-icon icon="edit" />
        </router-link>
      </mdc-card-action-icons>
    </mdc-card-actions>
  </mdc-card>
</template>

<script>
import _ from 'lodash'

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
    },
    infos: {
      type: Object,
      default: null
    },
    routeOnEdit: {
      type: [Object, String],
      default: null
    }
  },
  computed: {
    purposesNotEmpty () {
      return _.filter(this.purposes, p => !!p)
    }
  }
}
</script>

<style lang="sass" scoped>
  .router-link-button
    text-decoration: none
</style>
