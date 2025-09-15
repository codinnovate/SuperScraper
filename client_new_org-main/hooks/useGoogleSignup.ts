// hooks/useGoogleSignup.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { googleLogin } from '@/features/auth/authSlice'; // redux thunk

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignup = () => {
  const dispatch = useDispatch();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
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
      handleSignup(id_token);
    }
  }, [response]);

  const handleSignup = async (id_token) => {
    try {
      setLoading(true);
      await dispatch(googleLogin(id_token)).unwrap();
      // Navigate based on user_type here if needed
    } catch (err) {
      setError(err);
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = () => {
    setError(null);
    promptAsync();
  };

  return { signUpWithGoogle, loading, error };
};
