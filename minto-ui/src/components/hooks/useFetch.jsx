import { useCallback } from "react";
import { useAuth } from "./useAuth"

const useFetch = () => {
    const { getUser, refreshJwt } = useAuth()

    // Decode JWT to check expiration (without verification)
    const isTokenExpired = (token) => {
        if (!token) return true;
    
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            // Add 30 second buffer
            return Date.now() >= (exp - 30000);
        } catch (e) {
            console.error('Error decoding token:', e);
            return true;
        }
    };

    const fetchWithAuth = useCallback(async (url, options = {}) => {
        let user = getUser()
        let accessToken = user?.accessToken
        
        if (isTokenExpired(accessToken)) {
            try {
                accessToken = await refreshJwt()
            } catch (error) {
                console.error('Failed to refresh token:', error)
                throw error
            }
        }

        const headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        }

        try {
            let response = await fetch(url, { ...options, headers })
            if(response.status === 401 ) { // Unauthorized, try refreshing token
                accessToken = await refreshJwt()
                headers.Authorization = `Bearer ${accessToken}`
                response = await fetch(url, { ...options, headers })
                return response
            } 
            return response
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }, [getUser, refreshJwt])

    return {
        fetchWithAuth
    }
}

export default useFetch
