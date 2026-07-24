import { API_BASE } from "../config.js";

export async function checkSession() {
    try {
        const refresh = await fetch(`
            ${API_BASE}/auth/token`, {
                method: 'POST',
                credentials: "include"
            });

            if(!refresh.ok) {
                console.log("Session restored")
                window.location.replace("/index.html");

                return true;
            };

            return false

            
    } catch (error) {
            console.error(
            "Session check failed",
            error
        );

        return false;
    }

}