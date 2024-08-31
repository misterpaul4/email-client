import { googleOauth2 } from "../../constants/providers";
import { apiClient } from "../../api/axios";
import { useEffect, useState } from "react";
import { PrimaryLoader } from "../../components/Loader";

const NewAccount = () => {
  const [googleAuthurl, setGoogleAuthurl] = useState<string>();

  useEffect(() => {
    const getSocketId = async () => {
      const response = await apiClient.post('gateway-client/connect');
      setGoogleAuthurl(googleOauth2(response.data))
    }

    getSocketId()
  }, [])

  if (!googleAuthurl) {
    return <PrimaryLoader />
  }

  return <div>
    <a href={googleAuthurl}>
    <button style={{
      padding: '10px',
      cursor: 'pointer',
    }}>Continue with Google</button>
    </a>
  </div>;
}

export default NewAccount
