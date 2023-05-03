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
        },
        // Helper text colour
        helperText: {
            main: "#27CC58"
        }
    }
});

// EnrollMfa component for enrolling users in MFA using Firebase
export default function EnrollMfa() {

    // Get the current user
    const user = auth.currentUser;
    console.log(user)

    // history object for redirecting users
    const history = useHistory()

    // Function to handle logout and redirect to the home page
    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    // MUI alerts
    // Success alert
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    // Error alert
    const [showError, setShowError] = useState(false);
    // Info alert
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    // Login error alert
    const [showLoginError, setShowLoginError] = useState(false);
    // Phone error alert
    const [showPhoneError, setShowPhoneError] = useState(false);
    // Captcha error alert
    const [showCaptchError, setShowCaptchError] = useState(false);

    // useEffect to set up the reCAPTCHA verifier and handle timer-related logic for alerts
    useEffect(() => {
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            // The ID and element to render the reCAPTCHA
            'enroll-button', {
                // reCAPTCHA type is invisible
                size: 'invisible',

                // Callback function executed when the captcha is solved
                callback: function (response) {
                console.log('captcha solved!');
                },
            });

        // If the success alert is shown
        if (showSuccessAlert) {
            // Hide the alert after 2 seconds and redirect to the verify MFA page
            const timer = setTimeout(() => {
                // Clear the alert
                setShowSuccessAlert(false);
                // Redirect to the verify MFA page
                history.push("/verify-mfa");
            }, 2000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        // If the error alert is shown
        if(showError){
            // Hide the alert after 3 seconds
            const timer = setTimeout(() => {
                // Clear the alert
                setShowError(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        // If the info alert is shown
        if(showInfoAlert){
            // Hide the alert after 9 seconds
            const timer = setTimeout(() => {
                // Clear the alert
                setShowInfoAlert(false);
            }, 9000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        // If the login error alert is shown
        if(showLoginError){
            // Hide the alert after 3 seconds
            const timer = setTimeout(() => {
                // Clear the alert
                setShowLoginError(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }

        // If the phone error alert is shown
        if(showPhoneError){
            // Hide the alert after 3 seconds
            const timer = setTimeout(() => {
                // Clear the alert
                setShowPhoneError(false);

            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }


    }, [showSuccessAlert, history, showError, showInfoAlert, showLoginError, showPhoneError])


    // Function to show the info alert
    const showAlert = () => {
        setShowInfoAlert(true);
    }

    // Show the info alert on first page load
    window.onload = function () {
        if(!localStorage.getItem('firstLoad')){
            localStorage.setItem('firstLoad', 'true');
            showAlert(true);
        }
    }

    // Function to enroll the user in MFA
    const Enroll = async (event) => {

        // Regex for phone number validation
        const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

        // If the phone number entered is invalid
        if(!phoneNumberRegex.test(document.getElementById('enroll-phone').value)){
            // Show the phone error alert
            setShowPhoneError(true);
            //hide the show error alert
            setShowError(false);
        }

        // Get the phone number from the form
        const phoneNumber = document.getElementById('enroll-phone').value;

        // Prevent the default form submission behaviour
        event.preventDefault();

        // Enroll the user in MFA
        try {
            // Get the current user and their MFA session
            const user = auth.currentUser;
            console.log(user)
            console.log(user.multiFactor)

            // Get the MFA session
            const session = await user.multiFactor.getSession();

            // Set up the phone options for MFA
            const phoneOpts = {
                phoneNumber,
                session,
            };

            // Create a new PhoneAuthProvider instance
            const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

            // Verify the phone number using the reCAPTCHA verifier
            window.verificationId = await phoneAuthProvider.verifyPhoneNumber(
                phoneOpts,
                window.recaptchaVerifier
            );
            // Show success alert
            setShowSuccessAlert(true);

        // Handle various error scenarios
        } catch (error) {
            console.log(error)
            // If the user has not verified their email
            if(error.code === 'auth/unverified-email'){
                // Show an error alert
                setShowError(true);
            }
            // If the user has not logged in recently
            if(error.code === 'auth/requires-recent-login'){
                // Show a login error alert
                setShowLoginError(true)
            }
            // If the reCAPTCHA has already been rendered in this element
            if(error.message === 'reCAPTCHA has already been rendered in this element'){
                // Show a captcha error alert
                setTimeout(() => {
                    setShowPhoneError(false);
                    // Reload the page after 4 seconds
                    window.location.reload();
                }, 4000);

                setShowError(false);
                setShowPhoneError(false);
                setShowCaptchError(true);
            }

            // If the user has not entered a phone number
            if(document.getElementById('enroll-phone').value === '' && error.code === 'auth/unverified-email'){
                // Show a phone error alert
                setShowPhoneError(true);
                //hide the show error alert
                setShowError(false);
            }

            // If the user has entered an invalid phone number
            if(error.code === 'auth/invalid-phone-number'){
                setShowPhoneError(true);
                setShowError(false);
            }

        }
    };


    return (

        // Use the MUI theme created above
        <ThemeProvider theme={themeDark}>

            {/*Set the page title and metadata using Helmet*/}
            <Helmet>
                <title>Login - SecureComms</title>
                <meta name="description" content="Log in to your SecureComms account and access our secure communication platform." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charset="UTF-8" />
            </Helmet>

            {/* Show info Snackbar when 2FA code is sent to user */}
            <Snackbar open={showSuccessAlert}>
                <Alert onClose={() => setShowSuccessAlert(false)} severity="info" sx={{ width: '100%' }}>
                    sms text sent!
                </Alert>
            </Snackbar>

            {/* Show error Snackbar when user has not verified their email */}
            <Snackbar open={showError}>
                <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
                    Please Verify Email, refresh page and try again
                </Alert>
            </Snackbar>

            {/* Show info Snackbar when user has not logged in recently */}
            <Snackbar open={showInfoAlert}>
                <Alert onClose={() => setShowInfoAlert(false)} severity="info" sx={{ width: '100%' }}>
                    A verification email has been sent to your email address, please verify your email address before enrolling in additional factors
                </Alert>
            </Snackbar>

            {/* Show error Snackbar when user has not logged in recently */}
            <Snackbar open={showLoginError}>
                <Alert onClose={() => setShowLoginError(false)} severity="error" sx={{ width: '100%' }}>
                    Please login again
                </Alert>
            </Snackbar>

            {/* Show error Snackbar when user has not entered a valid phone number */}
            <Snackbar open={showPhoneError}>
                <Alert onClose={() => setShowPhoneError(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid phone number with country code
                </Alert>
            </Snackbar>

            {/* Show error Snackbar when reCAPTCHA has already been rendered in this element */}
            <Snackbar open={showCaptchError}>
                <Alert onClose={() => setShowCaptchError(false)} severity="error" sx={{ width: '100%' }}>
                    Page reloading due to reCAPTCHA error, please try again
                </Alert>
            </Snackbar>

            {/* MUI container for page contents */}
            <Container component="main" maxWidth="xs">

                {/* CSS Baseline for consistent styling across browsers */}
                <CssBaseline />
                <Box

                    // Box styling
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* MUI Image component for app logo */}
                    <Image
                        // Image source
                        src = {logo}

                        // Image styling
                        sx={{
                            maxHeight: 40,
                            maxWidth: 40,
                        }}
                    />

                    {/* MUI Typography component for page title */}
                    <Typography component="h1" variant="h5">
                        2FA Enrollment
                    </Typography>

                    {/* MUI Typography component for page subtitle */}
                    <Typography component="h1" textAlign={'center'} padding={2}>
                        A verification email has been sent to you email. Please verify your email address before enrolling in additional factors
                    </Typography>

                    {/* MUI Typography component for page subtitle */}
                    <Typography component="h3" textAlign={'center'} padding={2}>
                        Note: This step will not work if do not verify your email address
                    </Typography>

                    {/* MUI Box component for form */}
                    <Box component="form" noValidate sx={{ mt: 1 }}>


                        {/* MUI TextField component for email input */}
                        <TextField
                            // ID for phone input, this id matches the function above for the phone input
                            // this is how the phone number is passed to the function
                            id='enroll-phone'

                            // placeholder text
                            placeholder="Phone Number"

                            // text field type is text
                            type="text"

                            // helper text to show the user what format to enter the phone number in
                            helperText="Please include country code"

                            // text field is required
                            required
                            fullWidth
                            margin={"normal"}
                        />


                        {/*reCAPTCHA div*/}
                        <div id='enroll-button'></div>

                        {/* MUI Button component for submitting the form */}
                        <Button
                            // ID for the submit button, this id matches the function above for the submit button
                            id='enroll-button'
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}

                            // Enroll function is called when the button is clicked
                            onClick={Enroll}
                            color={'secondary'}
                        >
                            Send Code
                        </Button>

                        {/* MUI Grid component for link to home page */}
                        <Grid container justifyContent={'center'}>
                            <Grid item>
                                {/* Link to home page */}
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
