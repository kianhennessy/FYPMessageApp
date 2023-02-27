import React from "react"

// import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { auth } from "../firebase"


export default function Mfa() {
    const user = auth.currentUser;
    console.log(user)

    return (
        <div id='login-page'>
            <div id='login-card'>
                <h2>MFA</h2>

                <div



                <br/><br/>


            </div>
        </div>
    )

}
