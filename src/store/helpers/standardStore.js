import _ from 'lodash'

const normalize = (standardValues) => {
  if (_.isArray(standardValues)) {
    var resultObj = {}
    _.each(standardValues, (standardValue) => {
      resultObj[standardValue] = null
    })
    return resultObj
  } else if (_.isObject(standardValues)) {
    return standardValues
  }
  console.error('"standardValues" should be an Object or an Array, but got', standardValues)
}

const cleanUp = normalize

export const mutationName = (stateName) => 'update' + _.upperFirst(stateName)

export const createStandardState = (standardValues) => {
  let result = cleanUp(standardValues)
  return result
}

export const createStandardGetters = (standardValues) => {
  standardValues = cleanUp(standardValues)
  return _.mapValues(standardValues, (initialValue, getterName) => {
    return (state) => state[getterName]
  })
}

export const createStandardMutations = (standardValues) => {
  standardValues = cleanUp(standardValues)
  var resultObj = {}
  _.each(standardValues, (initialValue, name) => {
    resultObj[mutationName(name)] = (state, newValue) => { state[name] = newValue }
  })
  return resultObj
}

export const mergeStandardIntoStateFunction = (standardValues, stateFunction) => {
  var newStateFunction = () => {
    return _.merge(stateFunction(), createStandardState(standardValues))
  }
  return newStateFunction
}

export const createStandardStore = (standardValues, storeDefinition) => {
  return {
    namespaced: storeDefinition.namespaced,
    state: _.isFunction(storeDefinition.state)
      ? mergeStandardIntoStateFunction(standardValues, storeDefinition.state)
      : {
        ...createStandardState(standardValues),
        ...storeDefinition.state
      },
    getters: {
      ...createStandardGetters(standardValues),
      ...storeDefinition.getters
    },
    mutations: {
      ...createStandardMutations(standardValues),
      reset (state) { state = Object.assign(state, getInitialState(standardValues, storeDefinition.state)) },
      ...storeDefinition.mutations
    },
    actions: {
      ...storeDefinition.actions
    }
  }
}

export const getInitialState = (standardValues, state) => {
  let returnState = createStandardStore(standardValues, { state }).state
  if (_.isFunction(returnState)) {
    return returnState()
  }
  return returnState
}
