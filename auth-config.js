// Cognito Configuration
console.log("auth-config.js loaded");

const COGNITO_CONFIG = {
  region: 'us-east-2',
  userPoolId: 'us-east-2_tm6qsmTAM',
  clientId: '2pto8560q5teikt564o7q7l9qc',
  domain: 'us-east-2tm6qsmtam',  // Domain prefix only, not full URL
  redirectSignIn: 'https://master.dbl2qallvsphe.amplifyapp.com/',
  redirectSignOut: 'https://master.dbl2qallvsphe.amplifyapp.com/',
  responseType: 'code',
  scope: ['email', 'openid', 'profile']
};

// OAuth URLs
const getLoginUrl = () => {
  const params = new URLSearchParams({
    client_id: COGNITO_CONFIG.clientId,
    response_type: COGNITO_CONFIG.responseType,
    scope: COGNITO_CONFIG.scope.join(' '),
    redirect_uri: COGNITO_CONFIG.redirectSignIn
  });
  const domain = `${COGNITO_CONFIG.domain}.auth.${COGNITO_CONFIG.region}.amazoncognito.com`;
  return `https://${domain}/oauth2/authorize?${params.toString()}`;
};

const getSignupUrl = () => `${getLoginUrl()}&prompt=login`;

const getLogoutUrl = () => {
  const params = new URLSearchParams({
    client_id: COGNITO_CONFIG.clientId,
    logout_uri: COGNITO_CONFIG.redirectSignOut
  });
  const domain = `${COGNITO_CONFIG.domain}.auth.${COGNITO_CONFIG.region}.amazoncognito.com`;
  return `https://${domain}/logout?${params.toString()}`;
};

// Token management
const getTokenFromStorage = () => localStorage.getItem('id_token');
const getAccessTokenFromStorage = () => localStorage.getItem('access_token');
const setTokens = (idToken, accessToken) => {
  localStorage.setItem('id_token', idToken);
  localStorage.setItem('access_token', accessToken);
};
const clearTokens = () => {
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_info');
};

// Decode JWT (basic; for production use a library)
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Token decode error:', e);
    return null;
  }
};

const getUserInfo = () => {
  const stored = localStorage.getItem('user_info');
  return stored ? JSON.parse(stored) : null;
};

const setUserInfo = (info) => {
  localStorage.setItem('user_info', JSON.stringify(info));
};

const isUserAdmin = () => {
  const info = getUserInfo();
  return info?.groups?.includes('admin') || false;
};
