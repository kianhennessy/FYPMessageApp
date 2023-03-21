import React from "react"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { AuthProvider } from "../contexts/AuthContext"

import Chats from "./Chats"
import EnrollMfa from "./EnrollMfa"
import Login from "./Login"
import VerifyMfa from "./VerifyMfa";
import Signup from "./Signup";
import LoginTest from "./Test";

function App() {

  return (
      <div style={{ fontFamily: 'Avenir' }}>
        <Router>
          <AuthProvider>
            <Switch>
                <Route path="/test" component={LoginTest}/>
                <Route path="/signup" component={Signup} />
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
