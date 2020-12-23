import request from '@/utils/request'
import {pythonUrl, baseUrl} from './axiosApi'

export const  getKgGraphData =(keyweords)=>request({
  url: baseUrl+'CMeKG/search',
  headers : {
    'Content-Type' : 'application/json',
  },
  method: 'post',
  data:{"keyWords":keyweords}
})
