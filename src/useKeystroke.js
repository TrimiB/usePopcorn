import { useEffect } from 'react';

/**
 * A custom React hook that listens for a specific keyboard key press and calls a provided action function when that key is pressed.
 *
 * @param {string} key - The keyboard key to listen for, case-insensitive.
 * @param {function} action - The function to call when the specified key is pressed.
 * @returns {function} A cleanup function that removes the event listener when the component unmounts.
 */
export function useKeystroke(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener('keydown', callback);

    return function () {
      document.removeEventListener('keydown', callback);
    };
  }, [key, action]);
}
