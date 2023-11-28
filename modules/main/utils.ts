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
        if (config?.headers['X-Requested-With']) {
          return config;
        }
        config.headers['X-Requested-With'] = 'XMLHttpRequest';

        if (req?.headers?.['x-forwarded-host']) {
          config.headers['x-forwarded-host'] = req?.headers?.['x-forwarded-host'];
        }

        if (req?.headers?.['region']) {
          config.headers['region'] = req?.headers?.['region'];
        }

        config.headers['x-protocol'] = 'xxx';

        if (req?.cookies?.['csrf-token']) {
          config.headers['csrf-token'] = req?.cookies?.['csrf-token'];
        }

        config.headers['Cookie'] = encodeurl(
          Object.entries(req?.cookies || {})
            .map(([key, value]) => `${key}=${value}`)
            .join(';')
        );

        if (req?.headers?.['x-b3-traceid']) {
          config.headers['x-b3-traceid'] = req?.headers?.['x-b3-traceid'] as string;
        }

        if (req?.headers?.['x-b3-parentspanid']) {
          config.headers['x-b3-parentspanid'] = req?.headers?.['x-b3-parentspanid'] as string;
        }

        if (req?.headers?.['x-b3-spanid']) {
          config.headers['x-b3-spanid'] = req?.headers?.['x-b3-spanid'] as string;
        }

        if (req?.headers?.['x-b3-sampled']) {
          config.headers['x-b3-sampled'] = req?.headers?.['x-b3-sampled'] as string;
        }

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(function (response) {
      try {
        if (response.headers['set-cookie']) {
          const res = context.res;
          if (res) {
            res.setHeader('set-cookie', response.headers['set-cookie']);
          }
        }
      } catch (error) {
        console.error(error)
      }
      if (QUIT_LOGIN_CODE.includes(response.data.code)) {
        const res = context.res;
        if (res) {
          try {
            if (!context.pathname.includes(LOGIN_PATH)) {
              res.setHeader('Location', LOGIN_PATH);
              res.statusCode = 302;
            }
          } catch (error) {
            console.error(error)
          }
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
        if (config?.headers['X-Requested-With']) {
          return config;
        }

        config.headers['x-protocol'] = 'xxx';

        config.headers['X-Requested-With'] = 'XMLHttpRequest';

        if (cookie.get('csrf-token')) {
          config.headers['csrf-token'] = cookie.get('csrf-token')!;
        }

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }
}