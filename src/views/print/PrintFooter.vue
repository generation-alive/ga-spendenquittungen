<template>
  <div class="footer">
    <img :src="gaFooter" alt="" class="footer__img">
    <div class="footer__text">
      {{name}}, {{street}} {{houseNr}}, {{zip}} {{city}}
    </div>
  </div>
</template>
<script>
import gaFooter from '@/assets/ga-footer.png'
import { mapModelProps } from '@/store/helpers/mapModel'
import Organization from '@/store/models/Organization'

export default {
  name: 'PrintFooter',
  data: () => ({

  }),
  computed: {
    ...mapModelProps(Organization, 1, [
      'name',
      'address.street',
      'address.houseNr',
      'address.zip',
      'address.city'
    ], { withModels: ['address'] })
  },
  created () {
    this.gaFooter = gaFooter
  }
}
</script>
<style lang="sass" scoped>
@import ./printVars

.footer
  position: absolute
  bottom: 5.6mm
  &__img
    margin-left: - $pLeft
    width: $a4width
  &__text
    position: absolute
    top: 10.9mm
    font-family: 'Merriweather', serif
    font-size: 8.5pt
</style>
