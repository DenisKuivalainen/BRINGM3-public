import { AppBar, Toolbar, SvgIcon, IconButton, Menu, MenuItem, Grid, Paper, Button, Typography } from '@material-ui/core';
import { PublicRounded, AccountCircleRounded } from '@material-ui/icons';
import { lang, styles, useClientHeight } from './styles';
import React, { useLayoutEffect, useState } from 'react';
import { compose, map, mergeAll, mergeLeft, split, test } from 'ramda';
import { useRouter } from 'next/router';
import languages from '../customization/lang.json';
import fetchApi from '../fetch';
import { mapIndexed } from 'ramda-godlike';
import { CookieContext } from '../customization/CookieContext';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../customization/theme';

const useClientWidth = () => {
    const [size, setSize] = useState(0);
    const updateSize = () => setSize(document.documentElement.clientWidth);

    // Get window size
    useLayoutEffect(() => {
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}

const Nav = ({context}) => {
    const router = useRouter();
    const language = lang(context);
    let isLoggedIn = test(/\/app/, router.pathname);

    let width = useClientWidth();

    return(
        <AppBar style={{maxWidth: "100vw"}}>
            <Toolbar style={styles.menuToolbar}>
            <IconButton onClick={() => router.push("/")} color="inherit" disableFocusRipple={true} disableRipple={true}>
                {
                    // width > 350 && <Typography variant="h6" onClick={() => router.push("/")}>{width > 400 ? "BRINGM3" : "BM3"}</Typography>
                    width > 350 && (width > 400 ?
                        <SvgIcon viewBox="0 0 303 57">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M303 5.04425H272.091L258 0V3.53094L261.475 5.54865L268.929 22.1907V29.3575L260.571 48.6628H297.857V41.3023H272.091L277.234 29.3575H291.429V23.9631L302.975 10.9533L302.862 10.8915H303V5.04425ZM298.33 10.8915L288.301 22.1907H283.195L293.755 10.8915H298.33ZM288.972 10.8915L278.412 22.1907H277.234L275.459 18.2896L282.316 10.8915H288.972ZM272.091 10.8915H277.546L273.888 14.8386L272.091 10.8915ZM292.714 57C294.845 57 296 55.645 296 53.9734C296 52.3019 294.845 50.9469 292.714 50.9469C290.584 50.9469 289.5 52.3019 289.5 53.9734C289.5 55.645 290.584 57 292.714 57ZM269 53.9734C269 55.645 268.13 57 266 57C263.87 57 263 55.645 263 53.9734C263 52.3019 263.87 50.9469 266 50.9469C268.13 50.9469 269 52.3019 269 53.9734ZM24.896 36.472C24.896 40.248 22.336 42.36 17.984 42.36H8.96001V30.328H17.792C22.144 30.328 24.896 32.632 24.896 36.472ZM23.808 17.848C23.808 21.496 21.376 23.416 17.152 23.416H8.96001V12.216H17.152C21.376 12.216 23.808 14.264 23.808 17.848ZM33.984 37.56C33.984 32.312 30.4 27.64 25.344 26.744C29.696 25.336 32.96 21.944 32.96 16.504C32.96 9.84802 27.776 4.98401 18.432 4.98401H0V49.656H19.264C28.544 49.656 33.984 44.664 33.984 37.56ZM64.805 18.872C64.805 22.904 62.565 25.528 57.573 25.528H50.085V12.408H57.573C62.565 12.408 64.805 14.904 64.805 18.872ZM54.309 32.248L64.165 49.656H74.533L63.845 31.544C71.013 29.624 74.021 24.12 74.021 18.68C74.021 11.192 68.645 4.98401 57.893 4.98401H41.125V49.656H50.085V32.248H54.309ZM134.561 35.64L114.272 4.91998H105.312V49.656H114.272V19L134.561 49.656H143.52V4.91998H134.561V35.64ZM150.199 27.256C150.199 13.88 160.055 4.40802 172.983 4.40802C182.967 4.40802 190.903 9.46399 193.783 18.424H183.479C181.431 14.648 177.719 12.664 172.983 12.664C164.983 12.664 159.415 18.36 159.415 27.256C159.415 36.344 165.047 41.976 173.367 41.976C180.279 41.976 184.695 38.008 186.039 31.672H170.679V24.824H194.871V32.632C193.079 41.72 184.951 50.04 173.047 50.04C160.055 50.04 150.199 40.632 150.199 27.256ZM210.46 20.6L222.492 49.656H229.276L241.244 20.6V49.656H250.204V4.98401H240.092L225.884 38.2L211.676 4.98401H201.5V49.656H210.46V20.6ZM95.437 49.656H86.221V11.256H80.013V3H95.437V49.656Z" />
                        </SvgIcon> :
                        <SvgIcon viewBox="0 0 140 57">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M140 5.04425H109.091L95 0V3.53094L98.4751 5.54865L105.929 22.1907V29.3575L97.5714 48.6628H134.857V41.3023H109.091L114.234 29.3575H128.429V23.9631L139.975 10.9533L139.862 10.8915H140V5.04425ZM135.33 10.8915L125.301 22.1907H120.195L130.755 10.8915H135.33ZM125.972 10.8915L115.412 22.1907H114.234L112.459 18.2896L119.316 10.8915H125.972ZM109.091 10.8915H114.546L110.888 14.8386L109.091 10.8915ZM129.714 57C131.845 57 133 55.645 133 53.9734C133 52.3019 131.845 50.9469 129.714 50.9469C127.584 50.9469 126.5 52.3019 126.5 53.9734C126.5 55.645 127.584 57 129.714 57ZM106 53.9734C106 55.645 105.13 57 103 57C100.87 57 100 55.645 100 53.9734C100 52.3019 100.87 50.9469 103 50.9469C105.13 50.9469 106 52.3019 106 53.9734ZM18.4 42.704C22.752 42.704 25.312 40.592 25.312 36.816C25.312 32.976 22.56 30.672 18.208 30.672H9.37601V42.704H18.4ZM17.568 23.76C21.792 23.76 24.224 21.84 24.224 18.192C24.224 14.608 21.792 12.56 17.568 12.56H9.37601V23.76H17.568ZM25.76 27.088C30.816 27.984 34.4 32.656 34.4 37.904C34.4 45.008 28.96 50 19.68 50H0.416V5.328H18.848C28.192 5.328 33.376 10.192 33.376 16.848C33.376 22.288 30.112 25.68 25.76 27.088ZM50.501 50H41.541V5.328H51.717L65.925 38.544L80.133 5.328H90.245V50H81.285V20.944L69.317 50H62.533L50.501 20.944V50Z" />
                        </SvgIcon>
                    )
                }
                </IconButton>
                <div style={styles.menuButtons}>
                    
                    <LangMenu router={router}/>
                    <IconButton
                        style={styles.menuIconButton}
                        aria-haspopup="true"
                        onClick={() => router.push("/auth/login")}
                        color="inherit"
                    >
                        <AccountCircleRounded/>
                    </IconButton>
                    {
                        !isLoggedIn && <Button
                            variant="outlined"
                            style={styles.menuIconButton}
                            aria-haspopup="true"
                            onClick={() => router.push("/auth/register")}
                            color="inherit"
                        >
                            {language(12)}
                        </Button>
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}

const LangMenu = (router) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (e) => setAnchorEl(e.currentTarget);
    
    const handleClose = async (e) => {
        setAnchorEl(null);
        await fetchApi(router)("/api/cookies?name=lang&value=" + e.target.id);
    }

    return(
        <>
            <IconButton
                style={styles.menuIconButton}
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <PublicRounded/>
            </IconButton>
            <Menu
                id="menu-appbar"  
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                {mapIndexed((lang, id) => LangMenuItems(id, lang.lang, handleClose), languages)}
            </Menu>
        </>
    );
}

const LangMenuItems = (id, val, handler) => (
    <MenuItem id={id} onClick={handler}>{val}</MenuItem>
)


const useCookies = () => {
    const [cookies, setCookies] = useState("");

    const parseCookies = compose(
        mergeAll,
        map(arr => {return{[arr[0]]: arr[1]}}),
        map(split("=")),
        split("; ")
    );

    setInterval(() => {
        // As next.js provides SSR, it is required to check that code
        // tryes to access document in browser
        let newCookies = process.browser ? document.cookie : "";
        newCookies !== cookies && setCookies(newCookies);
    }, 1000);

    return parseCookies(cookies);
}


const Wrapper = ({ children }) => {
    const clientHeight = useClientHeight(56);
    const cookies = useCookies();

    return (
        <CookieContext.Provider value={cookies}> 
            <ThemeProvider theme={theme(cookies)}>
                <Nav context={cookies}/>
                <Paper 
                    square
                    variant="elevation"
                    elevation={0}
                    style={mergeLeft(styles.paperContainer, {minHeight: clientHeight})}
                >
                    <Grid 
                        container 
                        spacing={1}
                        direction="column"
                        alignItems="center"
                        style={styles.gridContainer}
                    >
                        {children}
                    </Grid>
                    <div style={{height: 60}}/>
                </Paper>
            </ThemeProvider>
        </CookieContext.Provider>
    );
}

export default Wrapper;