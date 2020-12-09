import request from "@/utils/request";
import qs from 'qs'
//登录

const baseUrl = "http://127.0.0.1:8080/webAgorithm";
export const login = data =>
  request({
    url: baseUrl+"/login",
    //url: "/login",
    method: "post",
    data
  });
//登录信息
export const userInfo = token =>
  request({
    //url: "/user/info",
    url: baseUrl+"/user/info",
    method: "post",
    data: {
      token
    }
  });
//获取用户详情
export const userInformation = data =>
  request({
    //url: "/user/info",
    url: baseUrl+"/userinformation",
    method: "post",
    data
  });
//用户列表
export const userList = data =>
  request({
    url: "/user/list",
    method: "post",
    data
  });
//获取角色列表
export const roleList = data =>
  request({
    url: "/role/list",
    method: "post",
    data
  });
//获取权限总菜单
export const roleMenus = data =>
  request({
    url: "/role/menus",
    method: "post",
    data
  });
