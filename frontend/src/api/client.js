export const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`/api${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error("API Error");
    }

    return response.json();
};