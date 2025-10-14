import React, { useEffect, useContext} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const sendCodeToBackend = async () => {
      const code = searchParams.get('code');

      if (code) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/auth/google/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error('Backend failed to process the code.');
          }

          const data = await response.json();

          login(data.user, data.access_token)
          navigate('/library');

        } catch (error) {
          console.error('Authentication error:', error);
          navigate('/');
        }
      } else {
         console.error("No authorization code provided by Google.");
         navigate('/');
      }
    };

    sendCodeToBackend();
  }, [navigate, searchParams]);

  return (
    <div>
      <h1>Loading...</h1>
      <p>Please wait while we log you in.</p>
    </div>
  );
}

export default GoogleCallback;