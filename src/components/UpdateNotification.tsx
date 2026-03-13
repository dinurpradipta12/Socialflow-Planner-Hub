import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';

export function UpdateNotification() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let currentHtml = '';

    const checkForUpdates = async () => {
      try {
        // Fetch the root HTML file with a cache-busting query param
        const res = await fetch(`/?t=${Date.now()}`);
        const html = await res.text();
        
        if (!currentHtml) {
          // First load, store the current HTML signature
          currentHtml = html;
        } else if (currentHtml !== html) {
          // HTML changed (new build deployed), trigger update notification
          setHasUpdate(true);
        }
      } catch (e) {
        // Ignore network errors (e.g., offline)
      }
    };

    // Check for updates every 1 minute
    const interval = setInterval(checkForUpdates, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {hasUpdate && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-white border-2 border-foreground rounded-xl shadow-pop p-3 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">Update Tersedia! ✨</span>
              <span className="text-[10px] font-medium text-muted-foreground">Versi baru aplikasi telah di-deploy.</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                className="bg-quaternary text-foreground border-2 border-foreground rounded-full px-3 py-1.5 text-[10px] font-medium shadow-pop hover:shadow-pop-hover active:shadow-pop-active transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
              <button 
                onClick={() => setIsDismissed(true)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
