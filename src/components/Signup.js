import {useEffect, useState} from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';


import { Alert } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";
import navlogo from "../images/GREYsecurecomms128.png";
import GlobalStyles from "@mui/material/GlobalStyles";
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
            main: "#27CC58"
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


function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [showPassAlert, setShowPassAlert] = useState(false);

    const [showEmailInUseAlert, setShowEmailInUseAlert] = useState(false);

    const [showInvalidCredAlert, setShowInvalidCredAlert] = useState(false);


    const handleSubmit = async (event) => {

        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        if (!emailRegex.test(email)) {
            setShowErrorAlert(true);
        }

        if (password.length < 6) {
           setShowPassAlert(true);
        }

        if (!emailRegex.test(email) && password.length < 6) {
            setShowInvalidCredAlert(true)
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

        if (showInvalidCredAlert) {
                const timer = setTimeout(() => {
                    setShowInvalidCredAlert(false);
                }, 3000);

                // Clean up the timer when the component is unmounted or showAlert changes
                return () => clearTimeout(timer);
        }
    }, [showErrorAlert, showPassAlert]);

    return (


        <ThemeProvider theme={themeDark}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />

            <AppBar
                position="static"
                color="secondary"
                elevation={0}

            >



            <Toolbar sx={{ flexWrap: 'wrap' }}>
                <a href="/">
                    <img src={navlogo} alt="logo" className="logosize"/>
                </a>

                <Typography variant="h6"
                            color="text.secondary"
                            noWrap
                            sx={{ flexGrow: 1,
                                textDecoration: 'none',
                            }}
                            component={Link}
                >

                    <Link href="/" color="text.secondary" sx={{
                        textDecoration: 'none',
                        boxShadow: 'none'
                    }}>
                        SecureComms
                    </Link>
                </Typography>

                <nav>
                    <Button
                        edge="end"
                        variant="contained"
                        color="button"
                        href="/login"
                    >
                        Log in
                    </Button>
                </nav>
            </Toolbar>
            </AppBar>




            <Snackbar open={showErrorAlert} autoHideDuration={5000} onClose={() => setShowErrorAlert(false)}>
                <Alert onClose={() => setShowErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid email address
                </Alert>
            </Snackbar>
            <Snackbar open={showPassAlert} autoHideDuration={5000} onClose={() => setShowPassAlert(false)}>
                <Alert onClose={() => setShowPassAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Password must be at least 6 characters long
                </Alert>
            </Snackbar>
            <Snackbar open={showEmailInUseAlert} autoHideDuration={5000} onClose={() => setShowEmailInUseAlert(false)}>
                <Alert onClose={() => setShowEmailInUseAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Email already in use
                </Alert>
            </Snackbar>
            <Snackbar open={showInvalidCredAlert} autoHideDuration={5000} onClose={() => setShowInvalidCredAlert(false)}>
                <Alert onClose={() => setShowInvalidCredAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid email address and password
                </Alert>
            </Snackbar>



            <Container component="main" maxWidth="xs">


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

                        <Button
                            type="submit"
                            fullWidth variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            color={"secondary"}
                        >
                            Sign up
                        </Button>
                        <Grid container justifyContent={'center'}>
                            <Grid item>
                                <Link href="/login" variant="body2" color={"secondary"}>
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