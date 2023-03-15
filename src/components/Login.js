import React, { useEffect, useState } from "react";

import { GoogleOutlined } from "@ant-design/icons";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { auth } from "../firebase";
import { useHistory } from "react-router-dom"

import { useForm } from 'react-hook-form';

export default function Login() {
    const [verificationId, setVerificationId] = useState(null);
    const [code, setCode] = useState("");
    const history = useHistory();

    // login form
    const { register, handleSubmit } = useForm();
    async function handleLogout() {
        // sign out borken
        await auth.signOut()
        history.push("/")
    }

    async function goToSignup() {
        history.push("/signup")
    }



    const onSubmit = async (data) => {
        const { email, password } = data;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            // User successfully logged in
        } catch (error) {
            // Handle login error
        }
    };

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


    const loginWithEmailandPassword = async () => {

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
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
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label>
                                Email:
                                <input id={'login-email'} {...register('email', { required: true })} />
                            </label>
                            <label>
                                Password:
                                <input id={'login-password'}{...register('password', { required: true })} />
                            </label>
                            <div onClick={loginWithEmailandPassword}>
                            <button type="submit">Log in</button>
                            </div>
                        </form>

                    </div>
                    <br/>
                    <br/>
                    <br/>


                    <label htmlFor="verification-code-input">Verification Code:</label>
                    <input type="text" id="verification-code-input" value={code} onChange={handleCodeChange}/>
                    <button onClick={handleVerifyCode}>Verify Code</button>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={goToSignup}>Signup</button>


                </div>
            </div>
        </div>
    );
}