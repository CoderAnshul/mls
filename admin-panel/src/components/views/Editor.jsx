import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Custom tools (add your custom tool imports here)
// import SimpleVideo from "./SimpleVideo";
// import SimpleAudio from "./SimpleAudio";
// import TwitterEmbed from "./TwitterEmbed";
// import YoutubeEmbed from "./YoutubeEmbed";
// import FacebookEmbed from "./FacebookEmbed";

const Editor = ({ data, onChange, holder = "editorjs" }) => {
  const editorRef = useRef(null);
  const debounceRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Only re-initialize EditorJS when holder changes (not data)
  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      if (!isMounted) return;
      if (editorRef.current) {
        try {
          if (typeof editorRef.current.destroy === "function") {
            await editorRef.current.destroy();
          }
        } catch (error) {
          console.warn("Error destroying editor:", error);
        }
        editorRef.current = null;
      }
      try {
        const editor = new EditorJS({
          holder: holder,
          autofocus: false,
          data: data || { blocks: [] },
          tools: {
            header: {
              class: Header,
              inlineToolbar: ["link", "bold", "italic"],
              config: {
                placeholder: "Enter a header",
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: ["link", "bold", "italic"],
              config: {
                defaultStyle: "unordered",
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: ["link", "bold", "italic"],
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
            },
            image: {
              class: ImageTool,
              config: {
                field: "image",
                uploader: {
                  async uploadByFile(file) {
                    const formData = new FormData();
                    formData.append("image", file);
                    try {
                      const res = await fetch(`${API_BASE_URL}/upload`, {
                        method: "POST",
                        body: formData,
                      });
                      if (!res.ok) {
                        const errData = await res.json();
                        return {
                          success: 0,
                          message: errData.message || "Failed to upload image"
                        };
                      }
                      const responseData = await res.json();
                      console.log("Image upload response:", responseData);

                      if (responseData.url) {
                        return {
                          success: 1,
                          file: {
                            url: responseData.url,
                            name: responseData.filename || file.name,
                          },
                        };
                      }
                      return {
                        success: 0,
                        ...responseData
                      };
                    } catch (error) {
                      console.error("Editor image upload error:", error);
                      return {
                        success: 0,
                        message: error.message
                      };
                    }
                  },
                },
              },
            },
            // Add custom tools here
            // twitter: TwitterEmbed,
            // youtube: YoutubeEmbed,
            // facebook: FacebookEmbed,
            // video: SimpleVideo,
            // audio: SimpleAudio,
          },
          onReady: () => {
            if (isMounted) {
              console.log("✅ Editor.js ready with all tools!");
            }
          },
          onChange: async (api) => {
            try {
              const savedData = await api.saver.save();
              console.log('EditorJS onChange savedData:', savedData);
              if (!isMounted) return;

              // Update lastUpdateRef to prevent re-rendering our own changes
              lastUpdateRef.current = JSON.stringify(savedData.blocks || []);

              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
              }
              debounceRef.current = setTimeout(() => {
                if (isMounted && onChangeRef.current) {
                  try {
                    onChangeRef.current(savedData);
                  } catch (error) {
                    console.error("Editor onChange handler error:", error);
                  }
                }
              }, 250);
            } catch (error) {
              console.warn("Editor save failed:", error);
            }
          },
        });
        editorRef.current = editor;
      } catch (error) {
        console.error("❌ Failed to initialize editor:", error);
      }
    };
    const timer = setTimeout(() => {
      if (document.getElementById(holder)) {
        initEditor();
      } else {
        setTimeout(() => {
          if (isMounted && document.getElementById(holder)) {
            initEditor();
          }
        }, 100);
      }
    }, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (editorRef.current) {
        try {
          if (typeof editorRef.current.destroy === "function") {
            editorRef.current.destroy();
          }
        } catch (e) {
          console.warn("Error cleaning up editor instance:", e);
        }
        editorRef.current = null;
      }
    };
  }, [holder]);

  // If data changes (edit mode), update the editor content without re-initializing
  // We use a ref to prevent unnecessary re-renders while typing
  const lastUpdateRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && data) {
      // Stringify blocks to check for changes - a bit hacky but simple
      const dataString = JSON.stringify(data.blocks || []);
      if (dataString !== lastUpdateRef.current) {
        editorRef.current.isReady && editorRef.current.isReady.then(() => {
          editorRef.current.render(data);
          lastUpdateRef.current = dataString;
        });
      }
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return <div id={holder} className="border rounded-lg p-4 min-h-[300px]" />;
};

export default Editor;
