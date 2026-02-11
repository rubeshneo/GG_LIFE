import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute expiry
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
 
    useEffect(() => {
        let timer;
        if (step === 2 && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);
 
    // Timer for "Resend OTP" visibility (30s)
    useEffect(() => {
        if (step === 2) {
            const resendTimer = setTimeout(() => {
                setCanResend(true);
            }, 30000);
            return () => clearTimeout(resendTimer);
        }
    }, [step]);
 
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
 
        try {
            const res = await fetch("http://localhost:5000/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
 
            const data = await res.json();
 
            if (!res.ok) {
                setError(data.message || "Something went wrong");
                return;
            }
 
            setMessage("Verification code sent to your email.");
            setStep(2);
            setTimeLeft(60);
            setCanResend(false);
        } catch {
            setError("Unable to send verification code");
        } finally {
            setLoading(false);
        }
    };
 
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
 
        try {
            const res = await fetch("http://localhost:5000/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp }),
            });
 
            const data = await res.json();
 
            if (!res.ok) {
                setError(data.message || "Verification failed");
                return;
            }
 
            // Navigate to ResetPassword with token
            navigate("/reset-password", { state: { token: data.data.token } });
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
 
    const handleResendCode = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/resend-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
 
            if (!res.ok) {
                setError(data.message || "Failed to resend code");
                return;
            }
 
            setMessage("Verification code resent.");
            setTimeLeft(60);
            setCanResend(false);
        } catch {
            setError("Unable to resend code");
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold text-center">
                    {step === 1 ? "Forgot Password" : "Enter OTP"}
                </h2>
 
                {error && <p className="text-red-500 mt-3">{error}</p>}
                {message && <p className="text-green-600 mt-3">{message}</p>}
 
                {step === 1 ? (
                    <form onSubmit={handleSendCode}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 mt-4 border rounded-lg"
                        />
                        <button
                            disabled={loading}
                            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode}>
                        <div className="mt-4 text-center">
                            <p className="text-gray-600 mb-2">Code expires in: {timeLeft}s</p>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full px-4 py-3 border rounded-lg"
                        />
                        <button
                            disabled={loading}
                            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
 
                        {canResend && (
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="w-full mt-2 text-green-600 font-semibold hover:underline"
                            >
                                Resend OTP
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
 
