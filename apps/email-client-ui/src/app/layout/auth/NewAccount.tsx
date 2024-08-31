import { googleOauth2 } from '../../constants/providers';
import { apiClient } from '../../api/axios';
import { useEffect, useState } from 'react';
import { PrimaryLoader } from '../../components/Loader';
import { useLocation } from 'react-router-dom';

const NewAccount = () => {
  const [googleAuthurl, setGoogleAuthurl] = useState<string>();

  const pathname = useLocation().pathname;

  useEffect(() => {
    const getSocketId = async () => {
      const response = await apiClient.post('gateway-client/connect');
      const baseUrl = import.meta.env.VITE_CLIENT_SERVER

      const googleCallbackUrl = baseUrl + "/auth/oauth/google"

      setGoogleAuthurl(googleOauth2(response.data, googleCallbackUrl))
    };

    getSocketId();
  }, [pathname]);

  const isFetching = !googleAuthurl;

  if (isFetching) {
    return <PrimaryLoader />;
  }

  return (
    <div>
      <a href={googleAuthurl}>
        <button
          style={{
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          Continue with Google
        </button>
      </a>
    </div>
  );
};

export default NewAccount;
