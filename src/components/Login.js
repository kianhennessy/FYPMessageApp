import React, {useEffect, useState } from "react";

import { GoogleOutlined } from "@ant-design/icons";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { auth } from "../firebase";
import { useHistory } from "react-router-dom"
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
import Stack from '@mui/material/Stack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {styled} from "@mui/material";

import { Helmet } from 'react-helmet';
import Toolbar from "@mui/material/Toolbar";
import navlogo from "../images/GREYsecurecomms128.png";
import AppBar from "@mui/material/AppBar";

import logo from '../images/securecomms128.png';
import Image from "mui-image";


const themeDark = createTheme({
    palette: {
        background: {
            paper: "#525969"
        },
        text: {
            primary: "#27CC58",
            secondary: "#282c34",

        },
        secondary: {
            main: "#27CC58",
        },
        button: {
            main: "#282c34",
            contrastText: "#27CC58",
        },
        CardContent: {
            main: "#282c34",
        },

    }
});


export default function Login() {

    const [verificationId, setVerificationId] = useState(null);
    const [code, setCode] = useState("");

    //const [alert, setAlert] = useState(null);
    const history = useHistory();

    // login form
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const { email, password } = data;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            // User successfully logged in

            console.log("User successfully logged in");
        } catch (error) {
            // Handle login error
        }
    };

    useEffect(() => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
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

        setShowCodeSentAlert(true);
        handleClickOpen();

    };


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);
    const [showAccountAlert, setShowAccountAlert] = useState(false);

    const [showCodeSentAlert, setShowCodeSentAlert] = useState(false);

    const loginWithEmailandPassword = async () => {

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        if (!emailRegex.test(email)) {
            setShowErrorAlert(true);
        }

        if(password.length < 6 || password === "") {
            setShowPasswordAlert(true);
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);

        } catch (error) {
            if (error.code === "auth/multi-factor-auth-required") {
                window.resolver = error.resolver;
            }
            if (error.code === 'auth/user-not-found') {
                setShowAccountAlert(true);
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

        setShowCodeSentAlert(true);
        handleClickOpen();
    };


    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const [showInvalidCode, setShowInvalidCode] = useState(false);
    const [showWrongCode, setShowWrongCode] = useState(false);

    const handleVerifyCode = async () => {

        try{
            const cred = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                code
            );

            const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
                cred
            );

            const credential = await window.resolver.resolveSignIn(multiFactorAssertion);

            console.log(credential);
        } catch (error) {
            console.log(error);
            if (error.code === "auth/missing-code") {
                setShowInvalidCode(true);
            }

            if(error.code === "auth/invalid-verification-code") {
                setShowWrongCode(true);
            }
        }

    };


    return (

        <ThemeProvider theme={themeDark}>
            <div>
                <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
                    </meta>
                </Helmet>
            </div>
            <Snackbar open={showErrorAlert} autoHideDuration={5000} onClose={() => setShowErrorAlert(false)} >
                <Alert onClose={() => setShowErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid email address
                </Alert>
            </Snackbar>
            <Snackbar open={showPasswordAlert} autoHideDuration={5000} onClose={() => setShowPasswordAlert(false)} >
                <Alert onClose={() => setShowPasswordAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid password
                </Alert>
            </Snackbar>
            <Snackbar open={showAccountAlert} autoHideDuration={5000} onClose={() => setShowAccountAlert(false)} >
                <Alert onClose={() => setShowAccountAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Account does not exist
                </Alert>
            </Snackbar>
            <Snackbar open={showInvalidCode} autoHideDuration={5000} onClose={() => setShowInvalidCode(false)} >
                <Alert onClose={() => setShowInvalidCode(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid code
                </Alert>
            </Snackbar>
            <Snackbar open={showWrongCode} autoHideDuration={5000} onClose={() => setShowWrongCode(false)} >
                <Alert onClose={() => setShowWrongCode(false)} severity="error" sx={{ width: '100%' }}>
                    Incorrect code
                </Alert>
            </Snackbar>
            <Snackbar open={showCodeSentAlert} autoHideDuration={5000} onClose={() => setShowCodeSentAlert(false)} >
                <Alert onClose={() => setShowCodeSentAlert(false)} severity="info" sx={{ width: '100%' }}>
                    2FA code has been texted to your phone
                </Alert>
            </Snackbar>

            <AppBar
                position="static"
                color="secondary"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
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

                            <Dialog open={open} onClose={handleClose} PaperProps={{
                                style: {
                                    backgroundColor: "#222222",
                                },
                            }}>

                                <DialogTitle >Verify Code</DialogTitle>
                                <DialogContent>
                                    <DialogContentText color={'secondary'}>
                                        Please enter the verification code sent to your phone.
                                    </DialogContentText>
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
                                    <Button onClick={handleClose} color={'secondary'}>Cancel</Button>
                                    <Button onClick={handleVerifyCode} color={'secondary'}>Verify</Button>
                                </DialogActions>
                            </Dialog>

                        <Typography align={'center'} padding={1}>
                            OR
                        </Typography>

                        <Grid container justifyContent={'center'}>
                            <Grid item padding={2}>
                                <div className="login-button google" onClick={loginWithGoogle}>

                                    <GoogleOutlined/> Sign In with Google
                                </div>
                            </Grid>
                        </Grid>




                        {/*<TextField*/}
                        {/*    placeholder="Verify code"*/}
                        {/*    required*/}
                        {/*    fullWidth*/}
                        {/*    type="text"*/}
                        {/*    id="verification-code-input"*/}
                        {/*    value={code}*/}
                        {/*    onChange={handleCodeChange}*/}
                        {/*    margin={"dense"}*/}
                        {/*    padding={"dense"}*/}
                        {/*/>*/}

                        {/*<Button*/}
                        {/*    onClick={handleVerifyCode}*/}
                        {/*    fullWidth*/}
                        {/*    variant="contained"*/}
                        {/*    sx={{ mt: 3, mb: 2 }}*/}
                        {/*>*/}
                        {/*    Verify Code*/}
                        {/*</Button>*/}

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