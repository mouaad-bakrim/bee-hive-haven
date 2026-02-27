import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  name: string;
  id: string;
  url: string;
  created_at: string;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from("blog-media").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (data) {
      setFiles(
        data
          .filter((f) => f.name !== ".emptyFolderPlaceholder")
          .map((f) => ({
            name: f.name,
            id: f.id || f.name,
            url: supabase.storage.from("blog-media").getPublicUrl(f.name).data.publicUrl,
            created_at: f.created_at || "",
          }))
      );
    }
    setLoading(false);
  };

  useEffect(() => { fetchFiles(); }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file);
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Fichier uploadé ✓" });
      fetchFiles();
    }
    setUploading(false);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach(uploadFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDelete = async (name: string) => {
    if (!confirm(`Supprimer ${name} ?`)) return;
    await supabase.storage.from("blog-media").remove([name]);
    toast({ title: "Fichier supprimé" });
    fetchFiles();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copiée ✓" });
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Bibliothèque médias</h1>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Glissez vos fichiers ici ou
            </p>
            <label>
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Parcourir</span>
              </Button>
              <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            </label>
          </>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucun fichier uploadé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative bg-card border border-border rounded-xl overflow-hidden"
            >
              <img src={file.url} alt={file.name} className="w-full aspect-square object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => copyUrl(file.url)} className="p-2 rounded-full bg-white/90 text-foreground hover:bg-white">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(file.name)} className="p-2 rounded-full bg-white/90 text-destructive hover:bg-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="px-2 py-1.5 text-xs text-muted-foreground truncate">{file.name}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
