import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Instagram, Linkedin, BarChart3, CheckCircle2, Loader2, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { readSheet, appendToSheet } from '../services/googleSheets';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" />, color: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white', planSheet: 'Instagram Content Plan', analyticSheet: 'Instagram Content Analytic' },
  { id: 'tiktok', label: 'TikTok', icon: <TikTokIcon />, color: 'bg-foreground text-white', planSheet: 'Tiktok Content Plan', analyticSheet: 'Tiktok Content Analytic' },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, color: 'bg-[#0A66C2] text-white', planSheet: 'Linkedin Content Plan', analyticSheet: 'Linkedin Content Analytic' },
];

export function Analytics() {
  const { token, spreadsheetId, isAdmin } = useApp();
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [publishedContent, setPublishedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-normal mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground">Halaman ini hanya untuk Administrator.</p>
      </div>
    );
  }

  const activePlatformData = PLATFORMS.find(p => p.id === activePlatform);

  // Fetch Published Content from Plan Sheet
  useEffect(() => {
    const fetchPublishedContent = async () => {
      if (!token || !spreadsheetId || !activePlatformData) return;
      
      setIsLoading(true);
      try {
        // Fetch columns A to G (Tanggal to Headline)
        const data = await readSheet(token, spreadsheetId, `${activePlatformData.planSheet}!A:G`);
        const rows = data.values || [];
        
        // Filter rows where Status (index 1) is 'Published'
        // Assuming row 0 is header
        const published = rows.slice(1)
          .filter((row: any[]) => row[1]?.toLowerCase() === 'published')
          .map((row: any[], index: number) => ({
            id: index,
            date: row[0] || 'Tanpa Tanggal',
            title: row[6] || 'Tanpa Judul', // Headline Content is at index 6
          }));
          
        setPublishedContent(published.reverse()); // Show newest first
        setFetchError(null);
      } catch (error: any) {
        console.error("Failed to fetch published content", error);
        if (error.message?.includes('Unable to parse range') || error.message?.includes('cannot be found')) {
          setFetchError(`Sheet "${activePlatformData.planSheet}" tidak ditemukan.`);
        } else if (error.message?.includes('401') || error.message?.includes('unauthenticated')) {
          setFetchError('Sesi Google berakhir. Silakan login ulang di Settings.');
        } else {
          setFetchError('Gagal mengambil data dari Google Sheets.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedContent();
  }, [activePlatform, token, spreadsheetId]);

  const handleSubmitMetrics = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !spreadsheetId || !activePlatformData || !selectedContent) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    let rowData: any[] = [];
    
    // Format data based on platform
    if (activePlatform === 'instagram') {
      rowData = [
        selectedContent.title, selectedContent.date,
        formData.get('reach'), formData.get('repost'), formData.get('views'),
        formData.get('like'), formData.get('comment'), formData.get('share'), formData.get('save')
      ];
    } else if (activePlatform === 'tiktok') {
      rowData = [
        selectedContent.title, selectedContent.date,
        formData.get('views'), formData.get('like'), formData.get('comment'),
        formData.get('share'), formData.get('save'), formData.get('watch_time')
      ];
    } else if (activePlatform === 'linkedin') {
      rowData = [
        selectedContent.title, selectedContent.date,
        formData.get('reach'), formData.get('views'), formData.get('reaction'),
        formData.get('comment'), formData.get('share'), formData.get('save')
      ];
    }

    try {
      await appendToSheet(token, spreadsheetId, `${activePlatformData.analyticSheet}!A:Z`, [rowData]);
      alert('Analytics berhasil disimpan ke Google Sheets!');
      setSelectedContent(null);
    } catch (error: any) {
      if (error.message?.includes('Unable to parse range') || error.message?.includes('cannot be found')) {
        alert(`Gagal menyimpan: Pastikan ada sheet bernama "${activePlatformData.analyticSheet}" di Google Sheets kamu.`);
      } else if (error.message?.includes('401') || error.message?.includes('unauthenticated')) {
        alert('Sesi Google kamu telah berakhir. Silakan login kembali di menu Settings.');
      } else {
        alert(`Gagal menyimpan analytics: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMetricsForm = () => {
    if (activePlatform === 'instagram') {
      return (
        <>
          <div className="grid grid-cols-2 gap-5">
            <Input name="reach" label="Reach" type="number" placeholder="0" required />
            <Input name="views" label="Views" type="number" placeholder="0" required />
            <Input name="like" label="Like" type="number" placeholder="0" required />
            <Input name="comment" label="Comment" type="number" placeholder="0" required />
            <Input name="share" label="Share" type="number" placeholder="0" required />
            <Input name="save" label="Save" type="number" placeholder="0" required />
          </div>
          <Input name="repost" label="Repost" type="number" placeholder="0" required />
        </>
      );
    }
    if (activePlatform === 'tiktok') {
      return (
        <>
          <div className="grid grid-cols-2 gap-5">
            <Input name="views" label="Views" type="number" placeholder="0" required />
            <Input name="like" label="Like" type="number" placeholder="0" required />
            <Input name="comment" label="Comment" type="number" placeholder="0" required />
            <Input name="share" label="Share" type="number" placeholder="0" required />
            <Input name="save" label="Save" type="number" placeholder="0" required />
            <Input name="watch_time" label="Avg. Watch Time (s)" type="number" placeholder="0.0" step="0.1" required />
          </div>
        </>
      );
    }
    if (activePlatform === 'linkedin') {
      return (
        <>
          <div className="grid grid-cols-2 gap-5">
            <Input name="reach" label="Reach" type="number" placeholder="0" required />
            <Input name="views" label="Views" type="number" placeholder="0" required />
            <Input name="reaction" label="Reaction" type="number" placeholder="0" required />
            <Input name="comment" label="Comment" type="number" placeholder="0" required />
            <Input name="share" label="Share" type="number" placeholder="0" required />
            <Input name="save" label="Save" type="number" placeholder="0" required />
          </div>
        </>
      );
    }
  };

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
            Metrics
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-normal mb-4">
          Content <span className="gradient-text font-medium">Analytics</span>
        </h1>
        <p className="text-lg text-muted-foreground">Catat performa konten yang sudah rilis.</p>
      </div>

      {/* Admin User Count */}
      <Card variant="elevated" className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-accent/10 text-accent">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-xl leading-tight mb-1">Total Users</h3>
            <p className="text-3xl font-medium text-foreground">128</p>
          </div>
        </div>
      </Card>

      {/* Platform Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => {
              setActivePlatform(platform.id);
              setSelectedContent(null);
            }}
            className={`
              flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl font-medium whitespace-nowrap transition-all duration-300
              ${activePlatform === platform.id 
                ? `${platform.color} shadow-md -translate-y-1` 
                : 'bg-card text-foreground border border-border hover:bg-muted'}
            `}
          >
            {platform.icon}
            {platform.label}
          </button>
        ))}
      </div>

      {/* Content Selection or Metrics Form */}
      {!selectedContent ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h3 className="font-medium text-lg flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-accent"></span>
            Pilih Konten ({activePlatformData?.label})
          </h3>
          
          {!token || !spreadsheetId ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/30">
              <p className="text-sm text-muted-foreground font-medium">Hubungkan Google Sheets di Settings untuk melihat data.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : fetchError ? (
            <div className="text-center py-12 border border-dashed border-red-200 bg-red-50 rounded-2xl">
              <p className="text-sm text-red-600 font-medium">{fetchError}</p>
            </div>
          ) : publishedContent.length > 0 ? (
            <div className="grid gap-4">
              {publishedContent.map((content) => (
                <Card 
                  key={content.id} 
                  variant="default" 
                  onClick={() => setSelectedContent(content)}
                  className="hover:border-accent/30 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-lg leading-tight mb-1">{content.title}</h4>
                      <p className="text-sm font-medium text-muted-foreground">Dipublish: {content.date}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform group-hover:scale-110">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/30">
              <p className="text-sm text-muted-foreground font-medium">Belum ada konten dengan status "Published" di sheet ini.</p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="featured">
            <div className="mb-6 border-b border-border pb-4">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider bg-accent/10 text-accent px-3 py-1 rounded-full">
                  Input Metrics
                </span>
                <button onClick={() => setSelectedContent(null)} className="text-sm text-muted-foreground hover:text-accent font-medium transition-colors">
                  Kembali
                </button>
              </div>
              <h2 className="text-xl font-medium leading-tight">{selectedContent.title}</h2>
            </div>
            
            <form className="flex flex-col gap-5" onSubmit={handleSubmitMetrics}>
              {renderMetricsForm()}

              <Button type="submit" className="mt-4 py-4" disabled={isSubmitting} icon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Analytics'}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
