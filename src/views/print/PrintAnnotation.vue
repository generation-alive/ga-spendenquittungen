<template>
  <div class="annotation">
    <p class="annotation__p">
      <span class="annotation__title">Hinweis:</span><br>
      Wer vorsätzlich oder grob fahrlässig eine unrichtige
      Zuwendungsbestätigung erstellt oder veranlasst, dass Zuwendungen
      nicht zu den in der Zuwendungsbestätigung ausgegebenen
      steuerbegünstigten Zwecken verwendet werden, haftet für die
      entgangene Steuer (§ 10b Abs. 4 EStG, § 9 Abs. 3 KStG, § 9 Nr. 5
      GewStG).
    </p>
    <p class="annotation__p">
      Diese Bestätigung wird nicht als Nachweis für die steuerliche
      Berücksichtigung der Zuwendung anerkannst, wenn das Datum des
      Freistellungsbescheides länger als 5 Jahre bzw. das Datum der
      Feststellung der Einhaltung der satzungsmäßigen Voraussetzungen nach
      § 60a Abs. 1 AO länger als 3 Jahre seit Ausstellung des Bescheides
      zurückliegt (§ 63 Abs. 5 AO).
    </p>
  </div>
</template>
<script>
export default {
  name: 'PrintAnnotation',
  data: () => ({

  })
}
</script>
<style lang="sass" scoped>
@import ./printVars

.annotation
  position: absolute
  width: $width
  bottom: 1.9cm
  font-size: 7pt
  line-height: 120%
  &__p
    margin-bottom: 3mm
  &__title
    font-weight: 600
    text-decoration: underline
</style>
