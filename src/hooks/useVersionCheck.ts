import { useState, useEffect } from 'react';

export function useVersionCheck() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(window.location.href, { method: 'HEAD' });
        const lastModified = response.headers.get('Last-Modified');
        
        if (lastModified) {
          const storedVersion = localStorage.getItem('app_version');
          if (storedVersion && storedVersion !== lastModified) {
            setIsUpdateAvailable(true);
          } else {
            localStorage.setItem('app_version', lastModified);
          }
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    // Check every minute
    const interval = setInterval(checkVersion, 60000);
    checkVersion();

    return () => clearInterval(interval);
  }, []);

  return isUpdateAvailable;
}
