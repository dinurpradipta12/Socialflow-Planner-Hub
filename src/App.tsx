import { useState } from 'react';
import { ContentPlan } from './pages/ContentPlan';
import { Analytics } from './pages/Analytics';
import { Settings as SettingsPage } from './pages/Settings';
import { DevAnalytics } from './pages/DevAnalytics';
import { UpdateNotification } from './components/UpdateNotification';
import { CalendarDays, BarChartBig, Settings, Terminal } from 'lucide-react';
import { useApp } from './context/AppContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<'plan' | 'analytics' | 'settings' | 'dev'>('plan');
  const { isAdmin } = useApp();

  return (
    <div className="min-h-screen bg-background relative selection:bg-accent/20 selection:text-accent">
      <UpdateNotification />
      
      {/* Main Content Area */}
      <main>
        {activeTab === 'plan' && <ContentPlan />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <SettingsPage />}
        {activeTab === 'dev' && isAdmin && <DevAnalytics />}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-none z-50">
        <div className="max-w-md mx-auto bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-lg p-2 flex justify-between items-center pointer-events-auto">
          <button 
            onClick={() => setActiveTab('plan')}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'plan' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
          >
            <CalendarDays className={`w-5 h-5 mb-1 ${activeTab === 'plan' ? 'animate-pulse-slow' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">Plan</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'analytics' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
          >
            <BarChartBig className={`w-5 h-5 mb-1 ${activeTab === 'analytics' ? 'animate-pulse-slow' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">Analytics</span>
          </button>

          {isAdmin && (
            <button 
              onClick={() => setActiveTab('dev')}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'dev' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
            >
              <Terminal className={`w-5 h-5 mb-1 ${activeTab === 'dev' ? 'animate-pulse-slow' : ''}`} />
              <span className="text-[10px] font-medium tracking-wide">Dev</span>
            </button>
          )}

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'settings' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
          >
            <Settings className={`w-5 h-5 mb-1 ${activeTab === 'settings' ? 'animate-pulse-slow' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
