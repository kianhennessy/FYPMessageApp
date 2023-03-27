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
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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




const themeDark = createTheme({
    palette: {
        background: {
            default: "#222222"
        },
        text: {
            primary: "#00FF00"
        },
        secondary: {
            main: "#00FF00"
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
            history.push("/");
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
        // setAlert({severity:"info", message: "SMS Sent Successfully"});

    };


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
        // alert("sms text sent!");
    };



    const handleLoginButtonClick = () => {
        //call loginWithEmailandPassword
        loginWithEmailandPassword();


        // Call the function to open the MUI dialog
        handleClickOpen();
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

        // setAlert({severity:"success", message: "logged in successfully"});
    };


    return (

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
                                onClick={handleLoginButtonClick}

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