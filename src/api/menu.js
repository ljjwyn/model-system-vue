import request from '@/utils/request'
import {pythonUrl, baseUrl} from './axiosApi'

export const  getRoutes =(token)=>request({
    //url: '/menus',
    url: baseUrl+'/menus',
    method: 'post',
    data:{
        token
    }
  })
