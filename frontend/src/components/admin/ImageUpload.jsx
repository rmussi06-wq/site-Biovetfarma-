import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase.js';

export default function ImageUpload({ onUpload, currentUrl }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl || '');
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));
    uploadFile(file);
  };

  const uploadFile = (file) => {
    const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    setUploading(true);

    task.on(
      'state_changed',
      (snap) => {
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      () => {
        setError('Erro ao enviar. Tente novamente.');
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onUpload(url);
        setUploading(false);
        setProgress(0);
      }
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.dropzone}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-label="Área para upload de imagem"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" style={styles.preview} />
        ) : (
          <div style={styles.placeholder}>
            <span style={{ fontSize: '40px' }}>📷</span>
            <p style={styles.hint}>Clique ou arraste uma imagem</p>
            <p style={styles.hint2}>JPG, PNG ou WebP · máx. 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {uploading && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          <span style={styles.progressText}>{progress}%</span>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      {preview && !uploading && (
        <button
          type="button"
          style={styles.changeBtn}
          onClick={() => { setPreview(''); onUpload(''); }}
        >
          Remover imagem
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dropzone: {
    border: '2px dashed #ccc',
    borderRadius: '16px',
    minHeight: '160px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
    background: '#f9f9f9',
  },
  preview: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  placeholder: {
    textAlign: 'center',
    padding: '20px',
  },
  hint: {
    fontSize: '14px',
    color: '#666',
    marginTop: '8px',
  },
  hint2: {
    fontSize: '12px',
    color: '#aaa',
    marginTop: '4px',
  },
  progressBar: {
    background: '#e0e0e0',
    borderRadius: '50px',
    height: '8px',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    background: 'var(--color-turquesa)',
    height: '100%',
    borderRadius: '50px',
    transition: 'width 0.3s',
  },
  progressText: {
    position: 'absolute',
    right: '8px',
    top: '-18px',
    fontSize: '11px',
    color: '#666',
  },
  error: {
    color: '#c0392b',
    fontSize: '13px',
  },
  changeBtn: {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '13px',
    color: '#888',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    alignSelf: 'flex-start',
  },
};
