import React, { useContext, useState, useEffect } from "react"

import { useHistory } from "react-router-dom"

import { auth } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()
    const history = useHistory()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log(user, 'user is logged in')
                setUser(user)
                setLoading(false)
                history.push("/chats")
            }
            else {
                console.log('user is logged out')
                setUser()
                setLoading(false)
            }

        })
    }, [user, history])

    const value = { user }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
