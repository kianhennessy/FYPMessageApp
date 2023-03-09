import React from "react"

import { GoogleOutlined} from '@ant-design/icons'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { auth } from "../firebase"

export default function Login() {

    const loginWithGoogle = async () => {
        try {
            await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        } catch (error) {
            if (error.code === 'auth/multi-factor-auth-required') {
                window.resolver = error.resolver;
            }
        }



    }

        return (
            <div id='login-page'>
                <div id='login-card'>
                    <h2>Login</h2>

                    <div
                        className='login-button google'
                        onClick={loginWithGoogle}

                    >
                        <GoogleOutlined/> Sign In with Google
                    </div>

                    <br/><br/>


                </div>
            </div>
        )
    }

