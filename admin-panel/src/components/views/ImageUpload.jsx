import React, { useRef } from "react";

const ImageUpload = ({ value, onChange }) => {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange(file);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        className="px-3 py-2 rounded-lg border border-admin-border text-xs font-bold bg-admin-bg"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        Upload Image
      </button>
      {value && typeof value === 'string' && (
        <img src={value} alt="Preview" className="h-12 rounded-lg border border-admin-border" />
      )}
    </div>
  );
};

export default ImageUpload;
