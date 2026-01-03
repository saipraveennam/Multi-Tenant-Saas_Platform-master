import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTasks, createTask } from "../api/tasks";
import api from "../api/axios"; // 🔴 NEW (for update/delete)

export default function ProjectDetails() {
  const { id } = useParams() as { id: string };

  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // 🔴 NEW
  const [priority, setPriority] = useState("normal"); // 🔴 NEW

  const loadTasks = async () => {
    const res = await getTasks(id);
    if (res.success) setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await createTask(id, { title, priority }); // 🔴 priority added
    setTitle("");
    setPriority("normal");
    loadTasks();
  };

  // 🔴 NEW: update task
  const updateTask = async (taskId: string, data: any) => {
    await api.put(`/tasks/${taskId}`, data);
    setEditingTaskId(null);
    loadTasks();
  };

  // 🔴 NEW: delete task
  const deleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${taskId}`);
    loadTasks();
  };

  // 🔴 NEW: toggle status
  const toggleStatus = async (task: any) => {
    const newStatus =
      task.status === "completed" ? "todo" : "completed";

    await api.patch(`/tasks/${task.id}/status`, {
      status: newStatus,
    });

    loadTasks();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Project Tasks
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage tasks for this project
            </p>
          </div>

          {/* Add Task Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Add New Task
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* 🔴 NEW priority */}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>

              <button
                onClick={addTask}
                className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium rounded-lg px-6 py-2"
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              No tasks added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
                >
                  {/* Title / Edit */}
                  {editingTaskId === t.id ? (
                    <input
                      defaultValue={t.title}
                      onBlur={(e) =>
                        updateTask(t.id, { title: e.target.value })
                      }
                      className="border w-full px-2 py-1 rounded"
                      autoFocus
                    />
                  ) : (
                    <h4 className="text-lg font-semibold text-gray-800">
                      {t.title}
                    </h4>
                  )}

                  {/* Status */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full
                      ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {t.status}
                  </span>

                  {/* Priority */}
                  <p className="text-sm text-gray-500 mt-2">
                    Priority: <b>{t.priority || "normal"}</b>
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 text-sm">
                    <button
                      onClick={() => setEditingTaskId(t.id)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleStatus(t)}
                      className="text-indigo-600"
                    >
                      Toggle Status
                    </button>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
