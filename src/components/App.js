import React from "react"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { AuthProvider } from "../contexts/AuthContext"

import Chats from "./Chats"
import EnrollMfa from "./EnrollMfa"
import Login from "./Login"
import VerifyMfa from "./VerifyMfa";

function App() {

  return (
      <div style={{ fontFamily: 'Avenir' }}>
        <Router>
          <AuthProvider>
            <Switch>

              <Route path="/chats" component={Chats} />
                <Route path="/mfa" component={EnrollMfa} />
                <Route path="/verify-mfa" component={VerifyMfa} />
              <Route path="/" component={Login} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
  )
}

export default App
