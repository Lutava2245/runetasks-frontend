import { X } from "lucide-react";
import { TaskResponse } from "../types/task";
import TaskCreateForm from "./TaskCreateForm";
import TaskEditForm from "./TaskEditForm";
import Button from "./ui/Button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: string;
  task: TaskResponse | null;
}

export default function TaskModal({ isOpen, onClose, formType, task }: TaskModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-(--card) p-8 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {formType === 'create' ? 'Crie uma Tarefa' : 'Edite a Tarefa'}
          </h2>
          <Button
            variant='ghost'
            onClick={onClose}
            className="leading-none"
          >
            <X/>
          </Button>
        </div>

        {
          formType === 'create'
            ? <TaskCreateForm onClose={onClose} />
            : task && <TaskEditForm onClose={onClose} task={task} />
        }
      </div>
    </div>
  )
}