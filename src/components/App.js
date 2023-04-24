import React from "react"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { AuthProvider } from "../contexts/AuthContext"

import Chats from "./Chats"
import EnrollMfa from "./EnrollMfa"
import Login from "./Login"
import VerifyMfa from "./VerifyMfa";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";

import Home from "./Home";

function App() {

  return (
      <div style={{ fontFamily: 'Avenir' }}>
        <Router>
          <AuthProvider>
            <Switch>

                <Route path="/reset-password" component={ResetPassword} />
                <Route path="/signup" component={Signup} />
                <Route path="/chats" component={Chats} />
                <Route path="/mfa" component={EnrollMfa} />
                <Route path="/verify-mfa" component={VerifyMfa} />
                <Route path="/login" component={Login} />
                <Route path="/" component={Home} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
  )
}

export default App
