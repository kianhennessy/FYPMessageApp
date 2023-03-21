import { useState } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const auth = firebase.auth();


function ResetPassword(){

    const [email, setEmail] = useState('');


    const handleResetPassword = (event) => {
        event.preventDefault();
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent successfully
            })
            .catch((error) => {
                // Handle error
            });
    };

    return (
        <form onSubmit={handleResetPassword}>
            <label>
                Email:
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <button type="submit">Reset Password</button>
        </form>
    );
}

export default ResetPassword;