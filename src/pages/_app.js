import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>DF Vessel Monitoring Dashboard</title>
        <meta
          name="description"
          content="Real-time monitoring dashboard for DF vessels with 2 tanks"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
