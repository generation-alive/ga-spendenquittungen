import _ from 'lodash'

export const mapModelProp = (Model, index, propertyPath, { withModels, method }) => {
  withModels = withModels || []
  method = method || 'update'
  return {
    get () {
      let query = Model.query()
      for (let withModel of withModels) {
        query = query.with(withModel)
      }
      let result = query.find(index)
      if (propertyPath) {
        return _.property(propertyPath)(result)
      }
      return result
    },
    set (newValue) {
      if (propertyPath) {
        let data = { id: index }
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
