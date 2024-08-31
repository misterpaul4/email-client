import { useCallbackStatus } from './hooks';

const GoogleSuccessCallBack = () => {
  return <div>This is a SUCCESSFULL callback from google</div>;
};

const GoogleFailedCallBack = ({ reason }: { reason: string }) => {
  return (
    <div>
      This is a FAILED callback from google: <strong>{reason}</strong>
    </div>
  );
};

const GoogleCallBack = () => {
  const { isSuccess, message } = useCallbackStatus();

  return (
    <div>
      {isSuccess ? (
        <GoogleSuccessCallBack />
      ) : (
        <GoogleFailedCallBack reason={message} />
      )}
    </div>
  );
};

export { GoogleSuccessCallBack, GoogleFailedCallBack };

export default GoogleCallBack;
