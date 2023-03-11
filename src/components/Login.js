import React, {useEffect} from "react"

import { GoogleOutlined} from '@ant-design/icons'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { auth } from "../firebase"

export default function Login() {

    useEffect(() => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'login-button', {
                size: 'invisible',
                callback: function (response) {
                    console.log('captcha solved!');
                },
            });
    }, [])

    const loginWithGoogle = async () => {
        try {
            await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        } catch (error) {
            if (error.code === 'auth/multi-factor-auth-required') {
                window.resolver = error.resolver;
            }
        }

        const phoneOpts = {
            multiFactorHint: window.resolver.hints[0],
            session: window.resolver.session,
        };

        const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();


        window.verificationId = await phoneAuthProvider.verifyPhoneNumber(
            phoneOpts,
            window.recaptchaVerifier
        );

        alert('sms text sent!');
    }

        return (
            <div id='login-page'>
                <div id='login-card'>
                    <h2>Login</h2>

                    <div
                        className='login-button google'
                        onClick={loginWithGoogle}


                    >
                        <div id='login-button'/>

                        <GoogleOutlined /> Sign In with Google
                    </div>

                    <br/><br/>


                </div>
            </div>
        )
    }

