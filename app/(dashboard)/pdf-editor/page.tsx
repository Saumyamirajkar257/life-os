import { PdfEditor } from '@/components/pdf/PdfEditor';

export const metadata = {
  title: 'PDF Editor | LIFE OS',
  description: 'Upload, render, annotate, and generate PDFs completely client-side.',
};

export default function PdfEditorPage() {
  return (
    <div className="w-full h-full">
      <PdfEditor />
    </div>
  );
}
