import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
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

// Images for the cards
import device from '../images/device.png';
import encrypt from '../images/encrypt.png';
import free from '../images/free.png';
import message from '../images/message.png';
import selfd from '../images/selfdestruct.png';
import twofa from '../images/2fa.png';

import logo from '../images/securecomms.png';
import navlogo from '../images/GREYsecurecomms128.png';
import footerlogo from '../images/securecomms128.png';
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
        },
        // Card colour
        CardContent: {
            main: "#282c34",
        },

    }
});

// MUI Card content
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

// MUI copywrite content
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

        // fragment is a lightweight way to group a list of child elements without adding an extra node to the DOM
        <React.Fragment>

            {/* Use the MUI theme created above*/}
            <ThemeProvider theme={themeDark}>

                {/*Set the page title and metadata using Helmet*/}
                <Helmet>
                    <title>Login - SecureComms</title>
                    <meta name="description" content="Log in to your SecureComms account and access our secure communication platform." />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta charset="UTF-8" />
                </Helmet>

            {/* Use the MUI global styles*/}
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />

            {/*CSS Baseline for consistent styling across browsers*/}
            <CssBaseline />

            {/* MUI AppBar*/}
            <AppBar
                position="static"
                color="secondary"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                {/* MUI Toolbar */}
                <Toolbar sx={{ flexWrap: 'wrap' }}>

                    {/* App logo, links to home page */}
                    <a href="/">
                        <img src={navlogo} alt="logo" className="logosize"/>
                    </a>

                    {/* MUI Typography with App name*/}
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ flexGrow: 1,
                            textDecoration: 'none',

                        }}
                        component={Link}
                    >
                        {/*SecureComms with link to home page*/}
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

                        {/*MUI Button with link to login page*/}
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
                <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>

                    {/* MUI Typography with hero unit title, App name is displayed here with Logo*/}
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >

                        {/* grid item for logo is set to 2 columns on mobile and 1 column on larger screens */}
                        <Grid item xs={2}  sm={1}>
                            {/* render the logo */}
                            <Image
                                src = {logo}
                            />
                        </Grid>

                        {/* grid item for title */}
                        <Grid item xs={12} sm={12} >

                        <Typography
                            component="h1"
                            variant="h3"
                            align="center"
                            color="text.primary"
                        >
                            {/*render the title*/}
                            SecureComms
                        </Typography>
                        </Grid>
                    </Grid>


                {/* App description*/}
                <Typography variant="h5" align="center" color="text.primary" paragraph paddingTop="10px">
                    A secure messaging service that ensures users privacy with end-to-end encryption
                </Typography>

                {/* MUI Stack for buttons */}
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    {/* button for sign up page */}
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



            {/* MUI Grid for page cards displaying app features */}
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">

                    {/* Iterate through tiers and display cards */}
                    {tiers.map((tier) => (

                        // Grid item for card
                        <Grid
                            item
                            key={tier.title}
                            xs={12}
                            sm={6}
                            md={6}
                        >
                            {/* MUI Card */}
                            <Card>
                                {/* MUI CardActionArea */}
                                <CardActionArea>
                                {/* MUI CardHeader */}
                                <CardHeader

                                    // Card title
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

                                    // Card image, displaying each feature
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

                    {/* App logo for footer */}
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

                    {/* Render MUI copyroght */}
                    <Copyright />
                </Box>
                {/* End footer */}
                </ThemeProvider>
        </React.Fragment>
    );
}
