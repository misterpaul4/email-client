import { googleOauth2, microsoftOauth2 } from '../../constants/providers';
import { apiClient } from '../../api/axios';
import { useEffect, useState } from 'react';
import { PrimaryLoader } from '../../components/Loader';
import { useLocation } from 'react-router-dom';

const NewAccount = () => {
  const [googleAuthurl, setGoogleAuthurl] = useState<string>();
  const [microsoftAuthurl, setMicrosoftAuthurl] = useState<string>();

  const pathname = useLocation().pathname;

  useEffect(() => {
    const getSocketId = async () => {
      const response = await apiClient.post('gateway-client/connect');
      const baseUrl = import.meta.env.VITE_CLIENT_SERVER;
      const googleCallbackUrl = baseUrl + '/auth/oauth/google';
      const microsoftCallbackUrl = baseUrl + '/auth/oauth/microsoft';

      setGoogleAuthurl(googleOauth2(response.data, googleCallbackUrl));
      setMicrosoftAuthurl(microsoftOauth2(response.data, microsoftCallbackUrl));
    };

    getSocketId();
  }, [pathname]);

  const isFetching = !googleAuthurl && !microsoftAuthurl;

  if (isFetching) {
    return <PrimaryLoader />;
  }

  return (
    <div>
      <a href={googleAuthurl}>
        <button
          disabled={!googleAuthurl}
          style={{
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          Continue with Google
        </button>
      </a>

      <div
        style={{
          marginTop: '20px',
        }}
      />
      <a href={microsoftAuthurl}>
        <button
          disabled={!microsoftAuthurl}
          style={{
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          Continue with Microsoft
        </button>
      </a>
    </div>
  );
};

export default NewAccount;
