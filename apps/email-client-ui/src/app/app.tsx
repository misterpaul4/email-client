import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function App() {
  const googleUrl = new URL('https://accounts.google.com/o/oauth2/auth');

  googleUrl.searchParams.append(
    'client_id',
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );

  googleUrl.searchParams.append(
    'redirect_uri',
    import.meta.env.VITE_GOOGLE_REDIRECT_URI
  );

  googleUrl.searchParams.append('scope', 'https://mail.google.com/');
  googleUrl.searchParams.append('response_type', 'code');

  const { hash } = useLocation();

  useEffect(() => {
    // validate hash
    // display loader
    // token exchange request
  }, [hash]);


  return (
    <div>
      Home
      <a href={googleUrl.toString()}>Click Me</a>
    </div>
  );
}

export default App;
