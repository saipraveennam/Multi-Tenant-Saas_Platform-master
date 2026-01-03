import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  project?: any;
}

export default function ProjectModal({
  open,
  onClose,
  onSave,
  project,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setStatus(project.status || "active");
    } else {
      setName("");
      setDescription("");
      setStatus("active");
    }
  }, [project]);

  if (!open) return null;

  const submit = () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    onSave({ name, description, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          {project ? "Edit Project" : "Create Project"}
        </h3>

        <div className="space-y-4">
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="w-full border px-4 py-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full border px-4 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
