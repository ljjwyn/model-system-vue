const data = {
  data: [{
    id: 1,
    role: '管理员',
    token: 'admin-token',
    time: '2020-05-25 10:23:34'
  }, {
    id: 2,
    role: '编辑',
    token: 'editor-token',
    time: '2020-05-25 10:23:34'
  }],
  cont: 2
}
export default {
  'post|/role/list': option => {
    // let { token } = JSON.parse(option.body)
    return {
      code: 20000,
      data
    }
  }
}
