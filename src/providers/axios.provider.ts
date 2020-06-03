import axios, { AxiosResponse, AxiosError } from 'axios';
import { errorLogger, responseLogger, requestLogger } from 'axios-logger';

export const AXIOS = 'AXIOS';

const config = {
  data: true,
  dateFormat: 'HH:MM:ss',
  headers: true,
  method: true,
  prefixText: false,
  status: true,
  url: true
};

let _axios: any;

export const AxiosProvider = {
  provide: AXIOS,
  useFactory: () => {
    if (_axios) return _axios;
    _axios = axios;
    _axios._create = axios.create;
    axios.create = (...args: any[]) => {
      const instance = _axios._create(...args);
      instance.interceptors.response.use(
        (response: AxiosResponse) => responseLogger(response, config),
        // @ts-ignore
        (err: AxiosError) => errorLogger(err, config)
      );
      instance.interceptors.request.use(
        (response: AxiosResponse) => requestLogger(response, config),
        // @ts-ignore
        (err: AxiosError) => errorLogger(err, config)
      );
      return instance;
    };
    return _axios;
  },
  inject: []
};
