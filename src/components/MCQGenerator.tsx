import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, CheckSquare, Loader2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  user_answer?: number;
  is_correct?: boolean;
}

interface MCQSet {
  id: number;
  topic: string;
  title: string;
  difficulty: string;
  questions: Question[];
  created_at: string;
}

export function MCQGenerator() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("5");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mcqSets, setMcqSets] = useState<MCQSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<MCQSet | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMCQSets();
  }, []);

  const loadMCQSets = async () => {
    try {
      const sets = await api.getMCQSets();
      setMcqSets(sets.map((set: any) => ({
        id: set.id,
        topic: set.topic,
        title: set.title,
        difficulty: set.difficulty,
        questions: set.questions || [],
        created_at: set.created_at,
      })));
    } catch (error) {
      console.error("Error loading MCQ sets:", error);
    }
  };

  const generateMCQ = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate questions",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const mcqSet = await api.generateMCQ(topic.trim(), parseInt(count), difficulty);
      const formattedSet: MCQSet = {
        id: mcqSet.id,
        topic: mcqSet.topic,
        title: mcqSet.title,
        difficulty: mcqSet.difficulty,
        questions: mcqSet.questions.map((q: any) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
        })),
        created_at: mcqSet.created_at,
      };
      
      setMcqSets([formattedSet, ...mcqSets]);
      setSelectedSet(formattedSet);
      setUserAnswers({});
      setShowResults(false);
      setTopic("");

      toast({
        title: "Questions generated!",
        description: "Your MCQ set is ready",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate questions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteSet = async (setId: number) => {
    // Note: Backend doesn't have delete endpoint for MCQ sets yet
    // For now, just remove from local state
    setMcqSets(mcqSets.filter((s) => s.id !== setId));
    if (selectedSet?.id === setId) setSelectedSet(null);
    toast({
      title: "Set removed",
      description: "MCQ set removed from list",
    });
  };

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (!showResults) {
      setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
    }
  };

  const submitAnswers = async () => {
    if (!selectedSet) return;

    try {
      const answers: Record<number, number> = {};
      Object.entries(userAnswers).forEach(([qIndex, answer]) => {
        const question = selectedSet.questions[parseInt(qIndex)];
        if (question) {
          answers[question.id] = answer;
        }
      });

      const result = await api.submitMCQAnswers(selectedSet.id, answers);
      
      // Update questions with results
      const updatedSet = {
        ...selectedSet,
        questions: selectedSet.questions.map((q) => {
          const resultQ = result.results.find((rq: any) => rq.id === q.id);
          return resultQ ? { ...q, user_answer: resultQ.user_answer, is_correct: resultQ.is_correct } : q;
        }),
      };
      
      setSelectedSet(updatedSet);
      setShowResults(true);

      toast({
        title: "Results",
        description: `You got ${result.score} out of ${result.total} correct! (${result.percentage}%)`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit answers",
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
              Generate MCQs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mcq-topic">Topic</Label>
              <Input
                id="mcq-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., World War II"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of Questions</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateMCQ}
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
                  Generate MCQs
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Saved Sets List */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="text-sm">Your MCQ Sets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {mcqSets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sets yet
              </p>
            ) : (
              mcqSets.map((set) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSet?.id === set.id
                      ? "bg-primary/20 border border-primary/30"
                      : "bg-background/50 hover:bg-background/70"
                  }`}
                  onClick={() => {
                    setSelectedSet(set);
                    setUserAnswers({});
                    setShowResults(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckSquare className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{set.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          {set.questions.length} questions
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSet(set.id);
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

      {/* Main Content - Questions Display */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedSet ? (
            <motion.div
              key={selectedSet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold gradient-text">
                  {selectedSet.topic}
                </h2>
                {!showResults && Object.keys(userAnswers).length === selectedSet.questions.length && (
                  <Button onClick={submitAnswers} className="bg-primary hover:bg-primary/90">
                    Submit Answers
                  </Button>
                )}
              </div>

              {selectedSet.questions.map((question, qIndex) => (
                <Card key={qIndex} className="glass-strong">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">
                        {qIndex + 1}. {question.question}
                      </h3>

                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => {
                          const isSelected = userAnswers[qIndex] === oIndex;
                          const isCorrect = question.correct_answer === oIndex;
                          const showCorrect = showResults && isCorrect;
                          const showIncorrect = showResults && isSelected && !isCorrect;

                          return (
                            <button
                              key={oIndex}
                              onClick={() => handleAnswer(qIndex, oIndex)}
                              disabled={showResults}
                              className={`w-full text-left p-4 rounded-lg transition-all ${
                                showCorrect
                                  ? "bg-green-500/20 border-2 border-green-500"
                                  : showIncorrect
                                  ? "bg-red-500/20 border-2 border-red-500"
                                  : isSelected
                                  ? "bg-primary/20 border-2 border-primary"
                                  : "bg-background/50 border-2 border-transparent hover:border-primary/30"
                              } ${showResults ? "cursor-default" : "cursor-pointer"}`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                {showIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {showResults && (
                        <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/30">
                          <p className="text-sm font-medium mb-1">Explanation:</p>
                          <p className="text-sm text-muted-foreground">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <CheckSquare className="w-16 h-16 mx-auto text-primary" />
                <div>
                  <h3 className="text-xl font-display font-bold gradient-text mb-2">
                    No MCQ Set Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Generate new questions or select from your saved sets
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
