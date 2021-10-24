import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Layout from "../src/components/layout/Layout";
import store from "../src/state";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;