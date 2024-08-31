import { ProviderCallbackParams } from '@enums';
import { useLocation } from 'react-router-dom';

const useCallbackStatus = () => {
  const outcome = useLocation().search;
  const message = decodeURIComponent(outcome.substring(1));
  const isSuccess = message === ProviderCallbackParams.SUCCESS;

  return {
    isSuccess,
    message
  };
};

export { useCallbackStatus };
