import { Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Provider } from '@nestjs/common';
import providers, { AXIOS } from './providers';

export const AXIOS_OPTIONS = 'AXIOS_OPTIONS';

@Module({
  exports: [AXIOS, AXIOS_OPTIONS],
  providers: [
    {
      provide: AXIOS_OPTIONS,
      useValue: {}
    },
    ...providers
  ]
})
export class AxiosModule {
  public static register(options: AxiosOptions) {
    return {
      exports: [AXIOS, AXIOS_OPTIONS],
      module: AxiosModule,
      providers: [
        {
          provide: AXIOS_OPTIONS,
          useValue: options
        },
        ...providers
      ]
    };
  }

  public static registerAsync(asyncOptions: AxiosAsyncOptions) {
    return {
      exports: [AXIOS, AXIOS_OPTIONS],
      imports: asyncOptions.imports || [],
      module: AxiosModule,
      providers: [AxiosModule.createOptionsProvider(asyncOptions), ...providers]
    };
  }

  private static createOptionsProvider(asyncOptions: AxiosAsyncOptions) {
    if (!asyncOptions.useFactory) {
      throw new Error("registerAsync must have 'useFactory'");
    }
    return {
      inject: asyncOptions.inject || [],
      provide: AXIOS_OPTIONS,
      useFactory: asyncOptions.useFactory
    };
  }
}

export interface AxiosOptions {
  debug?: boolean;
}

export interface AxiosAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  axiosProvider?: Provider;
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<AxiosOptions> | AxiosOptions;
}
