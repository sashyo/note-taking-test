import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTideCloak } from '@tidecloak/react';

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Then send the user into your app
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Error handling redirect callback:', err);
      }
    })();
  }, [navigate]);

  return <p>Signing you in…</p>;
};

export default AuthRedirect;
