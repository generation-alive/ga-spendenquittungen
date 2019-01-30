<template>
  <div class="donators-print">
    <div class="page" size="A4">
      <img :src="gaLogo" alt="">
    </div>
    <div size="A4"></div>
  </div>
</template>
<script>
import gaLogo from '@/assets/ga-logo.svg'

export default {
  name: 'DonatorsPrint',
  data () {
    return {

    }
  },
  props: {
    id: String
  },
  created () {
    this.gaLogo = gaLogo
  }
}
</script>
<style lang="sass" scoped>
.donators-print
  background: rgb(204, 204, 204)
  padding: 0.5cm 0
  @media print
    padding: 0

.page
  background: white
  display: block
  margin: 0 auto
  margin-bottom: 0.5cm
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5)
  &[size="A4"]
    width: 21cm
    height: 29.7cm

@media print
  .donators-print, .page
    margin: 0
    box-shadow: 0
</style>
