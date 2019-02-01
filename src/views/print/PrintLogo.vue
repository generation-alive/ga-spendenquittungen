<template>
  <img :src="gaLogo" alt="" class="logo">
</template>
<script>
import gaLogo from '@/assets/ga-logo.svg'

export default {
  name: 'PrintLogo',
  data () {
    return {
    }
  },
  created () {
    this.gaLogo = gaLogo
  }
}
</script>
<style lang="sass" scoped>
.logo
  position: absolute
  right: 1.2cm
  top: 1.5cm
  width: 6.4cm

</style>
