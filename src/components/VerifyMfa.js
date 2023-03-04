import React, {useEffect} from "react"

import { useHistory } from "react-router-dom"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { auth } from "../firebase"


export default function VerifyMfa() {
    const user = auth.currentUser;
    console.log(user)

    const history = useHistory()

    async function handleLogout() {
        // sign out borken
        await auth.signOut()
        history.push("/")
    }


    const verifyMfaCode = async () => {
        const code = document.getElementById('verify-mfa-code').value;


        const cred = firebase.auth.PhoneAuthProvider.credential(
            window.verificationId,
            code
        );

        const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
            cred
        );

        const user = auth.currentUser;
        await user.multiFactor.enroll(multiFactorAssertion, 'phone number');

        alert('MFA code verified');
        history.push("/chats")
    };



    return (
        <div id='login-page'>
            <div id='login-card'>
                <h2>Verify mfa</h2>

                <div>
                    {/* add field for user phone number*/}
                    <input id='verify-mfa-code' type="text"/>
                    <button id='submit-code' onClick={verifyMfaCode}>submit mfa code</button>

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
