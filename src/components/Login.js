import React, {useEffect, useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { auth } from "../firebase";
import { useForm } from 'react-hook-form';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Helmet } from 'react-helmet';
import Toolbar from "@mui/material/Toolbar";
import navlogo from "../images/GREYsecurecomms128.png";
import AppBar from "@mui/material/AppBar";
import logo from '../images/securecomms128.png';
import Image from "mui-image";

// Material UI theme
const themeDark = createTheme({
    // Define the palette colors for the theme
    palette: {
        // Background colour
        background: {
            paper: "#525969"
        },
        // Text colour
        text: {
            primary: "#27CC58",
            secondary: "#282c34",
        },
        // Secondary colour
        secondary: {
            main: "#27CC58",
        },
        // Button colour
        button: {
            main: "#282c34",
            contrastText: "#27CC58",
        },
    }
});


export default function Login() {

    // State variables for MFA code verification
    const [verificationId, setVerificationId] = useState(null);
    const [code, setCode] = useState("");


    // React Hook Form for managing form data
    const { register, handleSubmit } = useForm();

    // Function to handle form submission and sign in with email and password
    const onSubmit = async (data) => {
        const { email, password } = data;
        try {

            // Sign in with email and password via Firebase auth
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {

        }
    };

    // Setup invisible recaptcha verifier
    useEffect(() => {

        // Clear any existing captcha
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
            // reCAPTCHA type invisible
            size: "invisible",
            callback: function (response) {
                console.log("captcha solved!");
            },
        });
    }, []);

    // Function to handle login via Google auth and MFA
    const loginWithGoogle = async () => {
        try {
            // Sign in with Google via Firebase auth
            // Popup window will open for Google sign in
            await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        } catch (error) {
            // If MFA is required, get the MFA token and sign in
            if (error.code === "auth/multi-factor-auth-required") {
                window.resolver = error.resolver;
            }
        }

        // Set up MFA phone options
        const phoneOpts = {
            multiFactorHint: window.resolver.hints[0],
            session: window.resolver.session,
        };

        // Set up phone auth provider
        const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

        // Send verification code to user's phone
        setVerificationId(
            await phoneAuthProvider.verifyPhoneNumber(phoneOpts, window.recaptchaVerifier)
        );

        // Show snackbar alert that code has been sent
        setShowCodeSentAlert(true);

        // Open the MFA dialog box after account has been authenticated
        handleClickOpen();

    };

    // State variables and functions to manage dialog open/close
    const [open, setOpen] = React.useState(false);

    // Function to handle dialog open
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Function to handle dialog close
    const handleClose = () => {
        setOpen(false);
    };


    // MUI snackbar alert state variables
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);
    const [showAccountAlert, setShowAccountAlert] = useState(false);
    const [showCodeSentAlert, setShowCodeSentAlert] = useState(false);

    // Function to handle login with email, password and MFA
    const loginWithEmailandPassword = async () => {

        // Get email and password from form
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Validate email format
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        // Show error alert if email is invalid
        if (!emailRegex.test(email)) {
            setShowErrorAlert(true);
        }

        // Show error alert if password is less than 6 characters
        // 6 characters is the minimum password length for Firebase
        if(password.length < 6 || password === "") {
            setShowPasswordAlert(true);
        }

        try {
            // Sign in with email and password via Firebase auth
            await auth.signInWithEmailAndPassword(email, password);

        } catch (error) {
            // If MFA is required, get the MFA token and sign in
            if (error.code === "auth/multi-factor-auth-required") {
                window.resolver = error.resolver;
            }
            // Show error alert if account does not exist
            if (error.code === 'auth/user-not-found') {
                setShowAccountAlert(true);
            }
        }

        // Set up MFA phone options
        const phoneOpts = {
            multiFactorHint: window.resolver.hints[0],
            session: window.resolver.session,
        };

        // Set up phone auth provider
        const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

        // Send verification code to user's phone
        setVerificationId(
            await phoneAuthProvider.verifyPhoneNumber(phoneOpts, window.recaptchaVerifier)
        );

        // Show snackbar alert that code has been sent
        setShowCodeSentAlert(true);

        // Open the MFA dialog box after account has been authenticated
        handleClickOpen();
    };

    // set MFA code state variable
    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    // MUI alert for MFA codes
    const [showInvalidCode, setShowInvalidCode] = useState(false);
    const [showWrongCode, setShowWrongCode] = useState(false);

    // Function to handle MFA code verification
    const handleVerifyCode = async () => {

        // Try to verify the code
        try{
            // Create a PhoneAuthProvider credential with the verificationId and entered code
            const cred = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                code
            );

            // Generate a multi-factor assertion with the created credential
            const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
                cred
            );

            // Resolve the sign in with the generated assertion
            const credential = await window.resolver.resolveSignIn(multiFactorAssertion);

        } catch (error) {
            console.log(error);

            // Show error message if the verification code is missing
            if (error.code === "auth/missing-code") {
                setShowInvalidCode(true);
            }

            // Show error message if the verification code is invalid
            if(error.code === "auth/invalid-verification-code") {
                setShowWrongCode(true);
            }
        }

    };


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
            <Snackbar open={showErrorAlert} autoHideDuration={5000} onClose={() => setShowErrorAlert(false)} >
                <Alert onClose={() => setShowErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid email address
                </Alert>
            </Snackbar>

            {/* Snackbar alert for invalid password */}
            <Snackbar open={showPasswordAlert} autoHideDuration={5000} onClose={() => setShowPasswordAlert(false)} >
                <Alert onClose={() => setShowPasswordAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid password
                </Alert>
            </Snackbar>

            {/* Snackbar alert for account not found */}
            <Snackbar open={showAccountAlert} autoHideDuration={5000} onClose={() => setShowAccountAlert(false)} >
                <Alert onClose={() => setShowAccountAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Account does not exist
                </Alert>
            </Snackbar>

            {/* Snackbar alert for invalid MFA code */}
            <Snackbar open={showInvalidCode} autoHideDuration={5000} onClose={() => setShowInvalidCode(false)} >
                <Alert onClose={() => setShowInvalidCode(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid code
                </Alert>
            </Snackbar>

            {/* Snackbar alert for incorrect MFA code */}
            <Snackbar open={showWrongCode} autoHideDuration={5000} onClose={() => setShowWrongCode(false)} >
                <Alert onClose={() => setShowWrongCode(false)} severity="error" sx={{ width: '100%' }}>
                    Incorrect code
                </Alert>
            </Snackbar>

            {/* Snackbar alert for MFA code sent to users phone */}
            <Snackbar open={showCodeSentAlert} autoHideDuration={5000} onClose={() => setShowCodeSentAlert(false)} >
                <Alert onClose={() => setShowCodeSentAlert(false)} severity="info" sx={{ width: '100%' }}>
                    2FA code has been sent to your phone
                </Alert>
            </Snackbar>

            {/* MUI App bar */}
            <AppBar
                position="static"
                color="secondary"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                {/* MUI Toolbar - Logo and App name are links for home page */}
                <Toolbar sx={{ flexWrap: 'wrap' }}>

                    <a href="/">
                        <img src={navlogo} alt="logo" className="logosize"/>
                    </a>

                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ flexGrow: 1,
                            textDecoration: 'none',
                        }}
                        component={Link}
                    >
                        <Link
                            href="/"
                            sx={{
                                textDecoration: 'none',
                                boxShadow: 'none',
                                color: 'text.secondary'
                            }}
                        >
                            SecureComms
                        </Link>
                    </Typography>

                </Toolbar>
            </AppBar>



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
                            marginBottom: 2,
                        }}

                    />
                    <Typography component="h1" variant="h5" >
                        Log in
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>

                        {/* MUI text fields for email */}
                        <TextField
                            placeholder="Email"
                            required
                            fullWidth
                            margin={"normal"}
                            id={'login-email'}{...register('email', { required: true })}
                        />

                        {/* MUI text fields for password */}
                        <TextField
                            type="password"
                            placeholder="Password"
                            required
                            fullWidth
                            margin={"normal"}
                            id={'login-password'}{...register('password', { required: true })}
                        />

                            {/* MUI button to log in */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color={"secondary"}
                                sx={{ mt: 3, mb: 2 }}
                                onClick={loginWithEmailandPassword}
                            >
                                Log in
                            </Button>


                            {/* Dialog box to enter 2FA login */}
                            <Dialog open={open} onClose={handleClose} PaperProps={{
                                style: {
                                    backgroundColor: "#222222",
                                },
                            }}>

                                {/* MUI dialog box title */}
                                <DialogTitle> Verify Code </DialogTitle>

                                {/* MUI dialog box content - 2FA code is entered here */}
                                <DialogContent>


                                    <DialogContentText color={'secondary'}>
                                        Please enter the verification code sent to your phone.
                                    </DialogContentText>

                                    {/* text field for 2FA code */}
                                    <TextField
                                        color={"success"}
                                        placeholder="code"
                                        required
                                        fullWidth
                                        type="text"
                                        id="verification-code-input"
                                        value={code}
                                        onChange={handleCodeChange}
                                        margin={"dense"}
                                        padding={"dense"}
                                    />

                                </DialogContent>
                                <DialogActions>

                                    {/* button to close dialog box */}
                                    <Button onClick={handleClose} color={'secondary'}>Cancel</Button>

                                    {/* button to verify 2FA code */}
                                    <Button onClick={handleVerifyCode} color={'secondary'}>Verify</Button>
                                </DialogActions>
                            </Dialog>

                        <Typography align={'center'} padding={1}>
                            OR
                        </Typography>

                        <Grid container justifyContent={'center'}>
                            <Grid item padding={2}>

                                {/* Sign in with Google button */}
                                <div className="login-button google" onClick={loginWithGoogle}>

                                    <GoogleOutlined/> Sign In with Google

                                </div>
                            </Grid>
                        </Grid>

                        {/* Page links for sign up and forgot password */}
                        <Grid container>
                            <Grid item xs>
                                <Link href="/signup" variant="body2" color={"secondary"} >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                            <Grid item>

                                <Link href="/reset-password" variant="body2" color={"secondary"} >
                                    {"Forgot password?"}
                                </Link>
                            </Grid>
                        </Grid>

                        <div id="recaptcha"/>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}