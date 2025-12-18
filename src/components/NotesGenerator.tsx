import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, FileText, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface Note {
  id: number;
  topic: string;
  title: string;
  content: string;
  format_type: string;
  created_at: string;
  updated_at: string;
}

export function NotesGenerator() {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("bullet");
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes();
      setNotes(data.map((note: any) => ({
        id: note.id,
        topic: note.topic,
        title: note.title,
        content: note.content,
        format_type: note.format_type,
        created_at: note.created_at,
        updated_at: note.updated_at,
      })));
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const generateNotes = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate notes",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const note = await api.generateNotes(topic.trim(), format);
      const formattedNote: Note = {
        id: note.id,
        topic: note.topic,
        title: note.title,
        content: note.content,
        format_type: note.format_type,
        created_at: note.created_at,
        updated_at: note.updated_at,
      };

      setNotes([formattedNote, ...notes]);
      setSelectedNote(formattedNote);
      setTopic("");
      
      toast({
        title: "Notes generated!",
        description: "Your study notes are ready",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate notes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteNote = async (noteId: number) => {
    try {
      await api.deleteNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
      if (selectedNote?.id === noteId) setSelectedNote(null);

      toast({
        title: "Note deleted",
        description: "Your note has been removed",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Left Sidebar - Generator */}
      <div className="w-80 space-y-4">
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 gradient-text">
              <Sparkles className="w-5 h-5" />
              Generate Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Photosynthesis"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">Bullet Points</SelectItem>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateNotes}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Notes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Saved Notes List */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="text-sm">Your Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet
              </p>
            ) : (
              notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? "bg-primary/20 border border-primary/30"
                      : "bg-background/50 hover:bg-background/70"
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{note.topic}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Note Display */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <motion.div
              key={selectedNote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass-strong h-full">
                <CardHeader>
                  <CardTitle className="gradient-text">{selectedNote.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{selectedNote.content}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <FileText className="w-16 h-16 mx-auto text-primary" />
                <div>
                  <h3 className="text-xl font-display font-bold gradient-text mb-2">
                    No Note Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Generate new notes or select from your saved notes
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
