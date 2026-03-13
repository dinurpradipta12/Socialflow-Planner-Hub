import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Instagram, Linkedin, Plus, Send, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { appendToSheet } from '../services/googleSheets';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" />, color: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white', sheetName: 'Instagram Content Plan' },
  { id: 'tiktok', label: 'TikTok', icon: <TikTokIcon />, color: 'bg-foreground text-white', sheetName: 'Tiktok Content Plan' },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, color: 'bg-[#0A66C2] text-white', sheetName: 'Linkedin Content Plan' },
];

export function ContentPlan() {
  const { token, spreadsheetId, columnMappings } = useApp();
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePlatformData = PLATFORMS.find(p => p.id === activePlatform);
  const rawStart = columnMappings[activePlatform] || 'A';
  const startColumn = rawStart.replace(/[^A-Za-z]/g, '');
  const startRow = rawStart.replace(/[^0-9]/g, '') || '1';
  const numColumns = 12; // Tanggal to Folder Link
  const endColumn = String.fromCharCode(startColumn.charCodeAt(0) + numColumns - 1);
  const range = `${activePlatformData?.sheetName}!${startColumn}${startRow}:${endColumn}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token || !spreadsheetId) {
      alert('Mohon hubungkan Akun Google dan Spreadsheet ID di menu Settings terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // Urutan kolom sesuai permintaan:
    // Tanggal Posting, Status Content, PIC Utama, Content Value, Objective, Content Type, Headline Content, Content Development Script, Post Image Final, PIC Production, Link Folder, Posting Link
    const rowData = [
      formData.get('tanggal'),
      formData.get('status'),
      formData.get('pic_utama'),
      formData.get('content_value'),
      formData.get('objective'),
      formData.get('content_type'),
      formData.get('headline'),
      formData.get('script_link'),
      "", // Approval
      formData.get('image_link'),
      formData.get('pic_production'),
      formData.get('folder_link')
    ];

    try {
      await appendToSheet(token, spreadsheetId, range, [rowData]);
      alert('Konten berhasil ditambahkan ke Google Sheets!');
      setIsFormOpen(false);
    } catch (error: any) {
      if (error.message?.includes('Unable to parse range') || error.message?.includes('cannot be found')) {
        alert(`Gagal menyimpan: Pastikan ada sheet bernama "${activePlatformData?.sheetName}" di Google Sheets kamu.`);
      } else if (error.message?.includes('401') || error.message?.includes('unauthenticated')) {
        alert('Sesi Google kamu telah berakhir. Silakan login kembali di menu Settings.');
      } else {
        alert(`Gagal menyimpan: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
            Planning
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-normal mb-4">
          Content <span className="gradient-text font-medium">Plan</span>
        </h1>
        <p className="text-lg text-muted-foreground">Rencanakan & kelola kontenmu dengan mudah.</p>
      </div>

      {/* Platform Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setActivePlatform(platform.id)}
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

      {/* Add New Button */}
      {!isFormOpen && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Button 
            className="w-full py-4 text-base" 
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setIsFormOpen(true)}
          >
            Tambah Konten Baru
          </Button>
        </motion.div>
      )}

      {/* Form Input */}
      {isFormOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card variant="featured">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="text-xl font-medium">Draft Baru ({activePlatformData?.label})</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-sm text-muted-foreground hover:text-accent font-medium transition-colors">Batal</button>
            </div>
            
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input name="tanggal" label="Tanggal Posting" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <Select name="status" label="Status Content" defaultValue="" required options={[
                  { label: 'Ideation', value: 'Ideation' },
                  { label: 'Scripting', value: 'Scripting' },
                  { label: 'Production', value: 'Production' },
                  { label: 'Editing', value: 'Editing' },
                  { label: 'Ready to Publish', value: 'Ready to Publish' },
                  { label: 'Published', value: 'Published' },
                ]} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select name="pic_utama" label="PIC Utama" defaultValue="" required options={[
                  { label: 'Andi (Content Creator)', value: 'Andi' },
                  { label: 'Budi (Copywriter)', value: 'Budi' },
                  { label: 'Citra (Designer)', value: 'Citra' },
                ]} />
                <Select name="content_value" label="Content Value" defaultValue="" required options={[
                  { label: 'Edukasi', value: 'Edukasi' },
                  { label: 'Hiburan', value: 'Hiburan' },
                  { label: 'Inspirasi', value: 'Inspirasi' },
                  { label: 'Promosi', value: 'Promosi' },
                ]} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select name="objective" label="Objective" defaultValue="" required options={[
                  { label: 'Brand Awareness', value: 'Brand Awareness' },
                  { label: 'Engagement', value: 'Engagement' },
                  { label: 'Lead Generation', value: 'Lead Generation' },
                  { label: 'Sales', value: 'Sales' },
                ]} />
                <Select name="content_type" label="Content Type" defaultValue="" required options={[
                  { label: 'Single Image', value: 'Single Image' },
                  { label: 'Carousel', value: 'Carousel' },
                  { label: 'Reels / Short Video', value: 'Video' },
                  { label: 'Story', value: 'Story' },
                ]} />
              </div>

              <Input name="headline" label="Headline Content" placeholder="Misal: 5 Cara Ampuh..." required />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input name="script_link" label="Content Development Script" placeholder="Link Google Docs..." type="url" />
                <Input name="image_link" label="Post Image Final" placeholder="Link Gambar/Drive..." type="url" />
              </div>
              
              <Select name="pic_production" label="PIC Production" defaultValue="" options={[
                { label: 'Andi (Video)', value: 'Andi' },
                { label: 'Citra (Design)', value: 'Citra' },
              ]} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input name="folder_link" label="Link Folder" placeholder="Link Google Drive Asset..." type="url" />
                <Input name="posting_link" label="Posting Link" placeholder="Link Postingan (Jika sudah publish)..." type="url" />
              </div>

              <Button type="submit" className="mt-6 py-4" disabled={isSubmitting} icon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan ke Sheets'}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Recent Items (Mock) */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg flex items-center gap-3 mb-6">
          <span className="w-3 h-3 rounded-full bg-accent"></span>
          Jadwal Mendatang
        </h3>
        
        <Card variant="elevated">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider bg-accent/10 text-accent px-3 py-1 rounded-full">Scripting</span>
            <span className="text-sm font-medium text-muted-foreground">Besok, 10:00</span>
          </div>
          <h4 className="font-medium text-xl mb-2">5 Tips Produktif WFH</h4>
          <p className="text-sm text-muted-foreground">Edukasi • Reels</p>
        </Card>

        <Card variant="elevated">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider bg-accent/10 text-accent px-3 py-1 rounded-full">Editing</span>
            <span className="text-sm font-medium text-muted-foreground">15 Mar, 16:00</span>
          </div>
          <h4 className="font-medium text-xl mb-2">Behind The Scene Kantor</h4>
          <p className="text-sm text-muted-foreground">Hiburan • Carousel</p>
        </Card>
      </div>
    </div>
  );
}
