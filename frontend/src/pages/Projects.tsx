import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProjectModal from "../components/ProjectModal";

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    const projectList = res.data.data || res.data || [];
    setProjects(projectList);

    const counts: any = {};

    for (const project of projectList) {
      const tasksRes = await api.get(`/projects/${project.id}/tasks`);
      const tasks = tasksRes.data.data || tasksRes.data || [];
      counts[project.id] = tasks.length;
    }

    setTaskCounts(counts);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  // ✅ ONLY THIS FUNCTION IS UPDATED
  const saveProject = async (data: any) => {
    // 🔹 Frontend validation (same as your 5173 run)
    if (!data.name || data.name.trim() === "") {
      alert("Project name is required");
      return;
    }

    if (editingProject) {
      // EDIT
      await api.put(`/projects/${editingProject.id}`, data);
      alert("Project updated successfully");
    } else {
      // CREATE
      await api.post("/projects", data);
      alert("Project created successfully");
    }

    setModalOpen(false);
    setEditingProject(null);
    fetchProjects(); // ✅ refresh list immediately
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (p.status || "active") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Projects
            </h2>

            <button
              onClick={() => {
                setEditingProject(null);
                setModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 font-medium"
            >
              + Create Project
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              placeholder="Search projects..."
              className="border px-4 py-2 rounded-lg w-full sm:w-1/2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border px-4 py-2 rounded-lg w-full sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center text-gray-500 mt-16">
              No projects found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{p.name}</h4>
                    <p className="text-sm text-gray-600">
                      {p.description || "No description provided"}
                    </p>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="text-sm px-3 py-1 bg-gray-100 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setEditingProject(p);
                        setModalOpen(true);
                      }}
                      className="text-sm px-3 py-1 bg-yellow-100 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProject(p.id)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <ProjectModal
            open={modalOpen}
            initialData={editingProject}
            onClose={() => {
              setModalOpen(false);
              setEditingProject(null);
            }}
            onSave={saveProject}
          />

        </div>
      </div>
    </>
  );
}
