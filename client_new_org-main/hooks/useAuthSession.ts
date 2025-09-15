// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { refreshAccessToken, logout } from '@/features/auth/authSlice';
// import { router } from 'expo-router';

// const useAuthSession = () => {
//   const dispatch = useDispatch();
//   const accessToken = useSelector((state) => state.auth.accessToken);

//   // Silent refresh on app start
//   useEffect(() => {
//     dispatch(refreshAccessToken())
//       .unwrap()
//       .catch((err) => {
//         console.warn('Silent refresh failed, logging out:', err);
//         dispatch(logout());
//         router.replace('/auth/login');
//       });
//   }, [dispatch]);

//   // Regular 10-minute interval refresh
//   useEffect(() => {
//     if (!accessToken) return;

//     const interval = setInterval(() => {
//       dispatch(refreshAccessToken())
//         .unwrap()
//         .catch((err) => {
//           console.warn('Refresh failed, logging out:', err);
//           dispatch(logout());
//           router.replace('/auth/login');
//         });
//     }, 10 * 60 * 1000); // every 10 minutes

//     return () => clearInterval(interval);
//   }, [dispatch, accessToken]);
// };

// export default useAuthSession;