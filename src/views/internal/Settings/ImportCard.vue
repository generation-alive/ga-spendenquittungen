<template>
  <mdc-card>
    <mdc-card-header
      title="Daten / Importe" >
    </mdc-card-header>
    <mdc-card-text>
      <div class="desc">Import von .json oder .csv Dateien</div>
      <mdc-button @click="$refs.donators.click()" outlined class="button">Spender</mdc-button>
      <input type="file" ref="donators" accept="application/json" v-show="false" @change="onDonatorsUpload"/>
      <mdc-button @click="$refs.transactions.click()" outlined class="button">Kontoauszüge</mdc-button>
      <input type="file" ref="transactions" accept=".csv" v-show="false" @change="onTransactionsUpload"/>
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
import { importDonators, importTransactions } from '@/helpers/importData'

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
  },
  methods: {
    processFileEventWith (event, processor) {
      var fr = new FileReader()
      const self = this
      fr.onload = async (file) => {
        let result = file.target.result
        try {
          await processor(result)
          self.$refs.snackbar.show({ message: '👌🏻 Daten erfolgreich importiert 👌🏻' })
        } catch (e) {
          self.$refs.snackbar.show({ message: '❌ Etwas ist schiefgelaufen ❌' })
          console.error(e)
        }
      }
      fr.readAsText(event.target.files[0])
    },
    onDonatorsUpload (e) {
      this.processFileEventWith(e, (fileContent) => {
        importDonators(JSON.parse(fileContent))
      })
    },
    onTransactionsUpload (e) {
      this.processFileEventWith(e, importTransactions)
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
