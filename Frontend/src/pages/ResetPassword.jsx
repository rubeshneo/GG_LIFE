import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
 
export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
 
  // Get token from navigation state
  const token = location.state?.token;
 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
 
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
 
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
 
    setLoading(true);
 
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newPassword: password, confirmPassword }),
        }
      );
 
      const data = await res.json();
 
      if (!res.ok) {
        setError(data.message || "Reset failed");
        return;
      }
 
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
 
  if (!token) return null;
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center">Reset Password</h2>
 
        {error && <p className="text-red-500 mt-3">{error}</p>}
        {message && <p className="text-green-600 mt-3">{message}</p>}
 
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 mt-4 border rounded-lg"
          />
 
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 mt-4 border rounded-lg"
          />
 
          <button
            disabled={loading}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
 
