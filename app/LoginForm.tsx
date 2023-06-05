'use client';

import { useState } from 'react'
import { setCookie } from 'nookies';
import { addDays } from 'date-fns';
import { useRouter } from 'next/navigation';

export const LoginForm: React.FC = () => {
  const router = useRouter();

  const [token, setToken] = useState('');

  async function login() {
    const expires = addDays(new Date(), 7);

    setCookie(null, 'token', token, {
      path: '/',
      expires,
    });

    router.push('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <input
        type="password"
        placeholder="TOKEN"
        className="input input-bordered w-full max-w-xs"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button className="btn btn-neutral mt-2" onClick={login}>Login</button>
    </div>
  )
};
