import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completed: 0,
    pending: 0
  });

  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [taskFilter, setTaskFilter] = useState('all');

  useEffect(() => {
    setStats({
      projects: 3,
      tasks: 12,
      completed: 7,
      pending: 5
    });

    loadRecentProjects();
    loadMyTasks();
  }, []);

  const loadRecentProjects = async () => {
    try {
      const res = await api.get('/projects');
      setRecentProjects(res.data?.data?.slice(0, 5) || []);
    } catch {
      setRecentProjects([]);
    }
  };

  const loadMyTasks = async () => {
    try {
      const me = await api.get('/auth/me');
      const userId = me.data.data.id;

      const projectsRes = await api.get('/projects');
      const projects = projectsRes.data.data || [];

      const tasks: any[] = [];

      for (const project of projects) {
        const taskRes = await api.get(`/projects/${project.id}/tasks`);
        const projectTasks = taskRes.data.data || [];

        projectTasks.forEach((task: any) => {
          // If assignedTo exists, filter; otherwise include all
          if (!task.assignedTo || task.assignedTo === userId) {
            tasks.push({
              ...task,
              projectName: project.name
            });
          }
        });
      }

      setMyTasks(tasks);
    } catch {
      setMyTasks([]);
    }
  };

  const filteredTasks =
    taskFilter === 'all'
      ? myTasks
      : myTasks.filter((t) => t.status === taskFilter);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Dashboard
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Projects" value={stats.projects} color="indigo" />
            <StatCard title="Total Tasks" value={stats.tasks} color="blue" />
            <StatCard title="Completed Tasks" value={stats.completed} color="green" />
            <StatCard title="Pending Tasks" value={stats.pending} color="yellow" />
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>

            {recentProjects.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent projects.</p>
            ) : (
              <ul className="divide-y">
                {recentProjects.map((p) => (
                  <li
                    key={p.id}
                    className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => navigate(`/projects/${p.id}`)}
                  >
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      Status: {p.status || 'active'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* My Tasks */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">My Tasks</h3>

              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {filteredTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No tasks found.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Project: {task.projectName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Priority: {task.priority || 'Normal'} | Due: {task.dueDate || '—'}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-200">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  color
}: {
  title: string;
  value: number;
  color: 'indigo' | 'blue' | 'green' | 'yellow';
}) {
  const colors: any = {
    indigo: 'bg-indigo-100 text-indigo-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${colors[color]}`}>
        {title}
      </div>
      <p className="text-4xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
