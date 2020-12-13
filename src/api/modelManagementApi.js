import request from '@/utils/request'
import axios from 'axios'
import {pythonUrl, baseUrl} from './axiosApi'

// 删除任务及其产生的模型，参数等信息
export const deleteTask = (data) =>
  request({
    url: baseUrl+'taskManagement/deleteallrecord',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"taskUid":data}
  });
