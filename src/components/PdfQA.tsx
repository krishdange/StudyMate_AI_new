import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Send, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface Document {
  id: number;
  file_name: string;
  created_at: string;
}

interface QAHistory {
  question: string;
  answer: string;
}

export function PdfQA() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [qaHistory, setQaHistory] = useState<QAHistory[]>([]);
  const [question, setQuestion] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await api.getDocuments();
      setDocuments(data.map((doc: any) => ({
        id: doc.id,
        file_name: doc.file_name,
        created_at: doc.created_at,
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load documents',
        description: 'Please refresh the page',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload a PDF or image file',
      });
      return;
    }

    setIsUploading(true);

    try {
      const document = await api.uploadDocument(file);
      setDocuments((prev) => [...prev, {
        id: document.id,
        file_name: document.file_name,
        created_at: document.created_at,
      }]);
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
      e.target.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Failed to upload document',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedDoc || !question.trim()) return;

    setIsAsking(true);

    try {
      const response = await api.askDocumentQuestion(selectedDoc.id, question.trim());
      setQaHistory((prev) => [...prev, {
        question: response.question,
        answer: response.answer,
      }]);
      setQuestion('');
    } catch (error: any) {
      console.error('Q&A error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to get answer',
        description: error.message || 'Please try again',
      });
    } finally {
      setIsAsking(false);
    }
  };

  const handleDeleteDoc = async (docId: number) => {
    try {
      await api.deleteDocument(docId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
        setQaHistory([]);
      }
      toast({
        title: 'Success',
        description: 'Document deleted',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: error.message || 'Please try again',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Documents List */}
      <Card className="glass p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Documents</h2>
          <label htmlFor="pdf-upload">
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              asChild
            >
              <span className="cursor-pointer">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </span>
            </Button>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No documents yet. Upload a PDF to get started.
            </p>
          ) : (
            documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors group ${
                  selectedDoc?.id === doc.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-accent'
                }`}
                onClick={() => {
                  setSelectedDoc(doc);
                  setQaHistory([]);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{doc.file_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDoc(doc.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Q&A Interface */}
      <Card className="glass p-6 flex flex-col lg:col-span-2">
        {!selectedDoc ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Select a document to start asking questions
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">{selectedDoc.file_name}</h2>
              <p className="text-sm text-muted-foreground">
                Ask questions about this document
              </p>
            </div>

            {/* Q&A History */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <AnimatePresence>
                {qaHistory.map((qa, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg p-3">
                        <p className="text-sm">{qa.question}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-secondary text-secondary-foreground rounded-lg p-3">
                        <p className="text-sm whitespace-pre-wrap">{qa.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Question Input */}
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskQuestion();
                  }
                }}
                placeholder="Ask a question about this document..."
                disabled={isAsking}
              />
              <Button
                onClick={handleAskQuestion}
                disabled={isAsking || !question.trim()}
              >
                {isAsking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}