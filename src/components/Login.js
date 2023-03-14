import React, { useEffect, useState } from "react";

import { GoogleOutlined } from "@ant-design/icons";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { auth } from "../firebase";
import {useHistory} from "react-router-dom";


export default function Login() {
    const [verificationId, setVerificationId] = useState(null);
    const [code, setCode] = useState("");
    const history = useHistory()

    useEffect(() => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("login-button", {
            size: "invisible",
            callback: function (response) {
                console.log("captcha solved!");
            },
        });
    }, []);

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    const loginWithGoogle = async () => {
        try {
            await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        } catch (error) {
            if (error.code === "auth/multi-factor-auth-required") {
                window.resolver = error.resolver;
            }
        }

        const phoneOpts = {
            multiFactorHint: window.resolver.hints[0],
            session: window.resolver.session,
        };

        const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

        setVerificationId(
            await phoneAuthProvider.verifyPhoneNumber(phoneOpts, window.recaptchaVerifier)
        );
        alert("sms text sent!");
    };

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const handleVerifyCode = async () => {

        const cred = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );

        const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
            cred
        );

        const credential = await window.resolver.resolveSignIn(multiFactorAssertion);

        console.log(credential);

        alert("logged in!");
    };

    return (
        <div id="login-page">
            <div id="login-card">
                <h2>Login</h2>

                <div className="login-button google" onClick={loginWithGoogle}>
                    <div id="login-button"/>

                    <GoogleOutlined/> Sign In with Google
                </div>

                <br/>
                <br/>

                <div>
                    <label htmlFor="verification-code-input">Verification Code:</label>
                    <input type="text" id="verification-code-input" value={code} onChange={handleCodeChange}/>
                    <button onClick={handleVerifyCode}>Verify Code</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>

            </div>
        </div>
    );
}