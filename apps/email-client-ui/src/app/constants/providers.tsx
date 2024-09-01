import {
  GOOGLE_REDIRECT_URI,
  GOOGLE_AUTHORIZATION_URL,
  GOOGLE_AUTH_SCOPES,
  MICROSOFT_AUTHORIZATION_URL,
  MICROSOFT_REDIRECT_URI,
  MICROSOFT_AUTH_SCOPES,
} from '@constants';

export const googleOauth2 = (socketId: string, callbackUrl: string) => {
  const googleUrl = new URL(GOOGLE_AUTHORIZATION_URL);

  googleUrl.searchParams.append(
    'client_id',
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );

  googleUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
  googleUrl.searchParams.append('scope', GOOGLE_AUTH_SCOPES);
  googleUrl.searchParams.append('response_type', 'code');
  googleUrl.searchParams.append('access_type', 'offline');
  googleUrl.searchParams.append('prompt', 'consent');
  googleUrl.searchParams.append(
    'state',
    JSON.stringify({ clientId: socketId, returnUrl: callbackUrl })
  );

  return googleUrl.toString();
};

export const microsoftOauth2 = (socketId: string, callbackUrl: string) => {
  const url = new URL(MICROSOFT_AUTHORIZATION_URL);

  url.searchParams.append(
    'client_id',
    import.meta.env.VITE_MICROSOFT_CLIENT_ID
  );

  url.searchParams.append('redirect_uri', MICROSOFT_REDIRECT_URI);
  url.searchParams.append('scope', MICROSOFT_AUTH_SCOPES);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('response_mode', 'query');
  url.searchParams.append(
    'state',
    JSON.stringify({ clientId: socketId, returnUrl: callbackUrl })
  );

  return url.toString();
};
