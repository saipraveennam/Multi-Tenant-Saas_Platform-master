import { Navigate } from 'react-router-dom';

function isTokenValid(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    // token expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  // check both storages (remember me support)
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (!token || !isTokenValid(token)) {
    // auto logout
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
}
