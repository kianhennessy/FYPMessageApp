import React, { useContext, useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { auth } from "../firebase"


// Create a new context for managing authentication
const AuthContext = React.createContext()

// Custom hook to access the authentication context
export function useAuth() { return useContext(AuthContext) }

// Authentication provider component for managing user state and navigation
export function AuthProvider({ children }) {

    // State variables to manage user authentication state and loading state
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()
    const history = useHistory()

    // Effect hook to manage Firebase authentication state changes
    useEffect(() => {

        // Subscribe to authentication state changes
        auth.onAuthStateChanged(user => {
            if (user) {

                // If the user is not enrolled in MFA, redirect them to the MFA enrollment page
                if (user.multiFactor.enrolledFactors.length < 1 ) {

                    // Redirect to MFA enrollment page
                    history.push("/mfa")
                    return
                }

                // Set the user state and loading state
                setUser(user)
                setLoading(false)

                // Redirect to the chats page if user is logged in
                history.push("/chats")
            }
            else {
                console.log('user is logged out')

                // Reset the user state and loading state
                setUser()
                setLoading(false)
            }

        })
    }, [user, history])

    // Prepare the value to be passed to the AuthContext.Provider
    const value = { user }

    // Wrap children components with the AuthContext.Provider and pass the value
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
