import { createStandardStore } from '@/store/helpers/standardStore'

const namespaced = true

const standardValues = {
  donatorSearch: ''
}

const state = () => ({

})
export default createStandardStore(standardValues, {
  namespaced,
  state
})
