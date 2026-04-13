"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState("Spanish");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [statusText, setStatusText] = useState("Processing...");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    "Arabic", "Bulgarian", "Chinese", "Czech", "Croatian", "Danish", "Dutch",
    "English", "Filipino", "Finnish", "French", "German", "Greek", "Hindi",
    "Hungarian", "Indonesian", "Italian", "Japanese", "Korean", "Malay",
    "Norwegian", "Polish", "Romanian", "Russian", "Slovak", "Spanish",
    "Swedish", "Tamil", "Turkish", "Ukrainian", "Thai", "Vietnamese"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleTranslate = () => {
    if (!selectedFile) return;
    setIsTranslating(true);
    setStatusText("Extracting Audio...");

    const statuses = [
      "Extracting Audio...",
      "Transcribing with ElevenLabs...",
      "Translating with Gemini...",
      "Generating Speech with ElevenLabs...",
      "Merging Media..."
    ];
    let idx = 0;

    const interval = setInterval(() => {
      idx++;
      if (idx < statuses.length) {
        setStatusText(statuses[idx]);
      }
    }, 2000); // Faked speed for demo purposes

    // Fake API call completion
    setTimeout(() => {
      clearInterval(interval);
      setIsTranslating(false);
      setShowResult(true);
    }, statuses.length * 2000);
  };

  const handleReset = () => {
    setShowResult(false);
    setSelectedFile(null);
  };

  return (
    <div className="container">
      <header>
        <h1><span className="logo-circle"></span> DubMe.ai</h1>
        <p>The Human Interface for AI Video Localization</p>
      </header>

      <main style={{ width: "100%" }}>
        {!showResult ? (
          <div className="translator-panel glass-panel">
            <div
              className={`upload-section ${isDragOver ? "dragover" : ""}`}
              style={{ pointerEvents: isTranslating ? "none" : "auto", opacity: isTranslating ? 0.5 : 1 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="video/*, audio/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="upload-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="upload-icon">
                  <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 11L12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 20H16C18.2091 20 20 18.2091 20 16V13M4 16C4 18.2091 5.79086 20 8 20H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <h3>{selectedFile ? selectedFile.name : "Drag & Drop media here"}</h3>
                <p>or click to browse files</p>
              </div>
            </div>

            <div className="settings-section">
              <label htmlFor="language-select">Target Language</label>
              <select
                id="language-select"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                disabled={isTranslating}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {!isTranslating && (
              <button
                className="primary-btn"
                disabled={!selectedFile}
                onClick={handleTranslate}
              >
                Translate Media
              </button>
            )}

            {isTranslating && (
              <div id="loading-state">
                <div className="spinner"></div>
                <p id="status-text">{statusText}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="result-panel glass-panel">
            <div className="side-by-side-container">
              <div className="side-col">
                <h3>Original</h3>
                <div className="media-container" id="original-media-container">
                  <p style={{ color: "#888" }}>(Original Media Thumbnail)</p>
                </div>
              </div>
              <div className="side-col">
                <h3>Translated</h3>
                <div className="media-container" id="translated-media-container">
                    <p style={{ color: "#888" }}>(Translated Media Thumbnail)</p>
                </div>
                <button className="primary-btn" style={{ marginTop: "1rem", padding: "0.8rem", fontSize: "1rem" }}>
                  Apply Edits & Re-Dub
                </button>
              </div>
            </div>

            <div className="download-container" style={{ marginTop: "3rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button className="tertiary-btn" onClick={handleReset}>Translate Another File</button>
              <div className="dropdown-wrapper" style={{ flex: 2, position: "relative" }}>
                <button className="secondary-btn" style={{ width: "100%" }}>Download ▾</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
