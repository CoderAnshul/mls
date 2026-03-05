import React, { useRef, useState } from "react";
import { Upload, X, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { api } from "../../utils/api";

const ImageUpload = ({ value, onChange, label, className = "h-32" }) => {
  const fileInputRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState("upload"); // "upload" or "link"

  const handleUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await api.upload.image(file);
      onChange(data.url);
      setMode("upload");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  // Image path resolver for previews
  const imageBase = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");
  const imageUrl = value 
    ? (value.startsWith("http") ? value : `${imageBase.endsWith("/") ? imageBase.slice(0, -1) : imageBase}${value.startsWith("/") ? "" : "/"}${value}`)
    : "";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between shrink-0">
        {label && <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">{label}</label>}
        {!value && (
          <div className="flex items-center gap-2 bg-admin-bg/80 border border-admin-border rounded-lg p-0.5">
            <button 
              type="button"
              onClick={() => setMode("upload")}
              className={`p-1 rounded-md transition-all ${mode === 'upload' ? 'bg-admin-card text-admin-accent shadow-sm' : 'text-admin-muted hover:text-white'}`}
            >
              <Upload size={10} />
            </button>
            <button 
              type="button"
              onClick={() => setMode("link")}
              className={`p-1 rounded-md transition-all ${mode === 'link' ? 'bg-admin-card text-admin-accent shadow-sm' : 'text-admin-muted hover:text-white'}`}
            >
              <LinkIcon size={10} />
            </button>
          </div>
        )}
      </div>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative group flex-1 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden
          ${value ? 'border-admin-border' : 'border-admin-border hover:border-admin-accent/50'}
          ${isDragging ? 'border-admin-accent bg-admin-accent/5' : 'bg-admin-bg/50'}
          ${isUploading ? 'opacity-70 pointer-events-none' : ''}
        `}
      >
        {value ? (
          <>
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setMode("upload");
                  fileInputRef.current?.click();
                }}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-all text-white"
              >
                <Upload size={16} />
              </button>
              <button 
                type="button" 
                onClick={() => onChange("")}
                className="p-2 bg-rose-500/20 hover:bg-rose-500/40 rounded-full backdrop-blur-md transition-all text-rose-400"
              >
                <X size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            {mode === "upload" ? (
              <>
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-admin-accent animate-spin" />
                ) : (
                  <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-admin-accent' : 'text-admin-muted group-hover:text-admin-accent'}`} />
                )}
                <p className="text-[10px] font-black uppercase tracking-widest text-admin-muted group-hover:text-white transition-colors mt-2">
                  {isUploading ? 'Uploading...' : 'Drop or Click'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => handleUpload(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            ) : (
              <div className="w-full space-y-3 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <LinkIcon size={20} className="text-admin-accent" />
                <input 
                  type="text"
                  placeholder="Paste external image URL..."
                  className="w-full bg-admin-card border border-admin-border px-3 py-2 rounded-lg text-[11px] font-bold text-white focus:border-admin-accent outline-none text-center shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onChange(e.target.value);
                      setMode("upload");
                    }
                  }}
                  onBlur={(e) => e.target.value && onChange(e.target.value)}
                />
                <p className="text-[8px] text-admin-muted font-black uppercase tracking-widest">Press Enter to Bind</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
