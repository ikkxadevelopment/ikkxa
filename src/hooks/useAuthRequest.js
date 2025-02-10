import { getSession } from 'next-auth/react';
import { useState } from 'react';

const useAuthRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Generic function to handle GET and POST requests
  const fetchWithAuth = async (url, method = 'GET', body = null) => {
    setLoading(true);
    setError(null);

    try {
      // Get the session to retrieve the access token
      const session = await getSession();
      if (!session || !session.accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const authToken = session.data?.accessToken;

      // Set up fetch options
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      };

      // If POST request, add the body
      if (method === 'POST' && body) {
        options.body = JSON.stringify(body);
      }

      // Make the fetch request
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { fetchWithAuth, loading, error };
};

export default useAuthRequest;
