import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ActiveUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/admin/active-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch users");
          return;
        }

        setUsers(data.data);
      } catch {
        setError("Something went wrong");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6">

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition"
          >
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold">Currently Logged In Users</h2>
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user._id}
              className="p-4 border rounded-lg flex justify-between"
            >
              <div>
                <p className="font-semibold">{user.firstname}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              <span className="text-green-600 font-semibold">
                Active
              </span>
            </li>
          ))}
        </ul>

        {users.length === 0 && (
          <p className="text-gray-500 mt-4">
            No active users.
          </p>
        )}
      </div>
    </div>
  );
}
