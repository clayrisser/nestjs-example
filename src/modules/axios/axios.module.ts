import { Module } from '@nestjs/common';
import providers, { AxiosProvider } from './providers';

@Module({
  providers,
  exports: [AxiosProvider]
})
export class AxiosModule {}
