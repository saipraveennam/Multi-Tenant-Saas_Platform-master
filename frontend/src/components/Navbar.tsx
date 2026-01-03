import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* App Name */}
        <h1 className="text-2xl font-bold tracking-wide">
          Multi-Tenant SaaS
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="hover:text-indigo-200 transition font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/projects"
            className="hover:text-indigo-200 transition font-medium"
          >
            Projects
          </Link>

          <Link
            to="/users"
            className="hover:text-indigo-200 transition font-medium"
          >
            Users
          </Link>
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-indigo-100 text-right">
            <div className="font-semibold">{user.fullName}</div>
            <div className="text-xs italic opacity-80">{user.role}</div>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}
