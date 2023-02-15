import { isServer } from 'dist';
import { axios } from 'utils/ajax';
import cookie from 'js-cookie';
import encodeurl from 'encodeurl';
import { NextApiRequest, NextPageContext } from 'next';


export const QUIT_LOGIN_CODE = [
  'SID_INVALID',
  'SESSION_INVALID',
  'CSRFTOKEN_INVALID',
  401,
  '401',
];

export const LOGIN_PATH = '/account/login';

export function ajaxInterceptorsInServer(context: NextPageContext) {
  if (isServer) {
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();

    axios.defaults.baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const req = context?.req as NextApiRequest;
    axios.interceptors.request.use(
      function (config) {
        // 避免多次注册多次执行
        if (config?.headers.get('X-Requested-With')) {
          return config;
        }
        config.headers.set('X-Requested-With', 'XMLHttpRequest');

        if (req?.headers?.['x-forwarded-host']) {
          config.headers.set('x-forwarded-host', req?.headers?.['x-forwarded-host']);
        }
        if (req?.headers?.['x_ty_host']) {
          config.headers.set('x_ty_host', req?.headers?.['x_ty_host']);
        }
        if (req?.headers?.['region']) {
          config.headers.set('region', req?.headers?.['region']);
        }

        if (req?.cookies?.['csrf-token']) {
          config.headers.set('csrf-token', req?.cookies?.['csrf-token']);
        }

        config.headers.set(
          'Cookie',
          encodeurl(
            Object.entries(req?.cookies || {})
              .map(([key, value]) => `${key}=${value}`)
              .join(';')
          )
        );

        if (req?.headers?.['x-b3-traceid']) {
          config.headers.set('x-b3-traceid', req?.headers?.['x-b3-traceid'] as string);
        }

        if (req?.headers?.['x-b3-parentspanid']) {
          config.headers.set('x-b3-parentspanid', req?.headers?.['x-b3-parentspanid'] as string);
        }

        if (req?.headers?.['x-b3-spanid']) {
          config.headers.set('x-b3-spanid', req?.headers?.['x-b3-spanid'] as string);
        }

        if (req?.headers?.['x-b3-sampled']) {
          config.headers.set('x-b3-sampled', req?.headers?.['x-b3-sampled'] as string);
        }

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(function (response) {
      if (QUIT_LOGIN_CODE.includes(response.data.code)) {
        const res = context.res;
        if (res) {
          try {
            if (!context.pathname.includes(LOGIN_PATH)) {
              res.setHeader('Location', LOGIN_PATH);
              res.statusCode = 302;
            }
          } catch (error) {}
        }
      }
      return response;
    });
  }
}

export function ajaxInterceptorsInClient() {
  if (!isServer) {
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();

    axios.interceptors.request.use(
      function (config) {
        // 避免多次注册多次执行
        if (config?.headers.get('X-Requested-With')) {
          return config;
        }

        config.headers.set('X-Requested-With', 'XMLHttpRequest');

        if (cookie.get('csrf-token')) {
          config.headers.set('csrf-token', cookie.get('csrf-token')!);
        }

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }
}