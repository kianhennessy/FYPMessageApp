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

import { Alert } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";
import { useHistory } from 'react-router-dom';

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



function ResetPassword(){

    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const history = useHistory();


    const HandleResetPassword = (event) => {

        if(email === ""){
            setShowErrorAlert(true);

            setTimeout(() => {
                setShowErrorAlert(false);
            }, 3000);
        }

        event.preventDefault();
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent successfully
                setShowAlert(true);
            })
            .catch((error) => {
                // Handle error
            });

    };
        useEffect(() => {
            if (showAlert) {
                // Hide the alert after 5 seconds and redirect to the login page
                const timer = setTimeout(() => {
                    setShowAlert(false);
                    history.push('/login');
                }, 5000);

                // Clean up the timer when the component is unmounted or showAlert changes
                return () => clearTimeout(timer);
            }
        }, [showAlert, history]);


    return (
    //     <form onSubmit={handleResetPassword}>
    //         <label>
    //             Email:
    //             <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
    //         </label>
    //         <button type="submit">Reset Password</button>
    //     </form>
    // );

        <ThemeProvider theme={themeDark}>

            <Snackbar open={showAlert}>
                <Alert onClose={() => setShowAlert(false)} severity="success" sx={{ width: '100%' }}>
                    Password reset successful! Redirecting to login page...
                </Alert>
            </Snackbar>
            <Snackbar open={showErrorAlert} autoHideDuration={5000} onClose={() => setShowErrorAlert(false)}>
                <Alert onClose={() => setShowErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Please enter your email address.
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
                        Reset Password
                    </Typography>
                    <Box component="form" onSubmit={HandleResetPassword} noValidate sx={{ mt: 1 }}>
                        <TextField
                            type="email"
                            placeholder="Email"
                            required
                            fullWidth
                            margin={"normal"}
                            value={email} onChange={(event) => setEmail(event.target.value)}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Reset Password</Button>



                        <Grid container>
                            <Grid item>
                                <Link href="/" variant="body2" >
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