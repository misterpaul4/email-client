import { googleOauth2 } from "../../constants/Providers";

const NewAccount = () => {
  return <div>
    <a href={googleOauth2()}><button style={{
      padding: '10px',
      cursor: 'pointer',
    }}>Continue with Google</button></a>
  </div>;
}

export default NewAccount
