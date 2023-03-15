import React, {useEffect} from "react"

import { useHistory } from "react-router-dom"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { auth } from "../firebase"



export default function EnrollMfa() {
    const user = auth.currentUser;
    console.log(user)

    const history = useHistory()

    async function handleLogout() {
        // sign out broken
        const x = await auth.signOut()
        console.log(x, 'logged out')
        console.log(auth.currentUser, 'current user')
        history.push("/")
    }

    useEffect(() => {
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'enroll-button', {
            size: 'invisible',
            callback: function (response) {
                console.log('captcha solved!');
            },
        });
    }, [])


    const enroll = async () => {
        const phoneNumber = document.getElementById('enroll-phone').value;

        const user = auth.currentUser;

        console.log(user)
        console.log(user.multiFactor)
        const session = await user.multiFactor.getSession();

        const phoneOpts = {
            phoneNumber,
            session,
        };

        const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

        window.verificationId = await phoneAuthProvider.verifyPhoneNumber(
            phoneOpts,
            window.recaptchaVerifier
        );

        alert('sms text sent!');
        history.push("/verify-mfa")
    };
    return (
        <div id='login-page'>
            <div id='login-card'>
                <h2>MFA</h2>

                <div>
                    <p>Please verify your email address before enrolling in additional factors</p>
                {/* add field for user phone number*/}
                    <input id='enroll-phone' type="text"/>
                    <button id='enroll-button' onClick={enroll}>Send Code</button>

                {/* button to enroll in mfa*/}

                    <div onClick={handleLogout}>
                        Logout
                    </div>
                </div>

                <br/><br/>


            </div>
        </div>
    )

}
