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
import { Alert } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";
import { useHistory } from 'react-router-dom';
import logo from "../images/securecomms128.png";
import Image from "mui-image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import navlogo from "../images/GREYsecurecomms128.png";
import {Helmet} from "react-helmet";


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
            main: "#27CC58"
        },
        // Button colour
        button: {
            main: "#282c34",
            contrastText: "#27CC58",
        }
    }
});



function ResetPassword(){

    // MUI snackbar alert state variables
    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showBadRegexEmailAlert, setShowBadRegexEmailAlert] = useState(false);
    const history = useHistory();

    // Handle the email input field
    const HandleResetPassword = (event) => {

        // if email is empty, show error alert
        if(email === ""){
            setShowErrorAlert(true);

            // Hide the alert after 4 seconds
            setTimeout(() => {
                setShowErrorAlert(false);
            }, 4000);
        }

        // Regex for email validation
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        // If email does not match regex, show error alert
        if (!emailRegex.test(email)) {
            setShowBadRegexEmailAlert(true);
        }

        // Prevent the default form submit behaviour
        event.preventDefault();

        // Send password reset email
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent successfully
                setShowAlert(true);
            })
            .catch((error) => {
                // Handle error

                // If user not found, show error alert
                if (error.code === 'auth/user-not-found') {
                    setShowErrorAlert(true);
                }
            });

    };
        useEffect(() => {
            if (showAlert) {

                // Hide the alert after 6 seconds and redirect to the login page
                const timer = setTimeout(() => {
                    setShowAlert(false);
                    history.push('/login');
                }, 6000);

                // Clean up the timer when the component is unmounted or showAlert changes
                return () => clearTimeout(timer);
            }
        }, [showAlert, history]);


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

            {/* Snackbar alert for directing to login page */}
            {/*all snackbar durations are set to 5 seconds */}
            <Snackbar open={showAlert}>
                <Alert onClose={() => setShowAlert(false)} severity="success" sx={{ width: '100%' }}>
                    Password reset email sent successfully! Please check your email.
                    Redirecting to login page...
                </Alert>
            </Snackbar>

            {/* Snackbar alert for empty email field */}
            <Snackbar open={showErrorAlert} autoHideDuration={5000} onClose={() => setShowErrorAlert(false)}>
                <Alert onClose={() => setShowErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter your email address.
                </Alert>
            </Snackbar>

            {/* Snackbar alert for invalid email */}
            <Snackbar open={showBadRegexEmailAlert} autoHideDuration={5000} onClose={() => setShowBadRegexEmailAlert(false)}>
                <Alert onClose={() => setShowBadRegexEmailAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter a valid email address.
                </Alert>
            </Snackbar>

            {/* Snackbar alert for user not found */}
            <Snackbar open={showErrorAlert} autoHideDuration={5000} onClose={() => setShowErrorAlert(false)}>
                <Alert onClose={() => setShowErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Account not found. Please try again.
                </Alert>
            </Snackbar>

            {/* Navbar */}
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
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>

                    {/* Field to enter email for password recovery */}
                    <Box component="form" onSubmit={HandleResetPassword} noValidate sx={{ mt: 1 }}>
                        <TextField
                            type="email"
                            placeholder="Email"
                            required
                            fullWidth
                            margin={"normal"}
                            value={email} onChange={(event) => setEmail(event.target.value)}
                        />

                        {/* Submit button */}
                        <Button
                            type="submit" fullWidth
                            variant="contained"
                            color={"secondary"}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>

                        <Grid container justifyContent={'center'}>
                            <Grid item>
                                <Link href="/" variant="body2" color={"secondary"}>
                                    {"Home"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>

    );

}

export default ResetPassword;