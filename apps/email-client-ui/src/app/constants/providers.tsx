import { GOOGLE_REDIRECT_URI, GOOGLE_AUTHORIZATION_URL } from '@constants';
import socket from '../api/socket';

export const googleOauth2 = () => {
  const googleUrl = new URL(GOOGLE_AUTHORIZATION_URL);

  googleUrl.searchParams.append(
    'client_id',
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );

  googleUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
  googleUrl.searchParams.append('scope', 'https://mail.google.com/');
  googleUrl.searchParams.append('response_type', 'code');
  googleUrl.searchParams.append('access_type', 'offline');
  googleUrl.searchParams.append('prompt', 'consent');
  googleUrl.searchParams.append('state', socket.id || '');

  return googleUrl.toString();
};
