import React, {useEffect, useState} from "react"

import { useHistory } from "react-router-dom"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { auth } from "../firebase"


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Alert } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import logo from "../images/securecomms128.png";
import Image from "mui-image";
import {Helmet} from "react-helmet";


const themeDark = createTheme({
    palette: {
        background: {
            default: "#222222"
        },
        text: {
            primary: "#27CC58"
        },
        secondary: {
            main: "#27CC58"
        },
        helperText: {
            main: "#27CC58"
        }
    }
});

export default function EnrollMfa() {
    const user = auth.currentUser;
    console.log(user)

    const history = useHistory()

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    // MUI alert
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showLoginError, setShowLoginError] = useState(false);
    const [showPhoneError, setShowPhoneError] = useState(false);
    const [showCaptchError, setShowCaptchError] = useState(false);


    useEffect(() => {
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'enroll-button', {
            size: 'invisible',
            callback: function (response) {
                console.log('captcha solved!');
            },
        });

        if (showSuccessAlert) {
            // Hide the alert after 3 seconds and redirect to the login page
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                history.push("/verify-mfa");
            }, 2000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        if(showError){
            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        if(showInfoAlert){
            const timer = setTimeout(() => {
                setShowInfoAlert(false);
            }, 9000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        if(showLoginError){
            const timer = setTimeout(() => {
                setShowLoginError(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        if(showPhoneError){
            const timer = setTimeout(() => {
                setShowPhoneError(false);

            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }


    }, [showSuccessAlert, history, showError, showInfoAlert, showLoginError, showPhoneError])


    const showAlert = () => {
        setShowInfoAlert(true);
    }

    window.onload = function () {
        if(!localStorage.getItem('firstLoad')){
            localStorage.setItem('firstLoad', 'true');
            showAlert(true);
        }
    }


    const Enroll = async (event) => {

        const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;


        if(!phoneNumberRegex.test(document.getElementById('enroll-phone').value)){
            setShowPhoneError(true);
            //hide the show error alert
            setShowError(false);
        }


        const phoneNumber = document.getElementById('enroll-phone').value;


        event.preventDefault();


        try {
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
            setShowSuccessAlert(true);


        } catch (error) {
            console.log(error)
            if(error.code === 'auth/unverified-email'){
                setShowError(true);
            }
            if(error.code === 'auth/requires-recent-login'){
                setShowLoginError(true)
            }
            if(error.message === 'reCAPTCHA has already been rendered in this element'){
                setTimeout(() => {
                    setShowPhoneError(false);
                    window.location.reload();
                }, 4000);

                setShowError(false);
                setShowPhoneError(false);
                setShowCaptchError(true);
            }

            if(document.getElementById('enroll-phone').value === '' && error.code === 'auth/unverified-email'){

                setShowPhoneError(true);
                //hide the show error alert
                setShowError(false);
            }

            if(error.code === 'auth/invalid-phone-number'){
                setShowPhoneError(true);
                setShowError(false);
            }

        }
    };


    return (

        <ThemeProvider theme={themeDark}>
            <Helmet>
                <title>Login - SecureComms</title>
                <meta name="description" content="Log in to your SecureComms account and access our secure communication platform." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charset="UTF-8" />
            </Helmet>

            <Snackbar open={showSuccessAlert}>
                <Alert onClose={() => setShowSuccessAlert(false)} severity="info" sx={{ width: '100%' }}>
                    sms text sent!
                </Alert>
            </Snackbar>
            <Snackbar open={showError}>
                <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
                    Please Verify Email, refresh page and try again
                </Alert>
            </Snackbar>
            <Snackbar open={showInfoAlert}>
                <Alert onClose={() => setShowInfoAlert(false)} severity="info" sx={{ width: '100%' }}>
                    A verification email has been sent to your email address, please verify your email address before enrolling in additional factors
                </Alert>
            </Snackbar>
            <Snackbar open={showLoginError}>
                <Alert onClose={() => setShowLoginError(false)} severity="error" sx={{ width: '100%' }}>
                    Please login again
                </Alert>
            </Snackbar>
            <Snackbar open={showPhoneError}>
                <Alert onClose={() => setShowPhoneError(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid phone number with country code
                </Alert>
            </Snackbar>
            <Snackbar open={showCaptchError}>
                <Alert onClose={() => setShowCaptchError(false)} severity="error" sx={{ width: '100%' }}>
                    Page reloading due to reCAPTCHA error, please try again
                </Alert>
            </Snackbar>

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
                    <Image
                        src = {logo}

                        sx={{
                            maxHeight: 40,
                            maxWidth: 40,
                        }}

                    />
                    <Typography component="h1" variant="h5">
                        2FA Enrollment
                    </Typography>
                    <Typography component="h1" textAlign={'center'} padding={2}>
                        A verification email has been sent to you email. Please verify your email address before enrolling in additional factors
                    </Typography>
                    <Typography component="h3" textAlign={'center'} padding={2}>
                        Note: This step will not work if do not verify your email address
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>

                        <TextField
                            id='enroll-phone'
                            placeholder="Phone Number"
                            type="text"
                            helperText="Please include country code"
                            required
                            fullWidth
                            margin={"normal"}
                        />
                        <div id='enroll-button'></div>
                        <Button id='enroll-button' fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={Enroll} color={'secondary'}>Send Code</Button>

                        <Grid container justifyContent={'center'}>
                            <Grid item>
                                <Link href="/" variant="body2" onClick={handleLogout} color={'secondary'}>
                                    {"Home"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>

    )
}
