import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, LogOut, LogIn, Link as LinkIcon, Shield, Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const { token, spreadsheetId, sheetUrl, setSpreadsheetUrl, login, logout, isAdmin, appMetadata, adminLogin, adminLogout, updateAppMetadata } = useApp();
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [metadata, setMetadata] = useState(appMetadata);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminLogin(adminUser, adminPass)) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
            Configuration
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-normal mb-4">
          App <span className="gradient-text font-medium">Settings</span>
        </h1>
        <p className="text-lg text-muted-foreground">Hubungkan akun & Google Sheets.</p>
      </div>

      <div className="space-y-6">
        {/* Google Account Card */}
        <Card variant={token ? "elevated" : "default"}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${token ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
              {token ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-medium text-xl leading-tight mb-1">Akun Google</h3>
              <p className="text-sm font-medium text-muted-foreground">
                {token ? 'Terhubung (Akses Sheets Aktif)' : 'Belum terhubung'}
              </p>
            </div>
          </div>
          
          {token ? (
            <Button variant="secondary" onClick={logout} className="w-full" icon={<LogOut className="w-4 h-4" />}>
              Logout Akun
            </Button>
          ) : (
            <Button onClick={login} className="w-full" icon={<LogIn className="w-4 h-4" />}>
              Login dengan Google
            </Button>
          )}
        </Card>

        {/* Google Sheets Link Card */}
        <Card variant={spreadsheetId ? "elevated" : "default"}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${spreadsheetId ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
              <LinkIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-xl leading-tight mb-1">Database Sheets</h3>
              <p className="text-sm font-medium text-muted-foreground">
                {spreadsheetId ? 'ID Valid Ditemukan' : 'Masukkan link sheets'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input 
              label="Link Google Sheets" 
              placeholder="https://docs.google.com/spreadsheets/d/..." 
              value={sheetUrl}
              onChange={(e) => setSpreadsheetUrl(e.target.value)}
            />
            
            {spreadsheetId && (
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Spreadsheet ID:</p>
                <p className="text-sm font-mono break-all text-foreground">{spreadsheetId}</p>
              </div>
            )}
            
            {!spreadsheetId && sheetUrl.length > 0 && (
              <p className="text-sm text-red-500 font-medium">
                Format link tidak valid. Pastikan link lengkap dari browser.
              </p>
            )}
          </div>
        </Card>

        {/* Admin Login Card */}
        <Card variant={isAdmin ? "elevated" : "default"}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isAdmin ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-xl leading-tight mb-1">Admin Access</h3>
              <p className="text-sm font-medium text-muted-foreground">
                {isAdmin ? 'Developer Mode Aktif' : 'Login sebagai admin'}
              </p>
            </div>
          </div>

          {isAdmin ? (
            <Button variant="secondary" onClick={adminLogout} className="w-full" icon={<LogOut className="w-4 h-4" />}>
              Logout Admin
            </Button>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input label="Username" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} />
              <Input label="Password" type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
              <Button type="submit" className="w-full" icon={<LogIn className="w-4 h-4" />}>
                Login Admin
              </Button>
            </form>
          )}
        </Card>

        {/* Admin Settings Card */}
        {isAdmin && (
          <Card variant="elevated">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-accent/10 text-accent">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-xl leading-tight mb-1">App Configuration</h3>
                <p className="text-sm font-medium text-muted-foreground">Ubah branding aplikasi</p>
              </div>
            </div>
            <div className="space-y-4">
              <Input label="App Name" value={metadata.name} onChange={(e) => setMetadata({...metadata, name: e.target.value})} />
              <Input label="Logo URL" value={metadata.logo} onChange={(e) => setMetadata({...metadata, logo: e.target.value})} />
              <Input label="Favicon URL" value={metadata.favicon} onChange={(e) => setMetadata({...metadata, favicon: e.target.value})} />
              <Button onClick={() => updateAppMetadata(metadata)} className="w-full">Save Metadata</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
