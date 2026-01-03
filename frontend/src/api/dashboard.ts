import api from "./axios";

export async function getDashboardStats() {
  try {
    const projectsRes = await api.get("/projects");
    const projects = projectsRes.data.data || [];

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;

    for (const project of projects) {
      const tasksRes = await api.get(`/projects/${project.id}/tasks`);
      const tasks = tasksRes.data.data || [];

      totalTasks += tasks.length;
      completedTasks += tasks.filter(
        (t: any) => t.status === "completed"
      ).length;
      pendingTasks += tasks.filter(
        (t: any) => t.status !== "completed"
      ).length;
    }

    return {
      success: true,
      data: {
        projects: projects.length,
        tasks: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
      },
    };
  } catch (error) {
    console.error("Dashboard stats error", error);
    return { success: false };
  }
}
