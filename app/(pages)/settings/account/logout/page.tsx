'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  const getAuthToken = () => {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      console.error('Authorization token not found');
    }
    return token;
  };

  useEffect(() => {
    const handleLogout = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          localStorage.removeItem('Authorization');

          // 현석 추가 코드 (미들웨어를 위한 쿠키 삭제)
          localStorage.removeItem('userKey');
          const cookieName = 'authCookie';
          const cookies = document.cookie.split(';').find(cookie => cookie.startsWith(`${cookieName}=`));
          if (cookies) {
            // authCookie 삭제
            document.cookie = `${cookieName}=; max-age=0; path=/; secure; SameSite=Strict`;
          }

          // 로그인 페이지로 리다이렉트
          router.push('/login');
        } else {
          console.error('Failed to logout:', response.status);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      <h1>Logging out...</h1>
    </div>
  );
};

export default LogoutPage;
