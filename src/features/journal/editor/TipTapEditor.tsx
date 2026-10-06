/**
 * @file TipTapEditor.tsx
 * @description TipTap-powered Rich Text and Markdown Editor with custom toolbar, task lists, tables, images, and autosave status.
 * @module Features/Journal/Editor
 */

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Sparkles,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournalEditorState } from '../stores/useJournalEditorState';

interface TipTapEditorProps {
  initialContent: string;
  placeholderText?: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  initialContent,
  placeholderText = 'Capture your thoughts, ideas, or reflection...',
  onChange,
  readOnly = false,
}) => {
  const { autosaveStatus, wordCount, readingTimeMinutes, setContent } = useJournalEditorState();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholderText }),
    ],
    content: initialContent || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || '');
    }
  }, [initialContent, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading TipTap Editor...
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt('Enter Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="flex flex-col border border-slate-800/80 rounded-2xl bg-slate-950/40 overflow-hidden shadow-2xl">
      {/* Editor Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-1">
            {/* Formatting Group */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('bold') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Bold (⌘B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('italic') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Italic (⌘I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('strike') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('code') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-slate-800 mx-1" />

            {/* Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('heading', { level: 1 }) && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('heading', { level: 2 }) && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('heading', { level: 3 }) && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-slate-800 mx-1" />

            {/* Lists & Task Items */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('bulletList') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('orderedList') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('taskList') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Task List / Checklist"
            >
              <CheckSquare className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-slate-800 mx-1" />

            {/* Insert Blocks */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('blockquote') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Quote Block"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertTable}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Insert Table (3x3)"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={addImage}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={addLink}
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors',
                editor.isActive('link') && 'bg-slate-800 text-purple-400 font-bold'
              )}
              title="Hyperlink"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-slate-800 mx-1" />

            {/* Undo / Redo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Undo (⌘Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Redo (⌘⇧Z)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Autosave Status Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono">
            {autosaveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                <span className="text-amber-400">Saving...</span>
              </>
            )}
            {autosaveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            )}
            {autosaveStatus === 'idle' && (
              <>
                <Sparkles className="w-3 h-3 text-slate-500" />
                <span>Ready</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="p-6 text-slate-200 min-h-[360px] focus:outline-none prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-100 prose-a:text-purple-400 prose-code:text-purple-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-purple-500 prose-blockquote:text-slate-400">
        <EditorContent editor={editor} />
      </div>

      {/* Editor Footer / Word Count Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/90 border-t border-slate-900 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span>{wordCount} Words</span>
          <span>•</span>
          <span>{readingTimeMinutes} min read</span>
        </div>
        <div className="text-slate-400 hidden sm:block">
          Markdown & Shortcodes Supported
        </div>
      </div>
    </div>
  );
};
