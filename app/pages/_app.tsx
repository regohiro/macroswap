import type { AppProps } from "next/app";
import { FC, ReactNode } from "react";
import dynamic from "next/dynamic";
import Layout from "../src/components/layout/Layout";
// import store from "../src/state";
import { Provider as StateProvider } from "react-redux";
// import WalletConnectionProvider from '../src/components/WalletConnectionProvider';

require("@solana/wallet-adapter-react-ui/styles.css");
require("bootstrap/dist/css/bootstrap.min.css");
require("../styles/globals.css");

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import("../src/components/WalletConnectionProvider").then(
       WalletConnectionProvider => WalletConnectionProvider
    ),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletConnectionProvider>
  );
}

export default MyApp;
