import { createStandardStore } from '@/store/helpers/standardStore'

const namespaced = true

const standardValues = {
  name: 'Generation Alive e.V.',
  street: 'Musterstr.',
  nr: '14a',
  zip: '12345',
  city: 'Musterstadt'

}

const state = {

}
const getters = {

}

const mutations = {

}

const actions = {

}

export default createStandardStore(standardValues, {
  namespaced,
  state,
  getters,
  mutations,
  actions
})
