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
        }
    }
});

function VerifyMfa() {
    const user = auth.currentUser;
    console.log(user)
    const history = useHistory()

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }


    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const [showError, setShowError] = useState(false);

    const [showWrongCode, setShowWrongCode] = useState(false);

    const VerifyMfaCode = async (event) => {

        const code = document.getElementById('verify-mfa-code').value;

        event.preventDefault();
        setShowError(null)
        try {
            const cred = firebase.auth.PhoneAuthProvider.credential(
                window.verificationId,
                code
            );
            const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
                cred
            );
            const user = auth.currentUser;
            await user.multiFactor.enroll(multiFactorAssertion, 'phone number');
            setShowError(null);
            // MUI alert for legit mfa code
            setShowSuccessAlert(true);
            await auth.signOut()
        } catch (error) {
            console.error(error);
            if(error.code === 'auth/invalid-verification-code' || error.code === 'auth/missing-code') {
                setShowError(true);
            }
            if(error.code === "auth/invalid-verification-code") {
                setShowWrongCode(true);
            }
        }

    };

    useEffect(() => {
        if (showSuccessAlert) {
            // Hide the alert after 4 seconds and redirect to the login page
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                history.push('/login');
            }, 4000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        if(showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert, history]);



    return (

        <ThemeProvider theme={themeDark}>
            <Helmet>
                <title>Login - SecureComms</title>
                <meta name="description" content="Log in to your SecureComms account and access our secure communication platform." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charset="UTF-8" />
            </Helmet>

            <Snackbar open={showSuccessAlert}>
                <Alert onClose={() => setShowSuccessAlert(false)} severity="success" sx={{ width: '100%' }}>
                    successfully enrolled in MFA, redirecting to login page
                </Alert>
            </Snackbar>
            <Snackbar open={showError}>
                <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
                    invalid MFA code
                </Alert>
            </Snackbar>
            <Snackbar open={showWrongCode} autoHideDuration={5000} onClose={() => setShowWrongCode(false)}>
                <Alert onClose={() => setShowWrongCode(false)} severity="error" sx={{ width: '100%' }}>
                    Incorrect code, please try again
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
                        Verify 2FA Code
                    </Typography>
                    <Typography component="h1" textAlign={'center'} padding={2}>
                        Please verify the code sent to your phone
                    </Typography>

                    <Box component="form" onSubmit={VerifyMfaCode} noValidate sx={{ mt: 1 }}>

                        <TextField
                            id='verify-mfa-code'
                            type="text"
                            placeholder="2FA code"
                            fullWidth
                            required
                            margin="normal"
                        />
                        <Button id='submit-code' onClick={VerifyMfaCode} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color={"secondary"}> submit mfa code</Button>

                        <Grid container justifyContent={'center'}>
                            <Grid item>
                                <Link href="/" variant="body2" onClick={handleLogout} color={"secondary"}>
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

export default VerifyMfa;