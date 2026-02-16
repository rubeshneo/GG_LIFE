import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
        } else {
            const parsedUser = JSON.parse(userData);

            // if (parsedUser.role !== "admin") {
            //   navigate("/dashboard");
            // return;
            //}

            setUser(parsedUser);

        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome to GG Life, {user.firstname}!
                </h1>

                <p className="text-gray-600 mt-2">
                    You have successfully logged in as <span className="font-semibold">{user.email}</span>.
                </p>

                <div className="mt-6 bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold">
                        Admin Dashboard
                    </h2>

                    <p className="text-gray-500 mt-2">
                        This is the GG Life Admin dashboard area.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={() => navigate("/audit-log")}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Audit Log
                        </button>

                        <button
                            onClick={() => navigate("/active-users")}
                            className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
                        >
                            Users Logged In
                        </button>

                        <button
                            onClick={() => navigate("/chat")}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                            Inbox
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}
