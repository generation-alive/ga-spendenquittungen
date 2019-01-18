import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import createPersistedState from 'vuex-persistedstate'

// Models
import Address from './models/Address'
import Organization from './models/Organization'
import Purpose from './models/Purpose'
import GeneralSettings from './models/GeneralSettings'
import Donation from './models/Donation'
import Donator from './models/Donator'

// Modules
import addresses from './modules/addresses'
import organizations from './modules/organizations'
import purposes from './modules/purposes'
import generalSettings from './modules/generalSettings'
import donations from './modules/donations'
import donators from './modules/donators'

Vue.use(Vuex)

// Create new instance of Database.
const database = new VuexORM.Database()

// Register Model and Module. The First argument is the Model, and
// second is the Module.
database.register(Address, addresses)
database.register(Organization, organizations)
database.register(Purpose, purposes)
database.register(GeneralSettings, generalSettings)
database.register(Donation, donations)
database.register(Donator, donators)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [
    VuexORM.install(database),
    createPersistedState()
  ]
})

export default store
