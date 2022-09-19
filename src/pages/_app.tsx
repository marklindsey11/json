import React from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { init } from "@sentry/nextjs";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";
import GlobalStyle from "src/constants/globalStyle";
import { darkTheme, lightTheme } from "src/constants/theme";
import useConfig from "src/hooks/store/useConfig";
import useStored from "src/hooks/store/useStored";
import { ThemeProvider } from "styled-components";
import axios from "axios";
import { decompressAsync } from "lzutf8";

if (process.env.NODE_ENV !== "development") {
  init({
    dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
    tracesSampleRate: 0.5,
  });
}

function JsonCrack({ Component, pageProps }: AppProps) {
  const { query } = useRouter();
  const lightmode = useStored(state => state.lightmode);
  const setJson = useConfig(state => state.setJson);
  const [isRendered, setRendered] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!query.json) return;

      const res = await axios.get(
        `https://api.buildable.dev/@62190653596cdb0012a7f3b1/test/get-json?json=${query.json}`
      );

      const results = res.data.data;

      if (results[0] && results[0].json) {
        decompressAsync(
          results[0].json,
          {
            inputEncoding: "BinaryString",
            outputEncoding: "String",
            useWebWorker: true,
          },
          setJson
        );
      }
    })();
  }, [query.json, setJson]);

  React.useEffect(() => {
    setRendered(true);
  }, []);

  if (!isRendered) return null;

  return (
    <>
      <GoogleAnalytics />
      <ThemeProvider theme={lightmode ? lightTheme : darkTheme}>
        <GlobalStyle />
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#4D4D4D",
              color: "#B9BBBE",
            },
          }}
        />
      </ThemeProvider>
    </>
  );
}

export default JsonCrack;
