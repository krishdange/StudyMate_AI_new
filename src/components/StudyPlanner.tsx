import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

export const StudyPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete Calculus Chapter 4", completed: false, priority: "High" },
    { id: "2", title: "Read Hamlet Act III", completed: true, priority: "Medium" },
    { id: "3", title: "Physics Lab Report", completed: false, priority: "High" },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      priority: "Medium"
    }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="h-full flex flex-col space-y-6 bg-[#0A0A0B] rounded-3xl p-6 overflow-hidden">
      {/* Header Stats Card */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
         className="p-6 rounded-2xl bg-gradient-to-br from-[#1A1A1D] to-black border border-white/5 relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-24 h-24 text-primary" /></div>
         
         <div className="relative z-10 flex justify-between items-end">
            <div>
               <h2 className="text-2xl font-bold text-white mb-1">Weekly Focus</h2>
               <p className="text-muted-foreground text-sm">You're making great progress!</p>
            </div>
            <div className="text-right">
               <span className="text-3xl font-bold text-primary">{Math.round(progress)}%</span>
               <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
            </div>
         </div>
         <Progress value={progress} className="h-2 mt-6 bg-white/5" />
      </motion.div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tasks ({tasks.length})</h3>
           <Dialog>
             <DialogTrigger asChild>
               <Button size="sm" variant="ghost" className="h-7 text-primary hover:text-primary hover:bg-primary/10">
                  <Plus className="w-4 h-4 mr-1" /> Add Task
               </Button>
             </DialogTrigger>
             <DialogContent className="bg-[#1A1A1D] border-white/10 text-white">
                <DialogHeader>
                   <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="flex gap-3 mt-4">
                   <Input 
                      value={newTask} 
                      onChange={(e) => setNewTask(e.target.value)} 
                      placeholder="What needs to be done?" 
                      className="bg-black/20 border-white/10"
                   />
                   <Button onClick={addTask} className="bg-primary text-primary-foreground">Add</Button>
                </div>
             </DialogContent>
           </Dialog>
        </div>

        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
              task.completed 
                ? "bg-white/[0.02] border-white/5 opacity-50" 
                : "bg-[#121214] border-white/5 hover:border-primary/30 hover:bg-[#1A1A1D] hover:shadow-lg"
            }`}
          >
            <button onClick={() => toggleTask(task.id)} className="shrink-0 transition-transform active:scale-90">
               {task.completed 
                 ? <CheckCircle2 className="w-6 h-6 text-green-500" /> 
                 : <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
               }
            </button>
            
            <div className="flex-1 min-w-0">
               <h4 className={`font-medium truncate transition-colors ${task.completed ? "line-through text-muted-foreground" : "text-gray-200 group-hover:text-white"}`}>
                 {task.title}
               </h4>
               <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    task.priority === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                    task.priority === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : 
                    "bg-green-500/10 text-green-400 border-green-500/20"
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due Soon
                  </span>
               </div>
            </div>

            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
            >
               <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}