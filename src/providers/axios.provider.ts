import axios, { AxiosResponse, AxiosError } from 'axios';
import { errorLogger, responseLogger } from 'axios-logger';

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

export const AxiosProvider = {
  provide: AXIOS,
  useFactory: () => {
    const instance = axios.create();
    instance.interceptors.response.use(
      (response: AxiosResponse) => responseLogger(response, config),
      (err: AxiosError) => errorLogger(err)
    );
    // instance.interceptors.request.use(
    //   (response: AxiosResponse) => responseLogger(response, config),
    //   (err: AxiosError) => errorLogger(err)
    // );
    return instance;
  },
  inject: []
};
