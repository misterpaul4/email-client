import { useCallbackStatus } from './hooks';

const MicrosoftSuccessCallBack = () => {
  return <div>This is a SUCCESSFULL callback from microsoft</div>;
};

const MicrosoftFailedCallBack = ({ reason }: { reason: string }) => {
  return (
    <div>
      This is a FAILED callback from microsoft: <strong>{reason}</strong>
    </div>
  );
};

const MicrosoftCallBack = () => {
  const { isSuccess, message } = useCallbackStatus();

  return (
    <div>
      {isSuccess ? (
        <MicrosoftSuccessCallBack />
      ) : (
        <MicrosoftFailedCallBack reason={message} />
      )}
    </div>
  );
};

export { MicrosoftSuccessCallBack, MicrosoftFailedCallBack };

export default MicrosoftCallBack;
