import { TaskResponse } from "../types/task";
import TaskCreateForm from "./TaskCreateForm";
import TaskEditForm from "./TaskEditForm";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {formType === 'create' ? 'Crie uma Tarefa' : 'Edite a Tarefa'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-3xl leading-none">
            &times;
          </button>
        </div>

        {
          formType === 'create'
            ? <TaskCreateForm onClose={onClose} />
            : <TaskEditForm onClose={onClose} task={task} />
        }
      </div>
    </div>
  )
}