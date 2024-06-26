import { useEffect, useState } from 'react';

const API_KEY = 'dc022b7f';

/**
 * A custom React hook that fetches movie data from the OMDb API based on a search query.
 *
 * @param {string} query - The search query to use when fetching movie data.
 * @returns {object} An object containing the fetched movies, a loading state, and an error message (if any).
 */
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    function () {
      // callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');

          const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`, {
            signal: controller.signal,
          });

          if (!response.ok) throw new Error('Error while fetching movies');

          const data = await response.json();
          if (data.Response === 'False') throw new Error('No movies found');

          setMovies(data.Search);
          setError('');
        } catch (err) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
