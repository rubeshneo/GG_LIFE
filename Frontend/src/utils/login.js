export const logout = (navigate) => {
    localStorage.clear();
    sessionStorage.clear();

    navigate("/login", { replace: true });
};
