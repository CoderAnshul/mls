import React, { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";

const API_BASE_URL = "http://localhost:5000/api";

const MinimalEditor = () => {
  const ref = useRef();

  useEffect(() => {
    let editor;
    if (!ref.current) return;
    editor = new EditorJS({
      holder: ref.current,
      autofocus: true,
      tools: {
        header: Header,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append("image", file);
                const res = await fetch(`${API_BASE_URL}/upload`, {
                  method: "POST",
                  body: formData,
                });
                const responseData = await res.json();
                if (responseData.url) {
                  return {
                    success: 1,
                    file: { url: responseData.url },
                  };
                }
                return responseData;
              },
            },
          },
        },
      },
      onChange: async () => {
        const data = await editor.save();
        console.log("MinimalEditor data:", data);
      },
    });
    return () => {
      if (editor && typeof editor.destroy === 'function') {
        editor.isReady && editor.isReady.then(() => editor.destroy());
      }
    };
  }, []);

  return (
    <div>
      <h2>Minimal EditorJS Image Test</h2>
      <div ref={ref} style={{ border: "1px solid #ccc", minHeight: 300, padding: 16 }} />
    </div>
  );
};

export default MinimalEditor;
