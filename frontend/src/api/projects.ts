const API_URL = 'http://localhost:5000/api/projects';

function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };
}

export async function getProjects() {
  const res = await fetch(API_URL, {
    headers: authHeader()
  });
  return res.json();
}

export async function createProject(data: {
  name: string;
  description: string;
}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return res.json();
}
