import { useState } from 'react';
import axios from 'axios';

export const useSearchPlayer = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPlayers = async (query: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/players?search=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search error', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, searchPlayers };
};