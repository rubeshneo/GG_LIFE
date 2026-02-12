import { useEffect, useState } from "react";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/admin/audit-log",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch logs");
          return;
        }

        setLogs(data.data);
      } catch {
        setError("Something went wrong");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Audit Log</h2>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <table className="w-full border-collapse">
          <thead>
            <tr className="border bg-green-50 text-green-600 px-6 py-2 rounded-lg font-semibold">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Login Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b">
                <td className="p-3">{log.firstname}</td>
                <td className="p-3">{log.email}</td>
                <td className="p-3">
                  {new Date(log.loginTime).toLocaleString()}
                </td>
                <td className="p-3">
                  <span
                    className={
                      log.status === "SUCCESS"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {log.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <p className="text-gray-500 mt-4">
            No login activity found.
          </p>
        )}
      </div>
    </div>
  );
}
