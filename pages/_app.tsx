import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import Layout from "../components/_layout";
import Head from "next/head";
import "../styles/globals.css";
import { useState } from "react";
import Login from "../components/Login";
import { useRouter } from "next/router";
import Register from "./register";
import ForgotPassword from "./forgot-password";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [userId, setUserId] = useState<string | null>();
  const router = useRouter();

  return (
    // @ts-ignore
    <>
      <Head>
        <title>Food-Delivery</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {userId ? (
        <Layout>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your mantine theme override here */
              colorScheme: "light",
            }}
          >
            <Component {...pageProps} />
          </MantineProvider>
        </Layout>
      ) : router.pathname === "/register" ? (
        <Register />
      ) : router.pathname === "/forgot-password" ? (
        <ForgotPassword />
      ) : (
        <Login />
      )}
    </>
  );
}
