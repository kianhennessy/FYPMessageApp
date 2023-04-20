import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import {CardActionArea, CardMedia, makeStyles, Paper} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from "@mui/material/Stack";



import Image from 'mui-image'

import device from '../images/device.png';
import encrypt from '../images/encrypt.png';
import free from '../images/free.png';
import message from '../images/message.png';
import selfd from '../images/selfdestruct.png';
import twofa from '../images/2fa.png';

import logo from '../images/securecomms.png';
import navlogo from '../images/GREYsecurecomms128.png';
import footerlogo from '../images/securecomms128.png';


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

const tiers = [
    {
        title: 'Message on any device',

        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
        image: device,
    },
    {
        title: 'Free forever no ads',

        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
        image: free,
    },
    {
        title: 'Two-factor authentication',

        buttonText: 'Get started',
        buttonVariant: 'contained',
        image: twofa,
    },
    {
        title: 'Self-destruct messages',

        buttonText: 'Contact us',
        buttonVariant: 'outlined',
        image: selfd,
    },
    {
        title: 'Chat with friends',

        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
        image: message,
    },
    {
        title: 'Message encryption',

        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
        image: encrypt,
    },
];

function Copyright() {
    return (
        <Typography variant="body2" color="text.primary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/"
                  sx={{
                      textDecoration: 'none',
                      boxShadow: 'none',
                      color: 'text.primary'
                  }}
            >
                SecureComms
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}



export default function Home() {
    return (
        <React.Fragment>
            <ThemeProvider theme={themeDark}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
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


            {/* Hero unit */}
            {/*    <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>*/}
                <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"

                    >
                        <Grid item xs={2}  sm={1}>
                            <Image
                                src = {logo}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} >
                        <Typography

                            component="h1"
                            variant="h3"
                            align="center"
                            color="text.primary"

                        >
                            SecureComms
                        </Typography>
                        </Grid>
                    </Grid>



                <Typography variant="h5" align="center" color="text.primary" paragraph paddingTop="10px">
                    A secure messaging service that ensures users privacy with end-to-end encryption

                </Typography>
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        sx={{textTransform: "none"}}
                        color={"secondary"}
                        text
                        href="/signup"
                    >
                        Get SecureComms
                    </Button>

                </Stack>
            </Container>
            {/* End hero unit */}




            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {tiers.map((tier) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid
                            item
                            key={tier.title}
                            xs={12}
                            sm={6}
                            md={6}
                        >
                            <Card>
                                <CardActionArea>
                                <CardHeader
                                    title={tier.title}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{
                                        align: 'center',
                                    }}
                                    sx={{
                                        backgroundColor: "#525969",
                                    }}

                                />
                                <CardMedia
                                    sx={{
                                        height: "300px",
                                        // pt: '20%',
                                    }}
                                    margin-left="300px"
                                    component="img"
                                    image = {tier.image}
                                    alt="image"
                                />

                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

                {/* Footer */}
                <Box sx={{ bgcolor: 'background.paper', p: 5 , marginTop:3 }} component="footer">

                    <Image
                        src = {footerlogo}
                        sx={{
                            maxHeight: 50,
                            maxWidth: 50,
                        }}

                    />
                    <Typography variant="h6" align="center" gutterBottom>
                        SecureComms
                    </Typography>


                    <Copyright />
                </Box>
                {/* End footer */}
                </ThemeProvider>
        </React.Fragment>
    );
}
