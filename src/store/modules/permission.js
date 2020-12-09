import { asyncRoutes, constantRoutes } from "@/router";
import router from "../../router";
import store from "../index";
/**
 * 前端控制路由（权限筛选）
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * 前端控制路由（递归）
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

// 后端动态路由
function dataArrayToRoutes(data) {
  const res = [];
  data.forEach(item => {
    const tmp = { ...item };
    if (tmp.component === "layout") {
      tmp.component = () => import("@/layout");
    } else {
      let path = tmp.component;
      tmp.component = resolve => require([`@/views/${path}`], resolve);
    }
    if (tmp.children) {
      tmp.children = dataArrayToRoutes(tmp.children);
    }
    res.push(tmp);
  });
  return res;
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = routes;
  },
  SET_WEBROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  receptionRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes;
      if (roles.includes("admin")) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit("SET_WEBROUTES", accessedRoutes);
      store.state.user.menus = accessedRoutes;
      resolve(accessedRoutes);
    });
  },
  allRoutes({ commit, state }, { menus }) {
    return new Promise(resolve => {
      let accessedRoutes;
      accessedRoutes = dataArrayToRoutes(menus);
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
