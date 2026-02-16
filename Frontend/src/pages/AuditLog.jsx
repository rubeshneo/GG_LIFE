import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
export default function AuditLog() {
  const navigate = useNavigate();
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
 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
 
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/audit-log/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
 
      if (res.ok) {
        setLogs(logs.filter((log) => log._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete log");
      }
    } catch {
      alert("Something went wrong");
    }
  };
 
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL logs? This cannot be undone.")) return;
 
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/audit-log-delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (res.ok) {
        setLogs([]);
        alert("All logs deleted successfully");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete all logs");
      }
    } catch {
      alert("Something went wrong");
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-6">
 
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition"
            >
              &larr; Back
            </button>
            <h2 className="text-2xl font-bold">Audit Log</h2>
          </div>
          {logs.length > 0 && (
            <div className="flex">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md mr-2"
              >
                Refresh
              </button>
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
              >
                Delete All Logs
              </button>
            </div>
          )}
        </div>
 
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border bg-green-50 text-green-600 px-6 py-2 rounded-lg font-semibold whitespace-nowrap">
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">User / Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">IP / Location</th>
                <th className="p-3 text-left">Device / OS</th>
                <th className="p-3 text-left">User Agent</th>
                <th className="p-3 text-left">Details</th>
                <th className="p-3 text-left">Account State</th>
                <th className="p-3 text-left">Controls</th>
              </tr>
            </thead>
 
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm whitespace-nowrap">
                    {new Date(log.timestamp || log.loginTime).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-medium">{log.action || "LOGIN"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${log.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    <div className="font-medium">{log.userName || log.userId?.firstname || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{log.email}</div>
                  </td>
                  <td className="p-3 text-sm">{log.userRole || "unknown"}</td>
                  <td className="p-3 text-sm">
                    <div>{log.ipAddress}</div>
                    <div className="text-xs text-gray-500">
                      {log.location && log.location !== "Unknown" ? log.location : ""}
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <div>{log.os} / {log.browser}</div>
                    <div className="text-xs text-gray-500">{log.deviceType}</div>
                  </td>
                  <td className="p-3 text-xs max-w-xs truncate" title={log.userAgent}>
                    {log.userAgent}
                  </td>
                  <td className="p-3 text-sm text-gray-600 max-w-xs truncate" title={log.details}>
                    {log.details || "-"}
                  </td>
                  <td className="p-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs">Attempts: {log.wrongAttempts ?? 0}</span>
                      <span className={`text-xs ${log.isLocked ? "text-red-600 font-bold" : "text-gray-500"}`}>
                        {log.isLocked ? "LOCKED" : "Unlocked"}
                      </span>
                      <span className={`text-xs ${log.isActive ? "text-green-600" : "text-red-600"}`}>
                        {log.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(log._id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
 
        {logs.length === 0 && (
          <p className="text-gray-500 mt-4">
            No login activity found.
          </p>
        )}
      </div>
    </div>
  );
}