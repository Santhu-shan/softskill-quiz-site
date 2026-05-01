import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { extractTextFromPDF } from "../services/pdfService";
import { analyzePDFContent } from "../services/aiService";
import { parseFilename, filenameToId, checkTopicExists, saveTopic } from "../services/dbService";
import { isConfigured } from "../services/firebase";
import "./UploadPage.css";

const CATEGORY_LABELS = {
  qual1: "Qualitative Skill 1", quant1: "Quantitative Skill 1",
  qual2: "Qualitative Skill 2", quant2: "Quantitative Skill 2",
};
const SUB_LABELS = { face: "FACE", ethuns: "ETHUNS", six_phase: "Six Phase" };

const STATUS = { PENDING: "pending", PROCESSING: "processing", DONE: "done", DUPLICATE: "duplicate", ERROR: "error" };

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);         // { file, id, status, meta, result, error, existingId }
  const [dragging, setDragging] = useState(false);
  const [globalProcessing, setGlobalProcessing] = useState(false);

  if (!isConfigured) {
    return (
      <div className="page-container upload-page">
        <div className="setup-warning glass anim-scale">
          <div className="sw-icon">📤</div>
          <h2>Upload Requires Firebase</h2>
          <p>To share your PDF summaries with the community, you need to connect your own Firebase project.</p>
          <div className="sw-steps">
            <p><strong>Setup Steps:</strong></p>
            <ol>
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer">Firebase Console</a></li>
              <li>Add a project and a <strong>Web App</strong></li>
              <li>Copy the <code>firebaseConfig</code> values to your <code>.env</code></li>
              <li>In the console, go to <strong>Firestore Database</strong> and click "Create Database"</li>
            </ol>
          </div>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    );
  }

  // ── File selection ──
  function addFiles(newFiles) {
    const pdfs = Array.from(newFiles).filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (!pdfs.length) { alert("Only PDF files are accepted."); return; }

    setFiles(prev => {
      const existing = new Set(prev.map(f => f.file.name));
      const toAdd = pdfs
        .filter(f => !existing.has(f.name))
        .map(f => ({
          file: f,
          id: filenameToId(f.name),
          status: STATUS.PENDING,
          meta: parseFilename(f.name),
          result: null,
          error: null,
          existingId: null,
        }));
      return [...prev, ...toAdd];
    });
  }

  function onInputChange(e) { addFiles(e.target.files); e.target.value = ""; }
  function onDrop(e) { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }
  function onDragOver(e) { e.preventDefault(); setDragging(true); }
  function onDragLeave() { setDragging(false); }
  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  // ── Update a single file's state ──
  function updateFile(id, patch) {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
  }

  // ── Process all pending files ──
  async function processAll() {
    const pending = files.filter(f => f.status === STATUS.PENDING);
    if (!pending.length) return;
    setGlobalProcessing(true);

    for (const item of pending) {
      updateFile(item.id, { status: STATUS.PROCESSING });
      try {
        // 1) Check for duplicate
        const existing = await checkTopicExists(item.id);
        if (existing) {
          updateFile(item.id, { status: STATUS.DUPLICATE, existingId: item.id, result: existing });
          continue;
        }

        // 2) Extract text
        const pdfText = await extractTextFromPDF(item.file);
        if (!pdfText.trim()) throw new Error("No readable text found in PDF. It may be image-based.");

        // 3) AI Analysis
        const analysis = await analyzePDFContent({
          pdfText,
          filename: item.file.name,
          parsedMeta: item.meta,
        });

        // 4) Build final topic document
        const topicDoc = {
          id: item.id,
          fileName: item.file.name,
          topicName: analysis.topicName || item.meta.topicName,
          description: analysis.description || "",
          mainCategory: analysis.mainCategory || "qual1",
          subCategory: analysis.subCategory || "face",
          categoryReason: analysis.categoryReason || "",
          semester: item.meta.semester,
          year: item.meta.year,
          courseCode: item.meta.courseCode,
          questions: (analysis.questions || []).map((q, i) => ({
            ...q,
            id: q.id || `q${i + 1}`,
          })),
          learningContent: analysis.learningContent || [],
          uploadedBy: "community",
          source: "upload",
        };

        // 5) Save to Firestore
        await saveTopic(item.id, topicDoc);
        updateFile(item.id, { status: STATUS.DONE, result: topicDoc });

      } catch (err) {
        updateFile(item.id, { status: STATUS.ERROR, error: err.message });
      }
    }
    setGlobalProcessing(false);
  }

  const pendingCount    = files.filter(f => f.status === STATUS.PENDING).length;
  const doneCount       = files.filter(f => f.status === STATUS.DONE).length;
  const duplicateCount  = files.filter(f => f.status === STATUS.DUPLICATE).length;
  const errorCount      = files.filter(f => f.status === STATUS.ERROR).length;
  const processingCount = files.filter(f => f.status === STATUS.PROCESSING).length;

  return (
    <div className="page-container upload-page">
      {/* Header */}
      <div className="upload-header anim-fade-up">
        <div className="upload-header-icon">📤</div>
        <div>
          <h1>Upload Learning Content</h1>
          <p>Upload PDF files — AI extracts quiz questions and learning content automatically, shared with everyone.</p>
        </div>
      </div>

      {/* Filename format hint */}
      <div className="filename-hint glass anim-fade-up">
        <div className="fh-title">💡 Filename Format</div>
        <div className="fh-example">
          <span className="fh-token fh-sem">WINSEM2025-26</span>
          <span className="fh-sep">_</span>
          <span className="fh-token fh-type">VL</span>
          <span className="fh-sep">_</span>
          <span className="fh-token fh-code">ISTS202P</span>
          <span className="fh-sep">_</span>
          <span className="fh-token fh-slot">00100</span>
          <span className="fh-sep">_</span>
          <span className="fh-token fh-fac">SS</span>
          <span className="fh-sep">_</span>
          <span className="fh-token fh-date">2026-01-07</span>
          <span className="fh-sep">_</span>
          <span className="fh-token fh-topic">Syllogisms1_1</span>
        </div>
        <div className="fh-legend">
          <span className="fh-token fh-sem">Semester + Year</span>
          <span className="fh-token fh-code">Course Code</span>
          <span className="fh-token fh-date">Date</span>
          <span className="fh-token fh-topic">Topic Name</span>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone glass anim-fade-up ${dragging ? "dragging" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={onInputChange}
          style={{ display: "none" }}
        />
        <div className="dz-icon">{dragging ? "🎯" : "📂"}</div>
        <div className="dz-title">{dragging ? "Drop PDFs here!" : "Drag & Drop PDFs"}</div>
        <div className="dz-sub">or click to browse • PDF files only • Multiple files supported</div>
        <button className="btn btn-primary dz-btn" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
          Choose Files
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="file-list anim-fade-up">
          {/* Summary bar */}
          <div className="file-list-summary">
            <div className="fls-info">
              <strong>{files.length}</strong> file{files.length !== 1 ? "s" : ""} selected
              {doneCount > 0 && <span className="fls-tag fls-done">✅ {doneCount} uploaded</span>}
              {duplicateCount > 0 && <span className="fls-tag fls-dup">⚠️ {duplicateCount} duplicate</span>}
              {errorCount > 0 && <span className="fls-tag fls-err">❌ {errorCount} failed</span>}
              {processingCount > 0 && <span className="fls-tag fls-proc">⚙️ {processingCount} processing</span>}
            </div>
            <div className="fls-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setFiles([])}>Clear All</button>
              <button
                className="btn btn-primary"
                onClick={processAll}
                disabled={globalProcessing || pendingCount === 0}
              >
                {globalProcessing
                  ? <><span className="spinner spinner-sm" /> Processing…</>
                  : `🚀 Upload & Analyse ${pendingCount > 0 ? `(${pendingCount})` : ""}`
                }
              </button>
            </div>
          </div>

          {/* Individual file rows */}
          {files.map(item => (
            <FileRow
              key={item.id}
              item={item}
              onRemove={() => removeFile(item.id)}
              onNavigate={() => navigate(`/community/learn/${item.id}`)}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {files.length === 0 && (
        <div className="upload-empty stagger">
          <div className="ue-card glass">
            <span className="ue-icon">🤖</span>
            <h3>AI-Powered Extraction</h3>
            <p>Gemini AI reads your PDF and generates quiz questions + learning content automatically.</p>
          </div>
          <div className="ue-card glass">
            <span className="ue-icon">🌐</span>
            <h3>Shared With Everyone</h3>
            <p>Uploaded content is stored in the cloud. All users see it instantly in the Community Library.</p>
          </div>
          <div className="ue-card glass">
            <span className="ue-icon">📁</span>
            <h3>Smart Categorization</h3>
            <p>AI reads your filename and content to automatically assign semester, year, topic, and skill category.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Individual file row ── */
function FileRow({ item, onRemove, onNavigate }) {
  const { file, status, meta, result, error, existingId } = item;

  const statusConfig = {
    [STATUS.PENDING]:     { color: "var(--text-muted)",   icon: "⏳", label: "Ready to upload" },
    [STATUS.PROCESSING]:  { color: "#60a5fa",              icon: "⚙️", label: "AI analysing…" },
    [STATUS.DONE]:        { color: "var(--success)",        icon: "✅", label: "Uploaded successfully" },
    [STATUS.DUPLICATE]:   { color: "var(--accent-amber)",  icon: "⚠️", label: "Already exists" },
    [STATUS.ERROR]:       { color: "var(--error)",          icon: "❌", label: "Failed" },
  };

  const sc = statusConfig[status] || statusConfig[STATUS.PENDING];

  return (
    <div className={`file-row glass fr-${status}`}>
      <div className="fr-icon">📄</div>

      <div className="fr-info">
        <div className="fr-name">{file.name}</div>
        <div className="fr-meta">
          {meta.semester !== "Unknown" && <span className="fr-chip fr-sem">{meta.semester}</span>}
          {meta.year !== "Unknown" && <span className="fr-chip fr-year">{meta.year}</span>}
          {meta.courseCode !== "N/A" && <span className="fr-chip fr-code">{meta.courseCode}</span>}
          {meta.topicName && <span className="fr-chip fr-topic">{meta.topicName}</span>}
        </div>

        {/* Status */}
        <div className="fr-status" style={{ color: sc.color }}>
          <span>{sc.icon}</span> {sc.label}
        </div>

        {/* Error detail */}
        {status === STATUS.ERROR && error && (
          <div className="fr-error">
            {error.includes("Quota Exceeded") 
              ? "⚠️ AI Quota Exceeded. Please wait 1 minute and retry." 
              : error}
          </div>
        )}

        {/* Done result preview */}
        {status === STATUS.DONE && result && (
          <div className="fr-result">
            <span className="fr-result-cat">{CATEGORY_LABELS[result.mainCategory] || result.mainCategory}</span>
            <span className="fr-result-sub">· {SUB_LABELS[result.subCategory] || result.subCategory}</span>
            <span className="fr-result-q">{result.questions?.length || 0} questions</span>
          </div>
        )}

        {/* Duplicate: navigate to existing */}
        {status === STATUS.DUPLICATE && (
          <button className="btn btn-secondary btn-sm fr-dup-btn" onClick={onNavigate}>
            View Existing Topic →
          </button>
        )}
      </div>

      {/* Processing spinner */}
      {status === STATUS.PROCESSING && (
        <div className="fr-spinner">
          <span className="spinner" />
        </div>
      )}

      {/* Remove button */}
      {(status === STATUS.PENDING || status === STATUS.ERROR) && (
        <button className="fr-remove" onClick={onRemove} title="Remove">✕</button>
      )}

      {/* Done: view button */}
      {status === STATUS.DONE && (
        <button className="btn btn-success btn-sm" onClick={onNavigate}>View →</button>
      )}
    </div>
  );
}
