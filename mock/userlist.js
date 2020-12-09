const data = {
  data: [
    {
      id: 1,
      role: '管理员',
      username: 'admin',
      email: 'lixhgjsn@163.com',
      time: '2020-05-25 10:23:34',
      content: '我是admin，我拥有最高权限，我可以控制角色',
      imgurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591530122836&di=b7bd6587bd70954db2f6a5c7588ca5ba&imgtype=0&src=http%3A%2F%2Fimg.wxcha.com%2Ffile%2F201901%2F03%2Fc447d5e161.jpg%3Fdown'
    },
    {
      id: 2,
      role: '编辑',
      username: 'edit',
      email: 'xxsdav456f@163.com',
      time: '2020-05-25 10:23:34',
      content: '我是eidt，我拥有一般权限，我不可以控制角色',
      imgurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591530122808&di=40406c6d88125fe5caaa4379795caa25&imgtype=0&src=http%3A%2F%2Fimg.wxcha.com%2Ffile%2F201802%2F05%2Fccaedecda3.jpg%3Fdown'
    }
  ],
  cont: 2
}
export default {
  'post|/user/list': option => {
    // let { token } = JSON.parse(option.body)
    return {
      code: 20000,
      data
    }
  }
}
