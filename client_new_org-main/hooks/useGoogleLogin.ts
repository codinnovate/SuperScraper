// hooks/useGoogleLogin.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { googleLogin } from '@/features/auth/authSlice'; // RTK thunk

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
  const dispatch = useDispatch();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
    scopes: ['profile', 'email'],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      handleLogin(id_token);
    }
  }, [response]);

  const handleLogin = async (id_token) => {
    try {
      setLoading(true);
      await dispatch(googleLogin(id_token)).unwrap();
    } catch (err) {
      setError(err);
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    setError(null);
    promptAsync();
  };

  return { loginWithGoogle, loading, error };
};
