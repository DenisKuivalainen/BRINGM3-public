import Wrapper from '../src/DOM/nav'
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import '@brainhubeu/react-carousel/lib/style.css';
import '../styles/text.css';


export default function MyApp(props) {
  const { Component, pageProps } = props;

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="description" content="Description" />
            <meta name="keywords" content="Keywords" />
            <title>BRINGM3</title>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <link
                href="/icons/favicon-16x16.png"
                rel="icon"
                type="image/png"
                sizes="16x16"
            />
            <link
                href="/icons/favicon-32x32.png"
                rel="icon"
                type="image/png"
                sizes="32x32"
            />
            <meta name="theme-color" content="#000" />
        </Head>
        <Wrapper>
            <CssBaseline />
            <Component {...pageProps} />
        </Wrapper>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
