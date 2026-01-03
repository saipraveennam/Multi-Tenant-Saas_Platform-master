import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  initialData?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function TaskModal({
  open,
  initialData,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("normal");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setStatus(initialData.status);
      setPriority(initialData.priority || "normal");
    } else {
      setTitle("");
      setStatus("todo");
      setPriority("normal");
    }
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Task" : "Create Task"}
        </h3>

        <div className="space-y-4">
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="w-full border px-4 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="w-full border px-4 py-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={() => onSave({ title, status, priority })}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
