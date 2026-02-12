import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [isLocked, setIsLocked] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);


    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        if (data.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
      else {
        setError(data.message || "Login failed");
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">
          Login to GG Life
        </h1>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {attemptsLeft !== null && !isLocked && (
          <p className="mt-2 text-sm text-red-500 text-center">
            Attempts left: {attemptsLeft}
          </p>
        )}


        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          />
          {!isLocked && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-green-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            disabled={loading || isLocked}
            className={`w-full py-3 rounded-lg font-semibold transition
    ${isLocked
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
              }
    ${loading ? "opacity-70 cursor-not-allowed" : ""}
  `}
          >
            {isLocked ? "Account Locked" : loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {isLocked && (
          <div className="mt-4 text-center">
            <p className="text-red-600 text-sm">
              Your account is locked.
            </p>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="mt-2 text-green-600 underline text-sm"
            >
              Reset Password
            </button>
          </div>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Not registered?
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-2 w-full border border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

