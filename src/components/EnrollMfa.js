import React, {useEffect} from "react"

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

export default function EnrollMfa() {
    const user = auth.currentUser;
    console.log(user)

    const history = useHistory()

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    useEffect(() => {
        // Setup a global captcha
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'enroll-button', {
            size: 'invisible',
            callback: function (response) {
                console.log('captcha solved!');
            },
        });
    }, [])




    const enroll = async () => {

        const phoneNumber = document.getElementById('enroll-phone').value;

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

        alert('sms text sent!');
        history.push("/verify-mfa")
    };



    return (
        // <div id='login-page'>
        //     <div id='login-card'>
        //         <h2>MFA</h2>
        //
        //         <div>
        //             <p>Please verify your email address before enrolling in additional factors</p>
        //             <input id='enroll-phone' type="text"/>
        //             <button id='enroll-button' onClick={enroll}>Send Code</button>
        //
        //         {/* button to enroll in mfa*/}
        //             <div onClick={handleLogout}>
        //                 Logout
        //             </div>
        //         </div>
        //         <br/><br/>
        //
        //     </div>
        // </div>

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
                    <Typography component="h1" variant="h5">
                        2FA Enrollment
                    </Typography>
                    <Typography component="h1" textAlign={'center'} padding={2}>
                        Please verify your email address before enrolling in additional factors
                    </Typography>
                    <Typography component="h3" textAlign={'center'} padding={2}>
                        Note: This step will not work if do not verify your email address
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>

                        <TextField
                            id='enroll-phone'
                            placeholder="Phone Number"
                            type="text"
                            required
                            fullWidth
                            margin={"normal"}
                        />
                        <Button id='enroll-button' fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={enroll}>Send Code</Button>

                        <Grid container justifyContent={'center'}>
                            <Grid item>
                                <Link href="/" variant="body2" onClick={handleLogout}>
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
