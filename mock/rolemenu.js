import { asyncRoutes, editAsyncRoutes } from '../Json/index.js'
import { deepClone } from '../src/utils/index.js'

export default {
  'post|/role/menus': option => {
    return {
      code: 20000,
      data: deepClone([...asyncRoutes])
    }
  }
}
