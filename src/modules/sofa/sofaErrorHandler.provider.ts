import { ErrorHandler } from '@codejamninja/sofa-api/express';
import { FactoryProvider } from '@nestjs/common';

export const SOFA_ERROR_HANDLER = 'SOFA_ERROR_HANDLER';
const logger = console;

const SofaErrorHandlerProvider: FactoryProvider<ErrorHandler> = {
  provide: SOFA_ERROR_HANDLER,
  useFactory: () => {
    return (errs: readonly any[]) => {
      (errs || []).forEach((err: any) => {
        logger.error(new Error(err));
      });
      return {
        type: 'error' as 'error',
        status: 500,
        statusMessage: '',
        error: errs[0]
      };
    };
  }
};

export default SofaErrorHandlerProvider;
