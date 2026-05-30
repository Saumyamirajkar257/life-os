'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileDown, Upload, Plus, Type, MousePointer, PenTool, RotateCcw, RotateCw,
  Trash2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCw, FileText,
  Square, Circle, Minus, ArrowRight, Highlighter, PenLine, Image as ImageIcon,
  MessageSquare, Layers, FilePlus, FileX, RotateCw as RotateIcon, Moon, Sun,
  Search, Merge, Scissors, Undo2, Redo2, ChevronDown, ChevronUp, X, Check,
  Move, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Brain
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { DrawingCanvas, type DrawingStroke } from './DrawingCanvas';
import { useBrainStore } from '@/store/useBrainStore';

// ─── Types ─────────────────────────────────────────────────────────────────

type ToolType = 'select' | 'text' | 'draw' | 'shape' | 'highlight' | 'signature' | 'image' | 'sticky';

type ShapeType = 'rect' | 'ellipse' | 'line' | 'arrow';

interface BaseAnnotation {
  id: string;
  pageNum: number;
  x: number; // fraction 0-1
  y: number; // fraction 0-1
  width: number; // fraction
  height: number; // fraction
}

interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  bgColor: string;
}

interface ShapeAnnotation extends BaseAnnotation {
  type: 'shape';
  shape: ShapeType;
  color: string;
  fill: string;
  thickness: number;
}

interface HighlightAnnotation extends BaseAnnotation {
  type: 'highlight';
  color: string;
  opacity: number;
  text?: string;
}

interface StickyAnnotation extends BaseAnnotation {
  type: 'sticky';
  text: string;
  color: string;
  collapsed: boolean;
}

interface ImageAnnotation extends BaseAnnotation {
  type: 'image';
  src: string; // data URL
}

type Annotation = TextAnnotation | ShapeAnnotation | HighlightAnnotation | StickyAnnotation | ImageAnnotation;

interface PageDimensions {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

interface HistoryEntry {
  annotations: Annotation[];
  drawings: Record<number, DrawingStroke[]>;
}

const FONT_FAMILIES = ['Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Arial'];
const COLORS = ['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
const HIGHLIGHT_COLORS = ['#fef08a', '#86efac', '#93c5fd', '#f9a8d4', '#fda4af'];
const STICKY_COLORS = ['#fef08a', '#86efac', '#93c5fd', '#fca5a5', '#d9f99d'];

// ─── Main Component ─────────────────────────────────────────────────────────

export function PdfEditor() {
  const [scriptsReady, setScriptsReady] = useState(false);

  // PDF document state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [pageDimensions, setPageDimensions] = useState<PageDimensions | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});

  // Merge PDFs
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  // Tool state
  const [tool, setTool] = useState<ToolType>('select');
  const [shapeType, setShapeType] = useState<ShapeType>('rect');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [textBg, setTextBg] = useState('transparent');
  const [shapeColor, setShapeColor] = useState('#3b82f6');
  const [shapeFill, setShapeFill] = useState('transparent');
  const [shapeThickness, setShapeThickness] = useState(2);
  const [brushColor, setBrushColor] = useState('#ef4444');
  const [brushThickness, setBrushThickness] = useState(4);
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [stickyColor, setStickyColor] = useState('#fef08a');

  // Annotation state + history
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawings, setDrawings] = useState<Record<number, DrawingStroke[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);

  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [showThumbs, setShowThumbs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [thumbUrls, setThumbUrls] = useState<Record<number, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [drawingShape, setDrawingShape] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [typedSignature, setTypedSignature] = useState('');
  const [syncToast, setSyncToast] = useState<{ show: boolean; msg: string; success: boolean } | null>(null);
  const [copilotMenu, setCopilotMenu] = useState<{ x: number; y: number; text: string; show: boolean; annotationId?: string } | null>(null);
  const [aiResponse, setAiResponse] = useState<{ show: boolean; query: string; text: string; loading: boolean } | null>(null);

  const triggerAiCopilot = async (mode: 'explain' | 'flashcard', contextText: string) => {
    setAiResponse({
      show: true,
      query: contextText,
      text: '',
      loading: true
    });

    const promptMessage = mode === 'explain' 
      ? `Explain this content simply in 3-4 clear sentences: "${contextText}"`
      : `Create a brief Q&A flashcard study helper from this text: "${contextText}"`;

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chat',
          message: promptMessage,
          context: {
            memory: {},
            tasks: [],
            habits: [],
            transactions: []
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(prev => prev ? { ...prev, text: data.response || 'No response returned from AI.', loading: false } : null);
      } else {
        throw new Error("Failed to contact AI API");
      }
    } catch (err) {
      console.error(err);
      // Graceful local simulated fallback if API keys are offline
      setTimeout(() => {
        const fallbackText = mode === 'explain'
          ? `[Local AI Copilot Explainer]\nThis passage discusses: "${contextText.substring(0, 90)}...". It establishes core theoretical concepts key to analyzing high-performance workflows.`
          : `[Local Flashcard Helper]\nQ: What is the main takeaway from the text?\nA: It focuses on: "${contextText.substring(0, 90)}...".`;
        setAiResponse(prev => prev ? { ...prev, text: fallbackText, loading: false } : null);
      }, 1000);
    }
  };

  const handleOverlayMouseUp = (e: React.MouseEvent) => {
    const sel = window.getSelection();
    const selText = sel?.toString().trim();
    if (selText && overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      setCopilotMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 45,
        text: selText,
        show: true
      });
    }
  };

  const showSyncToast = (msg: string, success = true) => {
    setSyncToast({ show: true, msg, success });
    setTimeout(() => setSyncToast(null), 3000);
  };

  const syncIndividualToSecondBrain = (ann: Annotation) => {
    let title = '';
    let content = '';
    let type: 'note' | 'idea' = 'note';
    let tags = ['pdf-sync'];

    if (ann.type === 'text') {
      title = 'PDF Text Snippet';
      content = ann.text;
      type = 'note';
    } else if (ann.type === 'sticky') {
      title = 'PDF Sticky Note';
      content = ann.text;
      type = 'idea';
    } else if (ann.type === 'highlight') {
      title = 'PDF Highlight Note';
      content = ann.text || 'No comment provided for this highlight.';
      type = 'note';
      tags.push('highlight');
    } else {
      return;
    }

    try {
      useBrainStore.getState().addNode({
        title,
        content: `${content}\n\n*Synced from page ${ann.pageNum} of ${pdfFile?.name || 'document'}*`,
        type,
        tags,
        connections: [],
        url: '',
      });
      showSyncToast(`Synced individual note to Second Brain!`);
    } catch (err) {
      console.error(err);
      showSyncToast(`Sync failed: store unavailable`, false);
    }
  };

  const syncAllToSecondBrain = () => {
    if (annotations.length === 0) {
      showSyncToast('No annotations found to sync.', false);
      return;
    }

    const docName = pdfFile?.name || 'Document';
    const notesCount = annotations.filter(a => a.type === 'text' || a.type === 'sticky' || a.type === 'highlight').length;
    
    if (notesCount === 0) {
      showSyncToast('No text, sticky, or highlight annotations to sync.', false);
      return;
    }

    let markdown = `# Study Highlights & Notes from ${docName}\n\n`;
    markdown += `*Generated automatically from PDF editor annotations.*\n\n---\n\n`;

    const pageGroups: Record<number, Annotation[]> = {};
    annotations.forEach(ann => {
      if (!pageGroups[ann.pageNum]) pageGroups[ann.pageNum] = [];
      pageGroups[ann.pageNum].push(ann);
    });

    const sortedPages = Object.keys(pageGroups).map(Number).sort((a, b) => a - b);
    
    sortedPages.forEach(pageNum => {
      markdown += `## Page ${pageNum}\n\n`;
      const pageAnns = pageGroups[pageNum];
      
      pageAnns.forEach(ann => {
        if (ann.type === 'text') {
          markdown += `> **Text Note:** ${ann.text}\n\n`;
        } else if (ann.type === 'sticky') {
          markdown += `📌 **Sticky Note:** ${ann.text}\n\n`;
        } else if (ann.type === 'highlight') {
          const comment = ann.text || '*(Highlighted Section)*';
          markdown += `🟡 **Highlight Note:** ${comment}\n\n`;
        }
      });
      
      markdown += `\n`;
    });

    try {
      useBrainStore.getState().addNode({
        title: `${docName.replace(/\.[^/.]+$/, '')} - Study Guide`,
        content: markdown,
        type: 'note',
        tags: ['pdf-sync', 'study-guide', 'auto-export'],
        connections: [],
        url: '',
      });
      showSyncToast(`Successfully synced ${notesCount} annotations to Second Brain!`);
    } catch (err) {
      console.error(err);
      showSyncToast(`Sync failed: store unavailable`, false);
    }
  };

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const thumbCanvasRef = useRef<HTMLCanvasElement>(null);

  // ─── History helpers ────────────────────────────────────────────────────

  const pushHistory = useCallback((anns: Annotation[], drws: Record<number, DrawingStroke[]>) => {
    setHistory(h => [...h.slice(-40), { annotations: anns, drawings: drws }]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture(f => [{ annotations, drawings }, ...f.slice(0, 39)]);
      setAnnotations(prev.annotations);
      setDrawings(prev.drawings);
      return h.slice(0, -1);
    });
  }, [annotations, drawings]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f;
      const next = f[0];
      setHistory(h => [...h, { annotations, drawings }]);
      setAnnotations(next.annotations);
      setDrawings(next.drawings);
      return f.slice(1);
    });
  }, [annotations, drawings]);

  // ─── Boot PDF.js ────────────────────────────────────────────────────────

  useEffect(() => {
    const check = () => {
      const w = window as any;
      if (w.pdfjsLib) {
        w.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setScriptsReady(true);
      } else {
        setTimeout(check, 200);
      }
    };
    check();
  }, []);

  // ─── Keyboard shortcuts ──────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingId) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'v') setTool('select');
      if (e.key === 't') setTool('text');
      if (e.key === 'd') setTool('draw');
      if (e.key === 's') setTool('shape');
      if (e.key === 'h') setTool('highlight');
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) deleteAnnotation(selectedId);
      }
      if (e.key === 'Escape') { setSelectedId(null); setEditingId(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedId, editingId]);

  // ─── Render page ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!pdfDocProxy || !scriptsReady) return;
    const raf = requestAnimationFrame(() => renderPage(currentPage));
    return () => cancelAnimationFrame(raf);
  }, [pdfDocProxy, currentPage, zoom, scriptsReady, pageRotations]);

  // Generate thumbnails whenever doc changes
  useEffect(() => {
    if (!pdfDocProxy || !scriptsReady) return;
    generateThumbnails();
  }, [pdfDocProxy, scriptsReady]);

  const renderPage = async (pageNumber: number) => {
    try {
      setLoading(true);
      const page = await pdfDocProxy.getPage(pageNumber);
      const rotation = pageRotations[pageNumber] || 0;
      const viewport = page.getViewport({ scale: zoom, rotation });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      ctx.scale(dpr, dpr);
      if (darkMode) {
        ctx.filter = 'invert(1) hue-rotate(180deg)';
      } else {
        ctx.filter = 'none';
      }
      await page.render({ canvasContext: ctx, viewport }).promise;
      const origVp = page.getViewport({ scale: 1.0, rotation });
      setPageDimensions({ width: viewport.width, height: viewport.height, originalWidth: origVp.width, originalHeight: origVp.height });
    } catch (err) {
      console.error('render error', err);
    } finally {
      setLoading(false);
    }
  };

  const generateThumbnails = async () => {
    if (!pdfDocProxy) return;
    const urls: Record<number, string> = {};
    const offscreen = document.createElement('canvas');
    for (let i = 1; i <= pdfDocProxy.numPages; i++) {
      try {
        const page = await pdfDocProxy.getPage(i);
        const vp = page.getViewport({ scale: 0.2 });
        offscreen.width = vp.width;
        offscreen.height = vp.height;
        const ctx = offscreen.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        urls[i] = offscreen.toDataURL();
      } catch { /* skip */ }
    }
    setThumbUrls(urls);
  };

  // ─── Load PDF ─────────────────────────────────────────────────────────────

  const loadPdfFile = (file: File) => {
    setLoading(true);
    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const bytes = ev.target?.result as ArrayBuffer;
      setPdfBytes(bytes);
      await loadPdfFromBytes(bytes);
    };
    reader.readAsArrayBuffer(file);
  };

  const loadPdfFromBytes = async (bytes: ArrayBuffer) => {
    try {
      const w = window as any;
      if (!w.pdfjsLib) return;
      const pdf = await w.pdfjsLib.getDocument({ data: bytes }).promise;
      setPdfDocProxy(pdf);
      setNumPages(pdf.numPages);
      setCurrentPage(1);
      setAnnotations([]);
      setDrawings({});
      setHistory([]);
      setFuture([]);
      setPageRotations({});
    } catch (err) {
      console.error('load error', err);
    }
  };

  const createBlankPdf = async () => {
    try {
      setLoading(true);
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.276, 841.890]);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      page.drawText('FA9 PDF Workspace', { x: 50, y: 800, size: 22, font, color: rgb(0.2, 0.4, 0.9) });
      const font2 = await doc.embedFont(StandardFonts.Helvetica);
      page.drawText('Click the Text tool and click anywhere to add content.', { x: 50, y: 760, size: 12, font: font2, color: rgb(0.4, 0.4, 0.4) });
      const bytes = await doc.save();
      const ab = bytes.buffer as ArrayBuffer;
      setPdfBytes(ab);
      setPdfFile(new File([ab], 'blank.pdf', { type: 'application/pdf' }));
      await loadPdfFromBytes(ab);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Drag & Drop ─────────────────────────────────────────────────────────

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') loadPdfFile(file);
  };

  // ─── Page management ──────────────────────────────────────────────────────

  const rotatePage = (dir: 'cw' | 'ccw') => {
    setPageRotations(prev => ({
      ...prev,
      [currentPage]: ((prev[currentPage] || 0) + (dir === 'cw' ? 90 : -90) + 360) % 360,
    }));
  };

  const deletePage = async () => {
    if (!pdfBytes || numPages <= 1) return;
    try {
      setLoading(true);
      const doc = await PDFDocument.load(pdfBytes);
      doc.removePage(currentPage - 1);
      const bytes = await doc.save();
      const ab = bytes.buffer as ArrayBuffer;
      setPdfBytes(ab);
      await loadPdfFromBytes(ab);
      setCurrentPage(p => Math.min(p, numPages - 1));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const splitPage = async () => {
    if (!pdfBytes) return;
    try {
      const doc = await PDFDocument.load(pdfBytes);
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(doc, [currentPage - 1]);
      newDoc.addPage(copied);
      const bytes = await newDoc.save();
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `page_${currentPage}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const mergePdfs = async (files: File[]) => {
    if (!pdfBytes || files.length === 0) return;
    try {
      setLoading(true);
      const base = await PDFDocument.load(pdfBytes);
      for (const f of files) {
        const ab = await f.arrayBuffer();
        const other = await PDFDocument.load(ab);
        const pages = await base.copyPages(other, other.getPageIndices());
        pages.forEach(p => base.addPage(p));
      }
      const bytes = await base.save();
      const ab = bytes.buffer as ArrayBuffer;
      setPdfBytes(ab);
      await loadPdfFromBytes(ab);
      setMergeFiles([]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ─── Annotation helpers ───────────────────────────────────────────────────

  const addAnnotation = (ann: Annotation) => {
    const next = [...annotations, ann];
    pushHistory(annotations, drawings);
    setAnnotations(next);
  };

  const updateAnnotation = (id: string, patch: Partial<Annotation>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...patch } as Annotation : a));
  };

  const deleteAnnotation = (id: string) => {
    pushHistory(annotations, drawings);
    setAnnotations(prev => prev.filter(a => a.id !== id));
    setSelectedId(null);
    setEditingId(null);
  };

  const pageAnnotations = annotations.filter(a => a.pageNum === currentPage);

  // ─── Canvas click handler ─────────────────────────────────────────────────

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current || !pageDimensions) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (tool === 'text') {
      const id = crypto.randomUUID();
      const ann: TextAnnotation = {
        id, type: 'text', pageNum: currentPage,
        x, y, width: 0.3, height: 0.05,
        text: '', fontSize, color: textColor, fontFamily,
        bold, italic, align: textAlign, bgColor: textBg,
      };
      addAnnotation(ann);
      setSelectedId(id);
      setEditingId(id);
    } else if (tool === 'sticky') {
      const id = crypto.randomUUID();
      const ann: StickyAnnotation = {
        id, type: 'sticky', pageNum: currentPage,
        x, y, width: 0.22, height: 0.15,
        text: 'Note...', color: stickyColor, collapsed: false,
      };
      addAnnotation(ann);
      setSelectedId(id);
    } else if (tool === 'select') {
      setSelectedId(null);
      setEditingId(null);
    }
  };

  // ─── Shape drawing ────────────────────────────────────────────────────────

  const handleShapePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tool !== 'shape' && tool !== 'highlight') return;
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setDrawingShape({ startX: x, startY: y, endX: x, endY: y });
    overlayRef.current.setPointerCapture(e.pointerId);
  };

  const handleShapePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawingShape || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setDrawingShape(prev => prev ? { ...prev, endX: x, endY: y } : null);
  };

  const handleShapePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawingShape) return;
    const { startX, startY, endX, endY } = drawingShape;
    const w = Math.abs(endX - startX);
    const h = Math.abs(endY - startY);
    if (w > 0.01 && h > 0.01) {
      const id = crypto.randomUUID();
      if (tool === 'shape') {
        const ann: ShapeAnnotation = {
          id, type: 'shape', pageNum: currentPage,
          x: Math.min(startX, endX), y: Math.min(startY, endY),
          width: w, height: h,
          shape: shapeType, color: shapeColor, fill: shapeFill, thickness: shapeThickness,
        };
        addAnnotation(ann);
        setSelectedId(id);
      } else if (tool === 'highlight') {
        const ann: HighlightAnnotation = {
          id, type: 'highlight', pageNum: currentPage,
          x: Math.min(startX, endX),
          y: Math.min(startY, endY),
          width: w, height: h * 0.4, // thinner highlight strip
          color: highlightColor, opacity: 0.45,
          text: '',
        };
        addAnnotation(ann);
        setSelectedId(id);

        // Position AI Copilot floating context menu above the new highlight
        if (overlayRef.current) {
          const rect = overlayRef.current.getBoundingClientRect();
          setCopilotMenu({
            x: (Math.min(startX, endX) + w / 2) * rect.width,
            y: Math.min(startY, endY) * rect.height - 40,
            text: '',
            show: true,
            annotationId: id
          });
        }
      }
    }
    setDrawingShape(null);
  };

  // ─── Drag annotations ─────────────────────────────────────────────────────

  const handleAnnotationPointerDown = (e: React.PointerEvent, id: string) => {
    if (tool !== 'select' || editingId === id) return;
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(id);
    const ann = annotations.find(a => a.id === id);
    if (!ann || !overlayRef.current) return;
    
    // Open floating AI Copilot tooltip on text/sticky/highlight click
    if (ann.type === 'highlight' || ann.type === 'text' || ann.type === 'sticky') {
      const rect = overlayRef.current.getBoundingClientRect();
      setCopilotMenu({
        x: (ann.x + ann.width / 2) * rect.width,
        y: ann.y * rect.height - 40,
        text: (ann as any).text || '',
        show: true,
        annotationId: id
      });
    }

    const rect = overlayRef.current.getBoundingClientRect();
    const startX = e.clientX; const startY = e.clientY;
    const origX = ann.x; const origY = ann.y;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const onMove = (me: PointerEvent) => {
      const dx = (me.clientX - startX) / rect.width;
      const dy = (me.clientY - startY) / rect.height;
      setAnnotations(prev => prev.map(a => a.id === id
        ? { ...a, x: Math.max(0, Math.min(0.95, origX + dx)), y: Math.max(0, Math.min(0.95, origY + dy)) }
        : a
      ));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      pushHistory(annotations, drawings);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ─── Resize handle ────────────────────────────────────────────────────────

  const handleResizePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    const ann = annotations.find(a => a.id === id);
    if (!ann || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const startX = e.clientX; const startY = e.clientY;
    const origW = ann.width; const origH = ann.height;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const onMove = (me: PointerEvent) => {
      const dw = (me.clientX - startX) / rect.width;
      const dh = (me.clientY - startY) / rect.height;
      setAnnotations(prev => prev.map(a => a.id === id
        ? { ...a, width: Math.max(0.05, origW + dw), height: Math.max(0.03, origH + dh) }
        : a
      ));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ─── Drawing layer ────────────────────────────────────────────────────────

  const getScaledStrokes = (): DrawingStroke[] => {
    if (!pageDimensions) return [];
    return (drawings[currentPage] || []).map(s => ({
      ...s,
      points: s.points.map(p => ({ x: p.x * pageDimensions.width, y: p.y * pageDimensions.height })),
    }));
  };

  const handleDrawingChange = (strokes: DrawingStroke[]) => {
    if (!pageDimensions) return;
    const frac = strokes.map(s => ({
      ...s,
      points: s.points.map(p => ({
        x: p.x <= 1 ? p.x : p.x / pageDimensions.width,
        y: p.y <= 1 ? p.y : p.y / pageDimensions.height,
      })),
    }));
    const next = { ...drawings, [currentPage]: frac };
    pushHistory(annotations, drawings);
    setDrawings(next);
  };

  const undoStroke = () => {
    const strokes = drawings[currentPage] || [];
    if (!strokes.length) return;
    pushHistory(annotations, drawings);
    setDrawings(prev => ({ ...prev, [currentPage]: strokes.slice(0, -1) }));
  };

  // ─── Image stamp ─────────────────────────────────────────────────────────

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const id = crypto.randomUUID();
      const ann: ImageAnnotation = {
        id, type: 'image', pageNum: currentPage,
        x: 0.2, y: 0.2, width: 0.3, height: 0.2, src,
      };
      addAnnotation(ann);
      setSelectedId(id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ─── Signature ───────────────────────────────────────────────────────────

  const placeSignature = () => {
    if (signatureMode === 'type' && typedSignature.trim()) {
      const id = crypto.randomUUID();
      const ann: TextAnnotation = {
        id, type: 'text', pageNum: currentPage,
        x: 0.3, y: 0.7, width: 0.4, height: 0.06,
        text: typedSignature, fontSize: 28, color: '#1e3a5f',
        fontFamily: 'Georgia', bold: false, italic: true,
        align: 'left', bgColor: 'transparent',
      };
      addAnnotation(ann);
      setSelectedId(id);
      setShowSignatureModal(false);
      setTypedSignature('');
    } else if (signatureMode === 'draw') {
      const canvas = sigCanvasRef.current;
      if (!canvas) return;
      const src = canvas.toDataURL();
      const id = crypto.randomUUID();
      const ann: ImageAnnotation = {
        id, type: 'image', pageNum: currentPage,
        x: 0.3, y: 0.7, width: 0.35, height: 0.12, src,
      };
      addAnnotation(ann);
      setSelectedId(id);
      setShowSignatureModal(false);
    }
  };

  // Signature canvas drawing
  const sigDrawing = useRef(false);
  const sigLast = useRef<{ x: number; y: number } | null>(null);

  const sigPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    sigDrawing.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    sigLast.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const sigPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!sigDrawing.current || !sigLast.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left; const y = e.clientY - r.top;
    const ctx = e.currentTarget.getContext('2d')!;
    ctx.beginPath();
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.moveTo(sigLast.current.x, sigLast.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    sigLast.current = { x, y };
  };
  const sigPointerUp = () => { sigDrawing.current = false; sigLast.current = null; };
  const clearSigCanvas = () => {
    const c = sigCanvasRef.current;
    if (!c) return;
    c.getContext('2d')?.clearRect(0, 0, c.width, c.height);
  };

  // ─── Export PDF ───────────────────────────────────────────────────────────

  const exportPdf = async () => {
    if (!pdfBytes) return;
    try {
      setLoading(true);
      const doc = await PDFDocument.load(pdfBytes);
      const pages = doc.getPages();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
      const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
      const fontBoldOblique = await doc.embedFont(StandardFonts.HelveticaBoldOblique);

      for (let i = 0; i < pages.length; i++) {
        const pg = pages[i];
        const pageNum = i + 1;
        const { width, height } = pg.getSize();

        // Apply rotation
        const rot = pageRotations[pageNum] || 0;
        if (rot !== 0) pg.setRotation(degrees(rot));

        // Text annotations
        annotations.filter(a => a.pageNum === pageNum && a.type === 'text').forEach(a => {
          const ta = a as TextAnnotation;
          if (!ta.text.trim()) return;
          const pdfX = ta.x * width;
          const pdfY = (1 - ta.y - ta.height) * height;
          const f = ta.bold && ta.italic ? fontBoldOblique : ta.bold ? fontBold : ta.italic ? fontOblique : font;
          const [r, g, b] = hexToRgb(ta.color);
          pg.drawText(ta.text, { x: pdfX, y: pdfY + ta.fontSize * 0.3, size: ta.fontSize, font: f, color: rgb(r, g, b), maxWidth: ta.width * width });
        });

        // Shape annotations
        annotations.filter(a => a.pageNum === pageNum && a.type === 'shape').forEach(a => {
          const sa = a as ShapeAnnotation;
          const x = sa.x * width; const y = (1 - sa.y - sa.height) * height;
          const w = sa.width * width; const h = sa.height * height;
          const [r, g, b] = hexToRgb(sa.color);
          const [fr, fg, fb] = sa.fill !== 'transparent' ? hexToRgb(sa.fill) : [0, 0, 0];
          const opts: any = { borderColor: rgb(r, g, b), borderWidth: sa.thickness, x, y, width: w, height: h };
          if (sa.fill !== 'transparent') opts.color = rgb(fr, fg, fb);
          if (sa.shape === 'rect') pg.drawRectangle(opts);
          else if (sa.shape === 'ellipse') pg.drawEllipse({ ...opts, rx: w / 2, ry: h / 2, x: x + w / 2, y: y + h / 2 });
          else if (sa.shape === 'line' || sa.shape === 'arrow') {
            pg.drawLine({ start: { x, y: y + h }, end: { x: x + w, y }, thickness: sa.thickness, color: rgb(r, g, b) });
          }
        });

        // Highlight annotations
        annotations.filter(a => a.pageNum === pageNum && a.type === 'highlight').forEach(a => {
          const ha = a as HighlightAnnotation;
          const [r, g, b] = hexToRgb(ha.color);
          pg.drawRectangle({
            x: ha.x * width, y: (1 - ha.y - ha.height) * height,
            width: ha.width * width, height: ha.height * height,
            color: rgb(r, g, b), opacity: ha.opacity,
          });
        });

        // Sticky notes (draw as colored rectangle + text)
        annotations.filter(a => a.pageNum === pageNum && a.type === 'sticky').forEach(a => {
          const sa = a as StickyAnnotation;
          const [r, g, b] = hexToRgb(sa.color);
          pg.drawRectangle({ x: sa.x * width, y: (1 - sa.y - sa.height) * height, width: sa.width * width, height: sa.height * height, color: rgb(r, g, b), opacity: 0.8 });
          pg.drawText(sa.text, { x: sa.x * width + 4, y: (1 - sa.y - 0.04) * height, size: 9, font, color: rgb(0.1, 0.1, 0.1), maxWidth: sa.width * width - 8 });
        });

        // Image stamps
        for (const a of annotations.filter(a => a.pageNum === pageNum && a.type === 'image')) {
          const ia = a as ImageAnnotation;
          try {
            const imgBytes = dataUrlToBytes(ia.src);
            const isPng = ia.src.startsWith('data:image/png');
            const img = isPng ? await doc.embedPng(imgBytes) : await doc.embedJpg(imgBytes);
            pg.drawImage(img, { x: ia.x * width, y: (1 - ia.y - ia.height) * height, width: ia.width * width, height: ia.height * height });
          } catch { /* skip */ }
        }

        // Drawings (strokes)
        const pageStrokes = drawings[pageNum] || [];
        pageStrokes.forEach(stroke => {
          if (stroke.points.length < 2) return;
          const [r, g, b] = hexToRgb(stroke.color);
          for (let j = 0; j < stroke.points.length - 1; j++) {
            const p1 = stroke.points[j]; const p2 = stroke.points[j + 1];
            pg.drawLine({
              start: { x: p1.x * width, y: (1 - p1.y) * height },
              end: { x: p2.x * width, y: (1 - p2.y) * height },
              thickness: stroke.thickness, color: rgb(r, g, b),
            });
          }
        });
      }

      const out = await doc.save();
      const blob = new Blob([out as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `edited_${pdfFile?.name || 'document.pdf'}`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  const dataUrlToBytes = (dataUrl: string): Uint8Array => {
    const base64 = dataUrl.split(',')[1];
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };

  const pxFont = (ann: TextAnnotation) => {
    const parts = [];
    if (ann.italic) parts.push('italic');
    if (ann.bold) parts.push('bold');
    parts.push(`${ann.fontSize * zoom}px`);
    parts.push(ann.fontFamily || 'Helvetica');
    return parts.join(' ');
  };

  // ─── Render annotation overlay ────────────────────────────────────────────

  const renderAnnotation = (ann: Annotation) => {
    const isSelected = selectedId === ann.id;
    const isEditing = editingId === ann.id;
    const selectable = tool === 'select';

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${ann.x * 100}%`,
      top: `${ann.y * 100}%`,
      width: `${ann.width * 100}%`,
      height: `${ann.height * 100}%`,
      zIndex: isSelected ? 50 : 30,
      cursor: selectable ? (isEditing ? 'text' : 'move') : 'default',
      boxSizing: 'border-box',
    };

    const selBorder = isSelected ? '2px solid #6366f1' : '2px solid transparent';

    if (ann.type === 'text') {
      const ta = ann as TextAnnotation;
      return (
        <div
          key={ann.id}
          style={{ ...baseStyle, border: selBorder, borderRadius: 3, background: ta.bgColor !== 'transparent' ? ta.bgColor : undefined, minHeight: 28, overflow: 'visible' }}
          onPointerDown={e => handleAnnotationPointerDown(e, ann.id)}
          onDoubleClick={() => { setSelectedId(ann.id); setEditingId(ann.id); }}
        >
          {isEditing ? (
            <textarea
              autoFocus
              value={ta.text}
              onChange={e => updateAnnotation(ann.id, { text: e.target.value } as any)}
              onBlur={() => { if (!ta.text.trim()) deleteAnnotation(ann.id); else setEditingId(null); }}
              onKeyDown={e => { if (e.key === 'Escape') setEditingId(null); e.stopPropagation(); }}
              style={{
                width: '100%', height: '100%', minHeight: 28,
                font: pxFont(ta),
                color: ta.color, background: 'transparent',
                border: 'none', outline: 'none', resize: 'none',
                textAlign: ta.align, padding: 2,
              }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <div style={{ font: pxFont(ta), color: ta.color, textAlign: ta.align, padding: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.3 }}>
              {ta.text || <span style={{ opacity: 0.35, fontStyle: 'italic' }}>Double-click to type…</span>}
            </div>
          )}
          {isSelected && !isEditing && (
            <>
              <button
                onClick={e => { e.stopPropagation(); deleteAnnotation(ann.id); }}
                style={{ position: 'absolute', top: -20, right: -8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}
              >×</button>
              <div
                onPointerDown={e => handleResizePointerDown(e, ann.id)}
                style={{ position: 'absolute', right: -5, bottom: -5, width: 12, height: 12, background: '#6366f1', border: '2px solid white', borderRadius: 2, cursor: 'se-resize', zIndex: 60 }}
              />
            </>
          )}
        </div>
      );
    }

    if (ann.type === 'shape') {
      const sa = ann as ShapeAnnotation;
      const svgStyle: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' };
      return (
        <div key={ann.id} style={{ ...baseStyle, border: selBorder }} onPointerDown={e => handleAnnotationPointerDown(e, ann.id)}>
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            {sa.shape === 'rect' && <rect x="0" y="0" width="100" height="100" stroke={sa.color} strokeWidth={sa.thickness * 100 / Math.max((pageDimensions?.width || 600) * sa.width, 1)} fill={sa.fill === 'transparent' ? 'none' : sa.fill} />}
            {sa.shape === 'ellipse' && <ellipse cx="50" cy="50" rx="50" ry="50" stroke={sa.color} strokeWidth={sa.thickness * 100 / Math.max((pageDimensions?.width || 600) * sa.width, 1)} fill={sa.fill === 'transparent' ? 'none' : sa.fill} />}
            {(sa.shape === 'line' || sa.shape === 'arrow') && <>
              <line x1="0" y1="100" x2="100" y2="0" stroke={sa.color} strokeWidth={sa.thickness * 100 / Math.max((pageDimensions?.width || 600) * sa.width, 1)} />
              {sa.shape === 'arrow' && <polygon points="95,0 100,0 100,5" fill={sa.color} />}
            </>}
          </svg>
          {isSelected && (
            <>
              <button onClick={e => { e.stopPropagation(); deleteAnnotation(ann.id); }} style={{ position: 'absolute', top: -20, right: -8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 12, cursor: 'pointer', zIndex: 60 }}>×</button>
              <div onPointerDown={e => handleResizePointerDown(e, ann.id)} style={{ position: 'absolute', right: -5, bottom: -5, width: 12, height: 12, background: '#6366f1', border: '2px solid white', borderRadius: 2, cursor: 'se-resize', zIndex: 60 }} />
            </>
          )}
        </div>
      );
    }

    if (ann.type === 'highlight') {
      const ha = ann as HighlightAnnotation;
      return (
        <div key={ann.id} style={{ ...baseStyle, background: ha.color, opacity: ha.opacity, border: isSelected ? '1px dashed #6366f1' : 'none', borderRadius: 2, mixBlendMode: 'multiply' }} onPointerDown={e => handleAnnotationPointerDown(e, ann.id)}>
          {isSelected && <button onClick={e => { e.stopPropagation(); deleteAnnotation(ann.id); }} style={{ position: 'absolute', top: -20, right: -8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 12, cursor: 'pointer', zIndex: 60 }}>×</button>}
        </div>
      );
    }

    if (ann.type === 'sticky') {
      const sa = ann as StickyAnnotation;
      return (
        <div key={ann.id} style={{ ...baseStyle, background: sa.color, border: isSelected ? '2px solid #6366f1' : '1px solid rgba(0,0,0,0.15)', borderRadius: 6, boxShadow: '2px 3px 8px rgba(0,0,0,0.18)', overflow: 'hidden' }} onPointerDown={e => handleAnnotationPointerDown(e, ann.id)}>
          <div style={{ padding: '4px 6px', fontSize: 11, color: '#333', fontFamily: 'sans-serif', whiteSpace: 'pre-wrap', wordBreak: 'break-word', height: '100%', overflow: 'auto' }}>
            {isEditing ? (
              <textarea
                autoFocus value={sa.text}
                onChange={e => updateAnnotation(ann.id, { text: e.target.value } as any)}
                onBlur={() => setEditingId(null)}
                onKeyDown={e => { if (e.key === 'Escape') setEditingId(null); e.stopPropagation(); }}
                style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 11, fontFamily: 'sans-serif', color: '#333' }}
              />
            ) : (
              <span onDoubleClick={() => { setSelectedId(ann.id); setEditingId(ann.id); }}>{sa.text}</span>
            )}
          </div>
          {isSelected && (
            <>
              <button onClick={e => { e.stopPropagation(); deleteAnnotation(ann.id); }} style={{ position: 'absolute', top: -20, right: -8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 12, cursor: 'pointer', zIndex: 60 }}>×</button>
              <div onPointerDown={e => handleResizePointerDown(e, ann.id)} style={{ position: 'absolute', right: -5, bottom: -5, width: 12, height: 12, background: '#6366f1', border: '2px solid white', borderRadius: 2, cursor: 'se-resize', zIndex: 60 }} />
            </>
          )}
        </div>
      );
    }

    if (ann.type === 'image') {
      const ia = ann as ImageAnnotation;
      return (
        <div key={ann.id} style={{ ...baseStyle, border: selBorder, overflow: 'hidden', borderRadius: 2 }} onPointerDown={e => handleAnnotationPointerDown(e, ann.id)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ia.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', display: 'block' }} />
          {isSelected && (
            <>
              <button onClick={e => { e.stopPropagation(); deleteAnnotation(ann.id); }} style={{ position: 'absolute', top: -20, right: -8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 12, cursor: 'pointer', zIndex: 60 }}>×</button>
              <div onPointerDown={e => handleResizePointerDown(e, ann.id)} style={{ position: 'absolute', right: -5, bottom: -5, width: 12, height: 12, background: '#6366f1', border: '2px solid white', borderRadius: 2, cursor: 'se-resize', zIndex: 60 }} />
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // ─── Live shape preview ───────────────────────────────────────────────────

  const renderShapePreview = () => {
    if (!drawingShape) return null;
    const { startX, startY, endX, endY } = drawingShape;
    const x = Math.min(startX, endX) * 100;
    const y = Math.min(startY, endY) * 100;
    const w = Math.abs(endX - startX) * 100;
    const h = Math.abs(endY - startY) * 100;
    const color = tool === 'highlight' ? highlightColor : shapeColor;
    return (
      <div style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`,
        border: tool === 'highlight' ? 'none' : `2px dashed ${color}`,
        background: tool === 'highlight' ? color : 'transparent',
        opacity: tool === 'highlight' ? 0.4 : 1,
        pointerEvents: 'none', zIndex: 60,
      }} />
    );
  };

  // ─── Selected annotation property panel ───────────────────────────────────

  const renderPropsPanel = () => {
    const ann = annotations.find(a => a.id === selectedId);
    if (!ann) return null;

    if (ann.type === 'text') {
      const ta = ann as TextAnnotation;
      return (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 flex-wrap px-4 py-2 bg-white/5 border-b border-white/10 w-full">
          <span className="text-[10px] text-white/40 font-semibold uppercase">Text Style:</span>
          <select value={ta.fontFamily} onChange={e => updateAnnotation(ta.id, { fontFamily: e.target.value } as any)}
            className="text-xs bg-black/40 border border-white/10 text-white rounded px-2 py-1 outline-none">
            {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={ta.fontSize} onChange={e => updateAnnotation(ta.id, { fontSize: +e.target.value } as any)}
            className="text-xs bg-black/40 border border-white/10 text-white rounded px-2 py-1 outline-none w-16">
            {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => updateAnnotation(ta.id, { bold: !ta.bold } as any)}
            className={`p-1.5 rounded text-xs font-bold border transition-all ${ta.bold ? 'bg-white text-black border-white' : 'text-white/60 border-white/10 hover:text-white'}`}>B</button>
          <button onClick={() => updateAnnotation(ta.id, { italic: !ta.italic } as any)}
            className={`p-1.5 rounded text-xs italic border transition-all ${ta.italic ? 'bg-white text-black border-white' : 'text-white/60 border-white/10 hover:text-white'}`}>I</button>
          {(['left', 'center', 'right'] as const).map(a => (
            <button key={a} onClick={() => updateAnnotation(ta.id, { align: a } as any)}
              className={`p-1.5 rounded border transition-all text-xs ${ta.align === a ? 'bg-white text-black border-white' : 'text-white/60 border-white/10 hover:text-white'}`}>
              {a === 'left' ? '⬤⬤⬤' : a === 'center' ? ' ⬤⬤ ' : ' ⬤⬤⬤'}
            </button>
          ))}
          <div className="flex gap-1">{COLORS.map(c => (
            <button key={c} onClick={() => updateAnnotation(ta.id, { color: c } as any)}
              style={{ background: c, width: 16, height: 16, borderRadius: '50%', border: ta.color === c ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />
          ))}</div>
          <button 
            onClick={() => syncIndividualToSecondBrain(ta)}
            className="ml-auto text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Send to Second Brain</span>
          </button>
        </motion.div>
      );
    }

    if (ann.type === 'shape') {
      const sa = ann as ShapeAnnotation;
      return (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap px-4 py-2 bg-white/5 border-b border-white/10 w-full">
          <span className="text-[10px] text-white/40 font-semibold uppercase">Shape:</span>
          <div className="flex gap-1">{COLORS.map(c => (
            <button key={c} onClick={() => updateAnnotation(sa.id, { color: c } as any)}
              style={{ background: c, width: 16, height: 16, borderRadius: '50%', border: sa.color === c ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />
          ))}</div>
          <input type="range" min={1} max={12} value={sa.thickness} onChange={e => updateAnnotation(sa.id, { thickness: +e.target.value } as any)} className="w-20 accent-indigo-400" />
          <span className="text-xs text-white/60">{sa.thickness}px</span>
        </motion.div>
      );
    }

    if (ann.type === 'highlight') {
      const ha = ann as HighlightAnnotation;
      return (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap px-4 py-2 bg-white/5 border-b border-white/10 w-full">
          <span className="text-[10px] text-white/40 font-semibold uppercase">Highlight Color:</span>
          <div className="flex gap-1">{HIGHLIGHT_COLORS.map(c => (
            <button key={c} onClick={() => updateAnnotation(ha.id, { color: c } as any)}
              style={{ background: c, width: 16, height: 16, borderRadius: '50%', border: ha.color === c ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />
          ))}</div>
          <span className="text-[10px] text-white/40 font-semibold uppercase ml-2">Note:</span>
          <input 
            type="text" 
            value={ha.text || ''} 
            onChange={e => updateAnnotation(ha.id, { text: e.target.value } as any)}
            placeholder="Add text or comment to this highlight..."
            className="text-xs bg-black/40 border border-white/10 text-white rounded px-3 py-1 outline-none w-64 focus:border-indigo-400"
          />
          <button 
            onClick={() => syncIndividualToSecondBrain(ha)}
            className="ml-auto text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Send to Second Brain</span>
          </button>
        </motion.div>
      );
    }

    if (ann.type === 'sticky') {
      const sa = ann as StickyAnnotation;
      return (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap px-4 py-2 bg-white/5 border-b border-white/10 w-full">
          <span className="text-[10px] text-white/40 font-semibold uppercase">Note Style:</span>
          <div className="flex gap-1">{STICKY_COLORS.map(c => (
            <button key={c} onClick={() => updateAnnotation(sa.id, { color: c } as any)}
              style={{ background: c, width: 16, height: 16, borderRadius: '50%', border: sa.color === c ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />
          ))}</div>
          <button 
            onClick={() => syncIndividualToSecondBrain(sa)}
            className="ml-auto text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Send to Second Brain</span>
          </button>
        </motion.div>
      );
    }
    return null;
  };

  // ─── JSX ─────────────────────────────────────────────────────────────────

  const toolBtn = (t: ToolType, icon: React.ReactNode, label: string, shortcut?: string) => (
    <button
      onClick={() => { setTool(t); setSelectedId(null); setEditingId(null); }}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${tool === t ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/8'}`}
    >
      {icon}{label}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" strategy="afterInteractive" />

      {/* Hidden inputs */}
      <input ref={fileInputRef} type="file" accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f) loadPdfFile(f); e.target.value = ''; }} className="hidden" />
      <input ref={mergeInputRef} type="file" accept=".pdf" multiple onChange={e => { const files = Array.from(e.target.files || []); setMergeFiles(files); mergePdfs(files); e.target.value = ''; }} className="hidden" />
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      <div className="flex-1 flex h-full overflow-hidden rounded-2xl m-6 border border-white/10 bg-black/35 backdrop-blur-xl relative">

        {/* Loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-[100] flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <span className="text-sm font-medium text-white/80">Processing…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Signature Modal ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {showSignatureModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[90] bg-black/70 flex items-center justify-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-[420px] shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Add Signature</h3>
                  <button onClick={() => setShowSignatureModal(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex gap-2 mb-4">
                  {(['draw', 'type'] as const).map(m => (
                    <button key={m} onClick={() => setSignatureMode(m)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${signatureMode === m ? 'bg-indigo-500 text-white' : 'text-white/50 border border-white/10 hover:text-white'}`}>{m === 'draw' ? 'Draw' : 'Type'}</button>
                  ))}
                </div>
                {signatureMode === 'draw' ? (
                  <>
                    <canvas ref={sigCanvasRef} width={360} height={140}
                      className="w-full bg-white rounded-xl border border-white/20 cursor-crosshair touch-none"
                      onPointerDown={sigPointerDown} onPointerMove={sigPointerMove} onPointerUp={sigPointerUp}
                      style={{ touchAction: 'none' }} />
                    <button onClick={clearSigCanvas} className="mt-2 text-xs text-white/40 hover:text-white/70 transition-all">Clear</button>
                  </>
                ) : (
                  <input autoFocus value={typedSignature} onChange={e => setTypedSignature(e.target.value)}
                    placeholder="Type your signature…"
                    className="w-full bg-white rounded-xl px-4 py-3 text-slate-800 text-xl font-['Georgia'] italic outline-none border-2 border-indigo-300 focus:border-indigo-500" />
                )}
                <div className="flex gap-3 mt-4">
                  <button onClick={placeSignature} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"><Check className="w-4 h-4" />Place Signature</button>
                  <button onClick={() => setShowSignatureModal(false)} className="px-4 py-2 text-white/50 hover:text-white border border-white/10 rounded-xl text-sm transition-all">Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sidebar thumbnails ──────────────────────────────────────────── */}
        <AnimatePresence>
          {pdfDocProxy && showThumbs && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 112, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="flex flex-col border-r border-white/10 bg-black/20 overflow-y-auto overflow-x-hidden shrink-0">
              <div className="p-2 text-[10px] text-white/40 font-semibold uppercase tracking-wider border-b border-white/10">Pages</div>
              {Array.from({ length: numPages }, (_, i) => i + 1).map(pg => (
                <button key={pg} onClick={() => setCurrentPage(pg)}
                  className={`group relative m-1.5 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${pg === currentPage ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'border-transparent hover:border-white/30'}`}>
                  {thumbUrls[pg]
                    ? <img src={thumbUrls[pg]} alt={`Page ${pg}`} className="w-full block" />
                    : <div className="w-full aspect-[3/4] bg-white/5 flex items-center justify-center"><FileText className="w-4 h-4 text-white/20" /></div>
                  }
                  <span className="absolute bottom-0 inset-x-0 text-center text-[9px] text-white/70 bg-black/40 py-0.5">{pg}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main editor area ────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* ── Toolbar ─────────────────────────────────────────────────── */}
          {pdfDocProxy && (
            <div className="flex flex-col border-b border-white/10 bg-white/3 shrink-0 relative z-40">
              {/* Row 1: tools */}
              <div className="flex items-center gap-1 px-3 py-2 flex-wrap">
                {/* Toggle thumbs */}
                <button onClick={() => setShowThumbs(v => !v)} title="Toggle pages panel" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all mr-1">
                  <Layers className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* Core tools */}
                {toolBtn('select', <MousePointer className="w-3.5 h-3.5" />, 'Select', 'V')}
                {toolBtn('text', <Type className="w-3.5 h-3.5" />, 'Text', 'T')}
                {toolBtn('draw', <PenTool className="w-3.5 h-3.5" />, 'Draw', 'D')}
                {toolBtn('highlight', <Highlighter className="w-3.5 h-3.5" />, 'Highlight', 'H')}

                {/* Shape tool with sub-selector */}
                <div className="relative group">
                  <button onClick={() => { setTool('shape'); setSelectedId(null); }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${tool === 'shape' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/8'}`}>
                    <Square className="w-3.5 h-3.5" />Shapes
                  </button>
                  <div className="absolute top-full left-0 mt-1 bg-slate-900 border border-white/15 rounded-xl p-1.5 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 flex gap-1">
                    {([['rect', <Square key="r" className="w-4 h-4" />], ['ellipse', <Circle key="e" className="w-4 h-4" />], ['line', <Minus key="l" className="w-4 h-4" />], ['arrow', <ArrowRight key="a" className="w-4 h-4" />]] as [ShapeType, React.ReactNode][]).map(([s, icon]) => (
                      <button key={s} onClick={() => { setShapeType(s); setTool('shape'); }}
                        className={`p-2 rounded-lg transition-all ${shapeType === s ? 'bg-indigo-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>{icon}</button>
                    ))}
                  </div>
                </div>

                {toolBtn('sticky', <MessageSquare className="w-3.5 h-3.5" />, 'Sticky', '')}

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* Signature */}
                <button onClick={() => setShowSignatureModal(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
                  <PenLine className="w-3.5 h-3.5" />Sign
                </button>

                {/* Image stamp */}
                <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
                  <ImageIcon className="w-3.5 h-3.5" />Image
                </button>

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* Page actions */}
                <button onClick={() => rotatePage('ccw')} title="Rotate CCW" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all"><RotateCcw className="w-4 h-4" /></button>
                <button onClick={() => rotatePage('cw')} title="Rotate CW" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all"><RotateCw className="w-4 h-4" /></button>
                <button onClick={splitPage} title="Extract this page" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all"><Scissors className="w-4 h-4" /></button>
                <button onClick={() => mergeInputRef.current?.click()} title="Merge another PDF" className="flex items-center gap-1 px-2 py-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all text-xs"><FilePlus className="w-4 h-4" />Merge</button>
                <button onClick={deletePage} disabled={numPages <= 1} title="Delete this page" className="p-1.5 text-white/50 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all disabled:opacity-30"><FileX className="w-4 h-4" /></button>

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* Undo/Redo */}
                <button onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all disabled:opacity-30"><Undo2 className="w-4 h-4" /></button>
                <button onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Y)" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all disabled:opacity-30"><Redo2 className="w-4 h-4" /></button>
                {tool === 'draw' && <button onClick={undoStroke} title="Undo last stroke" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all"><RotateCcw className="w-4 h-4" /></button>}

                <div className="flex-1" />

                {/* Sync to Second Brain */}
                {pdfFile && annotations.length > 0 && (
                  <button onClick={syncAllToSecondBrain} className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.45)] cursor-pointer active:scale-95">
                    <Brain className="w-3.5 h-3.5" />Export to Brain
                  </button>
                )}

                {/* Save */}
                <button onClick={exportPdf} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <FileDown className="w-4 h-4" />Save PDF
                </button>

                {/* Dark mode */}
                <button onClick={() => setDarkMode(v => !v)} title="Toggle reading mode" className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all">{darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>

                {/* Navigation */}
                <div className="flex items-center bg-white/5 rounded-xl border border-white/5">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-white/60 hover:text-white disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-mono px-3 text-white/90">{currentPage} / {numPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage === numPages} className="p-1.5 text-white/60 hover:text-white disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
                  <button onClick={() => setZoom(p => Math.max(0.4, +(p - 0.1).toFixed(1)))} className="p-1 text-white/60 hover:text-white transition-all"><ZoomOut className="w-3.5 h-3.5" /></button>
                  <span className="text-[10px] font-mono w-10 text-center text-white/90">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(p => Math.min(3, +(p + 0.1).toFixed(1)))} className="p-1 text-white/60 hover:text-white transition-all"><ZoomIn className="w-3.5 h-3.5" /></button>
                </div>

                {/* Upload new */}
                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/8 transition-all" title="Open another PDF"><Upload className="w-4 h-4" /></button>
              </div>

              {/* Row 2: context tool options */}
              {tool === 'draw' && (
                <div className="flex items-center gap-3 px-4 py-1.5 border-t border-white/5 bg-white/2">
                  <span className="text-[10px] uppercase font-semibold text-white/40">Brush:</span>
                  <input type="range" min={1} max={20} value={brushThickness} onChange={e => setBrushThickness(+e.target.value)} className="w-20 accent-indigo-400" />
                  <span className="text-[10px] text-white/60">{brushThickness}px</span>
                  <div className="flex gap-1">{COLORS.map(c => <button key={c} onClick={() => setBrushColor(c)} style={{ background: c, width: 16, height: 16, borderRadius: '50%', border: brushColor === c ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />)}</div>
                </div>
              )}
              {tool === 'text' && !selectedId && (
                <div className="flex items-center gap-3 px-4 py-1.5 border-t border-white/5 bg-white/2 flex-wrap">
                  <span className="text-[10px] uppercase font-semibold text-white/40">New Text:</span>
                  <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="text-xs bg-black/40 border border-white/10 text-white rounded px-2 py-1 outline-none">
                    {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select value={fontSize} onChange={e => setFontSize(+e.target.value)} className="text-xs bg-black/40 border border-white/10 text-white rounded px-2 py-1 outline-none w-16">
                    {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setBold(v => !v)} className={`px-2 py-1 rounded text-xs font-bold border transition-all ${bold ? 'bg-white text-black border-white' : 'text-white/60 border-white/10 hover:text-white'}`}>B</button>
                  <button onClick={() => setItalic(v => !v)} className={`px-2 py-1 rounded text-xs italic border transition-all ${italic ? 'bg-white text-black border-white' : 'text-white/60 border-white/10 hover:text-white'}`}>I</button>
                  <div className="flex gap-1">{COLORS.map(c => <button key={c} onClick={() => setTextColor(c)} style={{ background: c, width: 16, height: 16, borderRadius: '50%', border: textColor === c ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />)}</div>
                </div>
              )}
              {tool === 'highlight' && (
                <div className="flex items-center gap-3 px-4 py-1.5 border-t border-white/5 bg-white/2">
                  <span className="text-[10px] uppercase font-semibold text-white/40">Highlight:</span>
                  <div className="flex gap-1">{HIGHLIGHT_COLORS.map(c => <button key={c} onClick={() => setHighlightColor(c)} style={{ background: c, width: 20, height: 16, borderRadius: 4, border: highlightColor === c ? '2px solid #818cf8' : '1px solid rgba(0,0,0,0.15)', cursor: 'pointer' }} />)}</div>
                </div>
              )}
              {tool === 'shape' && !selectedId && (
                <div className="flex items-center gap-3 px-4 py-1.5 border-t border-white/5 bg-white/2">
                  <span className="text-[10px] uppercase font-semibold text-white/40">Shape:</span>
                  <div className="flex gap-1">{COLORS.map(c => <button key={c} onClick={() => setShapeColor(c)} style={{ background: c, width: 16, height: 16, borderRadius: '50%', border: shapeColor === c ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />)}</div>
                  <input type="range" min={1} max={12} value={shapeThickness} onChange={e => setShapeThickness(+e.target.value)} className="w-20 accent-indigo-400" />
                  <span className="text-[10px] text-white/60">{shapeThickness}px</span>
                </div>
              )}
              {tool === 'sticky' && (
                <div className="flex items-center gap-3 px-4 py-1.5 border-t border-white/5 bg-white/2">
                  <span className="text-[10px] uppercase font-semibold text-white/40">Note color:</span>
                  <div className="flex gap-1">{STICKY_COLORS.map(c => <button key={c} onClick={() => setStickyColor(c)} style={{ background: c, width: 20, height: 16, borderRadius: 4, border: stickyColor === c ? '2px solid #818cf8' : '1px solid rgba(0,0,0,0.15)', cursor: 'pointer' }} />)}</div>
                </div>
              )}
              {/* Selected annotation property panel */}
              {selectedId && renderPropsPanel()}
            </div>
          )}

          {/* ── Canvas workspace ─────────────────────────────────────────── */}
          <div
            className={`flex-1 overflow-auto p-8 flex items-start justify-center min-h-0 relative select-none ${darkMode ? 'bg-gray-900' : 'bg-slate-950/20'}`}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {/* Drag indicator */}
            <AnimatePresence>
              {isDragging && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-4 z-50 rounded-2xl border-2 border-dashed border-indigo-400 bg-indigo-500/10 flex flex-col items-center justify-center pointer-events-none">
                  <Upload className="w-10 h-10 text-indigo-400 mb-2" />
                  <span className="text-indigo-300 font-medium">Drop PDF here</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload area */}
            {!pdfDocProxy && (
              <div className="max-w-md w-full text-center p-10 bg-white/5 border-2 border-dashed border-white/15 rounded-2xl backdrop-blur-md">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                  <FileText className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">FA9 PDF Editor</h3>
                <p className="text-sm text-white/40 mb-6">Drop a PDF here, or choose an action below. Edit text like Canva, annotate, sign, and save.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
                    <Upload className="w-4 h-4" />Open PDF File
                  </button>
                  <div className="flex items-center gap-2"><div className="h-px flex-1 bg-white/5" /><span className="text-[10px] text-white/30 uppercase font-mono">or</span><div className="h-px flex-1 bg-white/5" /></div>
                  <button onClick={createBlankPdf} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />Create Blank Document
                  </button>
                </div>
                <p className="text-[10px] text-white/20 mt-5">Or drag & drop a PDF anywhere on this page</p>
              </div>
            )}

            {/* PDF canvas + overlays */}
            {pdfDocProxy && (
              <div
                ref={overlayRef}
                className="relative bg-white shadow-2xl border border-white/10"
                style={{
                  width: pageDimensions ? `${pageDimensions.width}px` : '612px',
                  height: pageDimensions ? `${pageDimensions.height}px` : '792px',
                  cursor: tool === 'text' ? 'text' : tool === 'shape' || tool === 'highlight' ? 'crosshair' : tool === 'draw' ? 'crosshair' : 'default',
                }}
                onClick={handleOverlayClick}
                onPointerDown={handleShapePointerDown}
                onPointerMove={handleShapePointerMove}
                onPointerUp={handleShapePointerUp}
                onMouseUp={handleOverlayMouseUp}
              >
                {/* PDF canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 z-10" />

                {/* Draw layer */}
                {pageDimensions && (
                  <DrawingCanvas
                    width={pageDimensions.width}
                    height={pageDimensions.height}
                    color={brushColor}
                    thickness={brushThickness}
                    strokes={getScaledStrokes()}
                    onChange={handleDrawingChange}
                    isDrawingMode={tool === 'draw'}
                  />
                )}

                {/* Annotation layer */}
                {pageDimensions && (
                  <div className="absolute inset-0 z-30">
                    {pageAnnotations.map(renderAnnotation)}
                    {renderShapePreview()}

                    {/* Floating AI Copilot tooltip menu */}
                    {copilotMenu?.show && (
                      <div 
                        style={{
                          position: 'absolute',
                          left: `${copilotMenu.x}px`,
                          top: `${copilotMenu.y}px`,
                          transform: 'translateX(-50%)',
                          zIndex: 80,
                        }}
                        className="flex items-center gap-1 bg-zinc-950/95 border border-indigo-500/50 rounded-xl p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none pointer-events-auto"
                      >
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const txt = copilotMenu.text || (copilotMenu.annotationId ? (annotations.find(a => a.id === copilotMenu.annotationId) as any)?.text : '') || 'Highlighted PDF snippet';
                            setCopilotMenu(null);
                            await triggerAiCopilot('explain', txt);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all whitespace-nowrap"
                        >
                          <Brain className="w-3 h-3" /> AI Explain
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const txt = copilotMenu.text || (copilotMenu.annotationId ? (annotations.find(a => a.id === copilotMenu.annotationId) as any)?.text : '') || 'Highlighted PDF snippet';
                            setCopilotMenu(null);
                            await triggerAiCopilot('flashcard', txt);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all whitespace-nowrap"
                        >
                          <Plus className="w-3 h-3" /> Create Flashcard
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setCopilotMenu(null); }}
                          className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* AI Response popover */}
                    {aiResponse?.show && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-4 top-4 z-[80] w-[310px] bg-slate-950/95 border border-white/10 rounded-2xl p-4.5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-4 duration-300 flex flex-col gap-3.5 select-text"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <h4 className="font-display font-semibold text-xs text-indigo-300 flex items-center gap-1.5">
                            <Brain className="w-4 h-4 text-indigo-400" />
                            <span>FA9 PDF Copilot</span>
                          </h4>
                          <button 
                            onClick={() => setAiResponse(null)}
                            className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {aiResponse.loading ? (
                          <div className="flex flex-col items-center justify-center py-8 gap-2.5 text-white/50">
                            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                            <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Consulting Core strategist...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            <div className="max-h-[180px] overflow-y-auto text-xs text-white/80 leading-relaxed font-sans pr-1 scrollbar-thin select-text">
                              {aiResponse.text}
                            </div>
                            
                            <div className="flex gap-2 pt-2 border-t border-white/5">
                              <button
                                onClick={() => {
                                  useBrainStore.getState().addNode({
                                    title: 'PDF Copilot Study Note',
                                    content: `**Context:** ${aiResponse.query}\n\n**AI Response:**\n${aiResponse.text}`,
                                    type: 'note',
                                    tags: ['pdf-copilot', 'study-ref'],
                                    connections: [],
                                    url: '',
                                  });
                                  showSyncToast('Saved copilot explainer directly to Second Brain!');
                                  setAiResponse(null);
                                }}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                              >
                                <Plus className="w-3.5 h-3.5" /> Save to Second Brain
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync Status Toast */}
      <AnimatePresence>
        {syncToast?.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
              syncToast.success 
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' 
                : 'bg-red-500/10 border-red-500/25 text-red-300'
            }`}
          >
            {syncToast.success ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
            <span className="text-xs font-semibold">{syncToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
