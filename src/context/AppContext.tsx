import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface AppContextType {
  token: string | null;
  spreadsheetId: string | null;
  sheetUrl: string;
  isAdmin: boolean;
  appMetadata: { name: string; logo: string; favicon: string };
  columnMappings: Record<string, string>; // platform -> startColumn
  login: () => void;
  logout: () => void;
  adminLogin: (user: string, pass: string) => boolean;
  adminLogout: () => void;
  updateAppMetadata: (metadata: { name: string; logo: string; favicon: string }) => void;
  updateColumnMapping: (platform: string, startColumn: string) => void;
  setSpreadsheetUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const CLIENT_ID = '659057734871-lqt7hf9fpvraj5fqhu400d6dau4m3lsf.apps.googleusercontent.com';

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('g_token'));
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(localStorage.getItem('g_sheet_id'));
  const [sheetUrl, setSheetUrl] = useState<string>(localStorage.getItem('g_sheet_url') || '');
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('is_admin') === 'true');
  const [appMetadata, setAppMetadata] = useState<{ name: string; logo: string; favicon: string }>(
    JSON.parse(localStorage.getItem('app_metadata') || '{"name": "Arunika App", "logo": "", "favicon": ""}')
  );
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    JSON.parse(localStorage.getItem('column_mappings') || '{"instagram": "J", "tiktok": "J", "linkedin": "J"}')
  );
  const [tokenClient, setTokenClient] = useState<any>(null);

  // ... (useEffect, login, logout, adminLogin, adminLogout, updateAppMetadata remain same)

  const updateColumnMapping = (platform: string, startColumn: string) => {
    const newMappings = { ...columnMappings, [platform]: startColumn };
    setColumnMappings(newMappings);
    localStorage.setItem('column_mappings', JSON.stringify(newMappings));
  };

  useEffect(() => {
    // Initialize Google Token Client when the script loads
    const initClient = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/spreadsheets',
          callback: (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setToken(tokenResponse.access_token);
              localStorage.setItem('g_token', tokenResponse.access_token);
            }
          },
        });
        setTokenClient(client);
      } else {
        // Retry if script hasn't loaded yet
        setTimeout(initClient, 500);
      }
    };
    
    initClient();
  }, []);

  const login = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    } else {
      alert("Google Identity Services sedang memuat, coba lagi dalam beberapa detik.");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('g_token');
  };

  const adminLogin = (user: string, pass: string) => {
    if (user === 'arunika' && pass === 'ar4925') {
      setIsAdmin(true);
      localStorage.setItem('is_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('is_admin');
  };

  const updateAppMetadata = (metadata: { name: string; logo: string; favicon: string }) => {
    setAppMetadata(metadata);
    localStorage.setItem('app_metadata', JSON.stringify(metadata));
  };

  const handleSetSpreadsheetUrl = (url: string) => {
    setSheetUrl(url);
    localStorage.setItem('g_sheet_url', url);
    
    // Extract ID using Regex
    // Matches /d/ followed by any characters except slash
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      setSpreadsheetId(match[1]);
      localStorage.setItem('g_sheet_id', match[1]);
    } else {
      setSpreadsheetId(null);
      localStorage.removeItem('g_sheet_id');
    }
  };

  return (
    <AppContext.Provider value={{ token, spreadsheetId, sheetUrl, isAdmin, appMetadata, columnMappings, login, logout, adminLogin, adminLogout, updateAppMetadata, updateColumnMapping, setSpreadsheetUrl: handleSetSpreadsheetUrl }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
