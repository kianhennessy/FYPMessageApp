import React, {useEffect, useState} from "react"
import { useHistory } from "react-router-dom"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth } from "../firebase"
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";
import logo from "../images/securecomms128.png";
import Image from "mui-image";
import {Helmet} from "react-helmet";

// Material UI theme
const themeDark = createTheme({
    // Define the palette colors for the theme
    palette: {
        // Background colour
        background: {
            default: "#222222"
        },
        // Text colour
        text: {
            primary: "#27CC58"
        },
        // Secondary colour
        secondary: {
            main: "#27CC58"
        }
    }
});


function VerifyMfa() {

    // User object for current user
    const user = auth.currentUser;

    // History object for redirecting
    const history = useHistory()


    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    // MUI snackbar alerts
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showWrongCode, setShowWrongCode] = useState(false);

    // Verify MFA code
    const VerifyMfaCode = async (event) => {

        // Get the MFA code from the input field
        const code = document.getElementById('verify-mfa-code').value;

        // Prevent default form submission
        event.preventDefault();

        // Reset error state
        setShowError(null)

        // Try to verify the MFA code
        try {
            // Create a PhoneAuthProvider credential with the verificationId and entered code
            const cred = firebase.auth.PhoneAuthProvider.credential(
                window.verificationId,
                code
            );

            // Generate a multi-factor assertion with the created credential
            const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
                cred
            );

            // Get the current user
            const user = auth.currentUser;

            // Enroll the user with the multi-factor assertion
            await user.multiFactor.enroll(multiFactorAssertion, 'phone number');

            // Reset error state
            setShowError(null);

            // MUI alert for legit mfa code
            setShowSuccessAlert(true);

            // Sign out the user
            await auth.signOut()


        } catch (error) {
            console.error(error);

            // if error code is invalid-verification-code or missing-code, show error
            if(error.code === 'auth/invalid-verification-code' || error.code === 'auth/missing-code') {
                setShowError(true);
            }
            if(error.code === "auth/invalid-verification-code") {
                setShowWrongCode(true);
            }
        }

    };

    useEffect(() => {

        // show success alert for 4 seconds and redirect to login page
        if (showSuccessAlert) {
            // Hide the alert after 4 seconds and redirect to the login page
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                history.push('/login');
            }, 4000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        // show error alert for 3 seconds
        if(showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert, history]);



    return (

        //Use the MUI theme created above
        <ThemeProvider theme={themeDark}>

            {/*Set the page title and metadata using Helmet*/}
            <Helmet>
                <title>Login - SecureComms</title>
                <meta name="description" content="Log in to your SecureComms account and access our secure communication platform." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charset="UTF-8" />
            </Helmet>

            {/* Snackbar alert for invalid email address */}
            {/*all snackbar durations are set to 5 seconds */}
            <Snackbar open={showSuccessAlert}>
                <Alert onClose={() => setShowSuccessAlert(false)} severity="success" sx={{ width: '100%' }}>
                    successfully enrolled in MFA, redirecting to login page
                </Alert>
            </Snackbar>

            {/* Snackbar alert for invalid password */}
            <Snackbar open={showError}>
                <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
                    invalid MFA code
                </Alert>
            </Snackbar>

            {/* Snackbar alert for account not found */}
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

                    {/* page text */}
                    <Typography component="h1" variant="h5">
                        Verify 2FA Code
                    </Typography>
                    <Typography component="h1" textAlign={'center'} padding={2}>
                        Please verify the code sent to your phone
                    </Typography>

                    <Box component="form" onSubmit={VerifyMfaCode} noValidate sx={{ mt: 1 }}>

                        {/* input field for MFA code */}
                        <TextField
                            id='verify-mfa-code'
                            type="text"
                            placeholder="2FA code"
                            fullWidth
                            required
                            margin="normal"
                        />

                        {/* submit MFA code button */}
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