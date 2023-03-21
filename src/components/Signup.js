import {useEffect, useState} from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import * as React from 'react';
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

import { Alert, AlertTitle } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";

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


function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [showPassAlert, setShowPassAlert] = useState(false);

    const [showEmailInUseAlert, setShowEmailInUseAlert] = useState(false);

    // const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    //
    // const showAlert = (message, severity) => {
    //     setAlert({ open: true, message, severity });
    //     setTimeout(() => {
    //         setAlert({ open: false, message: '', severity: '' });
    //     }, 3000);
    // }

    const handleSubmit = async (event) => {

        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        if (!emailRegex.test(email)) {
            setShowErrorAlert(true);

            setTimeout(() => {
                setShowErrorAlert(false);
            }, 4000)
        }

        if (password.length < 6) {
           setShowPassAlert(true);
        }

        event.preventDefault();
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential)=>{
                // send verification mail.
                userCredential.user.sendEmailVerification();
                // alert("Email sent");
            })
            console.log('User created!');
        } catch (error) {
            console.error(error);
            if(error.code === "auth/email-already-in-use"){
                setShowEmailInUseAlert(true);
            }
        }
    };

    useEffect(() => {
        if (showErrorAlert) {
            const timer = setTimeout(() => {
                setShowErrorAlert(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }
        if (showPassAlert) {

            const timer = setTimeout(() => {
                setShowPassAlert(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }
        if (showEmailInUseAlert) {

            const timer = setTimeout(() => {
                setShowEmailInUseAlert(false);
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }
    }, [showErrorAlert, showPassAlert]);

    return (
        // <form onSubmit={handleSubmit}>
        //     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        //     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        //     <button type="submit">Sign up</button>
        // </form>


        <ThemeProvider theme={themeDark}>
            <Snackbar open={showErrorAlert} autoHideDuration={5000} onClose={() => setShowErrorAlert(false)}>
                <Alert onClose={() => setShowErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid email address.
                </Alert>
            </Snackbar>
            <Snackbar open={showPassAlert} autoHideDuration={5000} onClose={() => setShowPassAlert(false)}>
                <Alert onClose={() => setShowPassAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Password must be at least 6 characters long.
                </Alert>
            </Snackbar>
            <Snackbar open={showEmailInUseAlert} autoHideDuration={5000} onClose={() => setShowEmailInUseAlert(false)}>
                <Alert onClose={() => setShowEmailInUseAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Email already in use.
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            type="email"
                            placeholder="Email"
                            required
                            fullWidth
                            margin={"normal"}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            type="password"
                            placeholder="Password"
                            required
                            fullWidth
                            margin={"normal"}
                            value={password} onChange={(e) => setPassword(e.target.value)} />

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign up</Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/" variant="body2" >
                                    {"Already have an account? Log in"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>


    );
}

export default SignUp;