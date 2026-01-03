const API_URL = 'http://localhost:5000/api';

function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };
}

export async function getTasks(projectId: string) {
  const res = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    headers: authHeader()
  });
  return res.json();
}

export async function createTask(projectId: string, data: any) {
  const res = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(data)
  });
  return res.json();
}
