import _ from 'lodash'

export const mapModelProp = (Model, index, propertyPath, { withModels, method }) => {
  withModels = withModels || []
  method = method || 'update'
  var getFullData = function () {
    let query = Model.query()
    for (let withModel of withModels) {
      query = query.with(withModel)
    }
    return query.find(index)
  }
  var get = function () {
    let fullData = getFullData()
    if (propertyPath) {
      return _.property(propertyPath)(fullData)
    }
    return fullData
  }
  return {
    get,
    set (newValue) {
      if (propertyPath) {
        let data = { id: index }

        // get the current data
        let fullData = getFullData()
        // step into the path and add possible ids
        let pathSteps = _.toPath(propertyPath)
        var stepRef = fullData
        for (let pathIndex in pathSteps) {
          let pathStep = pathSteps[pathIndex]
          stepRef = stepRef[pathStep]
          if (stepRef && stepRef.id) {
            let pathToId = [..._.slice(pathSteps, 0, pathIndex + 1), 'id']
            _.set(
              data,
              pathToId,
              stepRef.id
            )
          }
        }

        _.set(data, propertyPath, newValue)
        Model[method]({ data })
      } else {
        Model[method]({ data: { id: index, ...newValue } })
      }
    }
  }
}

export const mapModelProps = (Model, index, propertyPaths, options) => {
  var returnObj = {}
  for (let propertyPath of propertyPaths) {
    let key = _.last(_.toPath(propertyPath))
    returnObj[key] = mapModelProp(Model, index, propertyPath, options || {})
  }
  return returnObj
}
