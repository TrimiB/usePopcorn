import { useState, useEffect } from 'react';

/**
 * A custom React hook that manages state in the browser's local storage.
 *
 * @param {string} key - The key to use for storing the state in local storage.
 * @param {any} defaultValue - The default value to use if the state is not found in local storage.
 * @returns {[any, function(any): void]} - An array containing the current state value and a function to update the state.
 */
export function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(function () {
    const storedWatched = localStorage.getItem(key);
    return storedWatched ? JSON.parse(storedWatched) : defaultValue;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
