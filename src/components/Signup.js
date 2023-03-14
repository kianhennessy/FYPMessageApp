import { useState } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { auth } from "../firebase";



function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential)=>{
                // send verification mail.
                userCredential.user.sendEmailVerification();
                alert("Email sent");
            })
            console.log('User created!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Sign up</button>
        </form>
    );
}

export default SignUp;