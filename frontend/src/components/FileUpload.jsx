import React, { useRef, useState } from 'react';
import './FileUpload.css';

const ACCEPTED = '.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.html,.css,.scss,.go,.rb,.php,.swift,.kt,.rs,.vue,.json,.md,.txt';

export default function FileUpload({ onFileSelect, label = 'Upload File', accept = ACCEPTED }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleClear = (e) => {
    e.stopPropagation();
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileSelect(null);
  };

  return (
    <div
      className={`file-upload ${dragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {fileName ? (
        <div className="file-selected">
          <span className="file-icon">📄</span>
          <span className="file-name">{fileName}</span>
          <button className="file-clear" onClick={handleClear} title="Remove file">✕</button>
        </div>
      ) : (
        <div className="file-placeholder">
          <span className="upload-icon">⬆</span>
          <span className="upload-label">{label}</span>
          <span className="upload-hint">Click or drag & drop a file</span>
          <span className="upload-types">JS · TS · PY · JAVA · CPP · HTML · CSS + more</span>
        </div>
      )}
    </div>
  );
}
