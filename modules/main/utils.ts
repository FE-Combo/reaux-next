import { isServer } from '../../framework';
import axios from "axios";
import cookie from 'js-cookie';
import Router from "next/router";
import {NextPageContext, NextApiRequest} from "next";

const LOGIN_PATH = "/login"

export function ajaxInterceptorsInServer(context: NextPageContext) {
    if(isServer) {
        axios.defaults.baseURL = `http://localhost:${process.env.PORT || 3000}`;
        const req = context?.req as NextApiRequest;
        axios.interceptors.request.use(
          function (config) {
            // 避免多次注册多次执行
            if(config?.headers?.['x-protocol']) {
              return config;
            }
            if (!config.headers) {
              config.headers = {};
            }
            config.headers['x-protocol'] = 'highway';
            if(req?.cookies?.['csrf-token']) {
              (config.headers['csrf-token'] =
              req?.cookies?.['csrf-token']);
            }
            config.headers['Cookie'] = Object.entries(
              req?.cookies || {}
            )
              .map(([key, value]) => `${key}=${value}`)
              .join(';');
            if(req?.headers?.["x-b3-traceid"]) {
                config.headers["x-b3-traceid"] = req?.headers?.["x-b3-traceid"] as string;
            }
            if(req?.headers?.["x-b3-parentspanid"]) {
                config.headers["x-b3-parentspanid"] = req?.headers?.["x-b3-parentspanid"] as string
            } 
            if(req?.headers?.["x-b3-spanid"]) {
                config.headers["x-b3-spanid"] = req?.headers?.["x-b3-spanid"] as string
            }
            if(req?.headers?.["x-b3-sampled"]) {
                config.headers["x-b3-sampled"] = req?.headers?.["x-b3-sampled"] as string
            }    
            return config;
          },
          function (error) {
            return Promise.reject(error);
          }
        );
    
        axios.interceptors.response.use(function(response){
          if(response.data.code === "SID_INVALID") {
            const res = context.res;
            if(res) {
                try {
                    res.setHeader('Location', LOGIN_PATH);
                    res.statusCode = 302;
                } catch (error) {  
                }
            }
          }
          return response;
        })
    }
}

export function ajaxInterceptorsInClient() {
    if(!isServer) {
        axios.interceptors.request.use(
            function (config) {
               // 避免多次注册多次执行
            if(config?.headers?.['x-protocol']) {
              return config;
            }

              if (!config.headers) {
                config.headers = {};
              }
              config.headers['x-protocol'] = 'highway';
              if(cookie.get('csrf-token')) {
                config.headers['csrf-token'] = cookie.get('csrf-token')!
              }
              return config;
            },
            function (error) {
              return Promise.reject(error);
            }
          );
      
          axios.interceptors.response.use(function(response){
            if(response.data.code === "SID_INVALID") {
              Router.push(LOGIN_PATH)
            }
            return response;
          },    function (error) {
            return Promise.reject(error);
          })
    }
}