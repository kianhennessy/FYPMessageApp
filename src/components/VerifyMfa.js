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

function VerifyMfa() {
    const user = auth.currentUser;
    console.log(user)
    const history = useHistory()

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    const [showAlert, setShowAlert] = useState(false);

    const verifyMfaCode = async () => {
        const code = document.getElementById('verify-mfa-code').value;

        const cred = firebase.auth.PhoneAuthProvider.credential(
            window.verificationId,
            code
        );

        const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
            cred
        );

        const user = auth.currentUser;

        await user.multiFactor.enroll(multiFactorAssertion, 'phone number');

        // try{
        //     await user.multiFactor.enroll(multiFactorAssertion, 'phone number');
        // }
        // catch (e) {
        //     console.log(e)
        //     if(e.code === "auth/invalid-verification-code"){
        //         alert("Invalid code")
        //     }
        // }

        setShowAlert(true);

        // alert('MFA code verified');
        await auth.signOut()
        // history.push("/")
        console.log(user)
    };

    useEffect(() => {
        if (showAlert) {
            // Hide the alert after 5 seconds and redirect to the login page
            const timer = setTimeout(() => {
                setShowAlert(false);
                history.push('/login');
            }, 3000);

            // Clean up the timer when the component is unmounted or showAlert changes
            return () => clearTimeout(timer);
        }
    }, [showAlert, history]);



    return (
        // <div id='login-page'>
        //     <div id='login-card'>
        //         <h2>Verify mfa</h2>
        //
        //         <div>
        //             <input id='verify-mfa-code' type="text"/>
        //             <button id='submit-code' onClick={verifyMfaCode}>submit mfa code</button>
        //             {/* button to enroll in mfa*/}
        //             <div onClick={handleLogout}>
        //                 Logout
        //             </div>
        //         </div>
        //         <br/>
        //         <br/>
        //     </div>
        // </div>

        <ThemeProvider theme={themeDark}>

            <Snackbar open={showAlert}>
                <Alert onClose={() => setShowAlert(false)} severity="success" sx={{ width: '100%' }}>
                    successfully enrolled in MFA, redirecting to login page
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
                        Verify 2FA Code
                    </Typography>
                    <Typography component="h1" textAlign={'center'} padding={2}>
                        Please verify the code sent to your phone
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 1 }}>

                        <TextField
                            id='verify-mfa-code'
                            type="text"
                            placeholder="2FA code"
                            fullWidth
                            required
                            margin="normal"
                        />
                        <Button id='submit-code' onClick={verifyMfaCode} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> submit mfa code</Button>

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

export default VerifyMfa;