import { useState } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CryptoJS from "crypto-js";


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



    const handleSubmit = async (event) => {
        event.preventDefault();

        // Hash the email
        const hashedEmail = CryptoJS.SHA256(email).toString();

        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential)=>{
                // send verification mail.
                userCredential.user.sendEmailVerification();
                alert("Email sent");
            })
            console.log('User created!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        // <form onSubmit={handleSubmit}>
        //     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        //     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        //     <button type="submit">Sign up</button>
        // </form>


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