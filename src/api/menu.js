import request from '@/utils/request'

const baseUrl = "http://127.0.0.1:8080/webAgorithm";

export const  getRoutes =(token)=>request({
    //url: '/menus',
    url: baseUrl+'/menus',
    method: 'post',
    data:{
        token
    }
  })
