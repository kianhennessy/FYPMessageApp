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
            primary: "#27CC58"
        },
        secondary: {
            main: "#27CC58"
        },
        helperText: {
            main: "#27CC58"
        }
    }
});

export default function About() {



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
                    <Typography component="h1" variant="h5">
                       SecureComms
                    </Typography>
                    <Typography component="h1" textAlign={'center'} padding={2}>
                        test
                    </Typography>
                    <Typography component="h3" textAlign={'center'} padding={2}>
                        test
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            id='enroll-phone'
                            placeholder="Phone number (Including country code)"
                            helperText="Please include country code"
                            sx={{ m: 1, width: '40ch' }}
                            type="text"
                            required
                            fullWidth
                            size={"medium"}
                            margin={"normal"}
                        />

                        <Grid container justifyContent={'center'}>
                            <Grid item>
                                <Link href="/" variant="body2"  color={'secondary'}>
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
