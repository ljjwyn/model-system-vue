import request from '@/utils/request'
import {pythonUrl, baseUrl} from './axiosApi'

// 获得访问量
export const getVisitorCount = () =>
  request({
    url: baseUrl+'dashboard/visitorcount',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "GET"
  });
