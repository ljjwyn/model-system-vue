import request from '@/utils/request'
import axios from 'axios'
import {pythonUrl, baseUrl} from './axiosApi'

// 删除任务及其产生的模型，参数等信息
export const modelsPredict = (data) =>
  request({
    url: pythonUrl+'modelspredict',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });
