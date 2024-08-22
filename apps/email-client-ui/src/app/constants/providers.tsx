export const googleOauth2 = () => {
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

  return googleUrl.toString();
};
