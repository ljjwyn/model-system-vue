import { asyncRoutes, editAsyncRoutes } from '../Json/index.js'
import { deepClone } from '../src/utils/index.js'

export default {
  'post|/menus': option => {
    console.log('option', option)
    const { token } = JSON.parse(option.body)
    if (token === 'admin-token') {
      console.log('asyncRoutes', asyncRoutes)
      return {
        code: 20000,
        data: deepClone([...asyncRoutes])
      }
    }
    if (token === 'editor-token') {
      return {
        code: 20000,
        data: deepClone([...editAsyncRoutes])
      }
    }
  }
}
