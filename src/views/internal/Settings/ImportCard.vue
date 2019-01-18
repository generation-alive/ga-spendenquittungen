<template>
  <mdc-card>
    <mdc-card-header
      title="Daten / Importe" >
    </mdc-card-header>
    <mdc-card-text>
      <div class="desc">Import von .json Dateien aus der GA Datenbank</div>
      <mdc-button @click="onDonatorsButtonClick" outlined class="button">Spender</mdc-button>
      <input type="file" ref="donators" accept="application/json" v-show="false" @change="onDonatorsUpload"/>
    </mdc-card-text>
    <mdc-card-actions v-if="routeOnEdit">
      <mdc-card-action-icons>
        <mdc-card-action-icon icon="edit" />
      </mdc-card-action-icons>
    </mdc-card-actions>
    <mdc-snackbar ref="snackbar"/>
  </mdc-card>
</template>

<script>
import _ from 'lodash'
import { importDonators } from '@/helpers/importData'

export default {
  name: 'ImportCard',
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
  },
  methods: {
    onDonatorsButtonClick () {
      this.$refs.donators.click()
    },
    onDonatorsUpload (e) {
      var fr = new FileReader()
      fr.onload = this.onDonatorsRead
      fr.readAsText(e.target.files[0])
    },
    onDonatorsRead (file) {
      let result = file.target.result
      try {
        importDonators(JSON.parse(result))
        this.$refs.snackbar.show({ message: '👌🏻 Daten erfolgreich importiert 👌🏻' })
      } catch (e) {
        this.$refs.snackbar.show({ message: '❌ Etwas beim Import ist schiefgelaufen ❌' })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .desc
    margin-bottom: .5rem
  .button
    margin-right: .5rem
</style>
