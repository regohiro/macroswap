import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";
import dynamic from "next/dynamic";
import Layout from "../src/components/layout/Layout";

require("@solana/wallet-adapter-react-ui/styles.css");
require("bootstrap/dist/css/bootstrap.min.css");
require("../styles/globals.css");

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import("../src/components/WalletConnectionProvider").then(
      (WalletConnectionProvider) => WalletConnectionProvider
    ),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <SnackbarProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SnackbarProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
