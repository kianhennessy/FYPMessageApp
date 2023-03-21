import React, {useEffect, useState } from "react";

import { GoogleOutlined } from "@ant-design/icons";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { auth } from "../firebase";
import { useHistory } from "react-router-dom"

import { useForm } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {createTheme, ThemeProvider} from "@mui/material/styles";

const themeDark = createTheme({
    palette: {
        background: {
            default: "#222222"
        },
        text: {
            primary: "#ffffff"
        }
    }
});


export default function Login() {
    const [verificationId, setVerificationId] = useState(null);
    const [code, setCode] = useState("");
    const [alert, setAlert] = useState(null);
    const history = useHistory();

    // login form
    const { register, handleSubmit } = useForm();

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    async function goToSignup() {
        history.push("/signup")
    }

    function BasicAlerts({alertInfo}) {
        console.log(alertInfo);
        return (
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity={alertInfo.severity}>{alertInfo.message}</Alert>
            </Stack>
        );
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
        // alert("sms text sent!");
        setAlert({severity:"info", message: "SMS Sent Successfully"});

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

        setAlert({severity:"success", message: "logged in successfully"});
    };

    return (
        // <div id="login-page">
        //     {alert && <BasicAlerts alertInfo={alert} />}
        //     <div id="login-card">
        //         <h2>Login</h2>
        //
        //         <div className="login-button google" onClick={loginWithGoogle}>
        //             <div id="login-button"/>
        //
        //             <GoogleOutlined/> Sign In with Google
        //         </div>
        //
        //         <br/>
        //         <br/>
        //
        //         <div>
        //             <div>
        //                 <form onSubmit={handleSubmit(onSubmit)}>
        //                     <label>
        //                         Email:
        //                         <input id={'login-email'} {...register('email', { required: true })} />
        //                     </label>
        //                     <br/>
        //                     <label>
        //                         Password:
        //                         <input id={'login-password'}{...register('password', { required: true })} />
        //                     </label>
        //                     <div onClick={loginWithEmailandPassword}>
        //                         <button type="submit">Log in</button>
        //                     </div>
        //                 </form>
        //
        //             </div>
        //             <br/>
        //             <br/>
        //             <br/>
        //
        //
        //             <label htmlFor="verification-code-input">Verification Code:</label>
        //             <input type="text" id="verification-code-input" value={code} onChange={handleCodeChange}/>
        //             <button onClick={handleVerifyCode}>Verify Code</button>
        //             <button onClick={handleLogout}>Logout</button>
        //             <button onClick={goToSignup}>Signup</button>
        //
        //
        //         </div>
        //     </div>
        // </div>

        <ThemeProvider theme={themeDark}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>

                        <TextField
                            placeholder="Email"
                            required
                            fullWidth
                            margin={"normal"}
                            id={'login-email'}{...register('email', { required: true })}
                        />
                        <TextField
                            type="password"
                            placeholder="Password"
                            required
                            fullWidth
                            margin={"normal"}
                            id={'login-password'}{...register('password', { required: true })}
                        />


                        <div onClick={loginWithEmailandPassword}>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={loginWithEmailandPassword}>Log in</Button>
                        </div>

                        <Typography>
                            OR
                        </Typography>
                        <div className="login-button google" onClick={loginWithGoogle}>
                            <div id="login-button"/>

                            <GoogleOutlined/> Sign In with Google
                        </div>

                        {/*<label htmlFor="verification-code-input">Verification Code:</label>*/}
                        <TextField
                            placeholder="Verify code"
                            required
                            fullWidth
                            type="text"
                            id="verification-code-input"
                            value={code}
                            onChange={handleCodeChange}
                            margin={"dense"}
                            padding={"dense"}
                        />

                        <Button onClick={handleVerifyCode} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Verify Code</Button>
                        <Grid container>

                            <Grid item xs>
                                <Link href="/signup" variant="body2" >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" >
                                    {"Forgot password?"}
                                </Link>
                            </Grid>
                        </Grid>


                    </Box>
                </Box>




            </Container>
        </ThemeProvider>
    );
}