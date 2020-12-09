const data = {
  admin: {
    token: 'admin-token',
    roles: ['admin'],
    username: 'admin',
    imgurl:
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1405522781,1243858681&fm=26&gp=0.jpg'
  },
  edit: {
    token: 'editor-token',
    roles: ['editor'],
    username: 'editor',
    imgurl:
      'https://it.ouc.edu.cn/_upload/tpl/04/ff/1279/template1279/images/loading.jpg'
  }
}

export default {
  'post|/user/info': option => {
    let { token } = JSON.parse(option.body)
    if (token === 'admin-token') {
      token = 'admin'
    } else {
      token = 'edit'
    }
    return {
      code: 20000,
      data: data[token]
    }
  }
}
