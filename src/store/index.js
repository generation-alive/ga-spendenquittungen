import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'

// Models
import Address from './models/Address'
import Organization from './models/Organization'
import Purpose from './models/Purpose'
import GeneralSettings from './models/GeneralSettings'

// Modules
import addresses from './modules/addresses'
import organizations from './modules/organizations'
import purposes from './modules/purposes'
import generalSettings from './modules/generalSettings'

Vue.use(Vuex)

// Create new instance of Database.
const database = new VuexORM.Database()

// Register Model and Module. The First argument is the Model, and
// second is the Module.
database.register(Address, addresses)
database.register(Organization, organizations)
database.register(Purpose, purposes)
database.register(GeneralSettings, generalSettings)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})

export default store
