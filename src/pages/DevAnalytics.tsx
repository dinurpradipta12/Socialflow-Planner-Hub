import React from 'react';
import { Card } from '../components/ui/Card';
import { Terminal, Database, Shield, Activity } from 'lucide-react';

export function DevAnalytics() {
  return (
    <div className="pb-32 pt-8 px-4 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-normal mb-4">
          Developer <span className="gradient-text font-medium">Dashboard</span>
        </h1>
        <p className="text-lg text-muted-foreground">Monitoring sistem & debug internal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-lg">Sheet Operations</h3>
          </div>
          <p className="text-sm text-muted-foreground">Log aktivitas penulisan ke Google Sheets.</p>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-lg">System Logs</h3>
          </div>
          <p className="text-sm text-muted-foreground">Error logs dan status runtime.</p>
        </Card>
      </div>
    </div>
  );
}
