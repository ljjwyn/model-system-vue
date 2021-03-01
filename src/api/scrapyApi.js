import request from '@/utils/request'
import axios from 'axios'
import {pythonUrlScrapy, baseUrl} from './axiosApi'

// 设置种子url
export const setRootWords = (data) =>
  request({
    url: pythonUrlScrapy+'setrootwords',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"rootWordsList":data}
  });

// 获取种子url
export const getRootWords = (data) =>
  request({
    url: pythonUrlScrapy+'getrootwords',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"uid":data}
  });


// 启动爬取
export const startCrawl = () =>
  request({
    url: pythonUrlScrapy+'start',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "GET"
  });


// 终止爬取
export const stopCrawl = () =>
  request({
    url: pythonUrlScrapy+'stop',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "GET"
  });
