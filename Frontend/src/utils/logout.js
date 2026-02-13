export const logout = async (navigate) => {
    try {
        const token = localStorage.getItem("token");
 
        // Call backend to log the audit event
        await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
 
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Always clear storage and redirect, even if backend fails
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
    }
};
 
 