import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUsers, createUser, deleteUser } from "../api/users";

export default function Users() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔒 Access control
  if (currentUser.role !== "tenant_admin") {
    return <p className="p-6 text-red-500">Access denied</p>;
  }

  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "user",
  });

  const loadUsers = async () => {
    const res = await getUsers();
    if (res.success) setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    if (!form.email || !form.fullName || !form.password) {
      alert("All fields required");
      return;
    }

    await createUser(form);
    setForm({ email: "", fullName: "", password: "", role: "user" });
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    loadUsers();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-3xl font-bold mb-6">Users</h2>

          {/* Add User */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="font-semibold mb-4">Add User</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                className="border px-3 py-2 rounded"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <select
                className="border px-3 py-2 rounded"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="tenant_admin">Tenant Admin</option>
              </select>
            </div>

            <button
              onClick={handleCreate}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Create User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3">{u.full_name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
