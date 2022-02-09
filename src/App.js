import React, { useState, useEffect, useMemo } from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import web3 from "./ethereum/web3";
import Web3Modal from "web3modal";
import Footer from "./components/Footer/Footer";
import * as UAuthWeb3Modal from "@uauth/web3modal";
import UAuthSPA from "@uauth/js";
import WalletConnectProvider from "@walletconnect/web3-provider";

// These options are used to construct the UAuthSPA instance.
export const uauthOptions = {
  clientID: `${process.env.REACT_APP_UD_CLIENT_ID}`,
  clientSecret: `${process.env.REACT_APP_UD_CLIENT_SECRET}`,
  redirectUri: "https://friendschain.xyz/callback",

  // Must include both the openid and wallet scopes.
  scope: "openid wallet email",
};

const providerOptions = {
  "custom-uauth": {
    // The UI Assets
    display: UAuthWeb3Modal.display,

    // The Connector
    connector: UAuthWeb3Modal.connector,

    // The SPA libary
    package: UAuthSPA,

    // The SPA libary options
    options: uauthOptions,
  },

  // For full functionality we include the walletconnect provider as well.
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: `${process.env.REACT_APP_INFURA_ID}`,
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  // disableInjectedProvider: true,
  providerOptions,
});

UAuthWeb3Modal.registerWeb3Modal(web3Modal);

let provider;

function App() {
  const [account, setaccount] = useState("");
  const [udName, setUdName] = useState("");

  useEffect(() => {
    // onConnectWallet();
  }, []);

  useEffect(() => {
    async function listenMMAccount() {
      window.ethereum.on("accountsChanged", async function (networkId) {
        // Time to reload your interface with accounts[0]!
        const account = await web3.eth.getAccounts();
        setaccount(account[0]);
        // accounts = await web3.eth.getAccounts();
        // console.log(account);
      });

      window.ethereum.on("networkChanged", function (networkId) {
        // Time to reload your interface with the new networkId
        window.location.reload();
      });
    }
    listenMMAccount();
  }, []);

  const uauth = useMemo(() => {
    console.log("New UAuth instance!");
    const { package: uauthPackage, options: uauthOptions } =
      providerOptions["custom-uauth"];
    return UAuthWeb3Modal.getUAuth(uauthPackage, uauthOptions);
  }, []);

  const onConnectWallet = async () => {
    // e.preventDefault();
    // console.log("connecting wallet...");
    // console.log("cached provider", web3Modal.cachedProvider);
    try {
      web3Modal.clearCachedProvider();
      provider = await web3Modal.connect();
      // console.log('provider: ', provider);
    } catch (err) {
      // console.log('Could not get a wallet connection', err);
      console.error(err);
      return;
    }
    web3.setProvider(provider);
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (web3Modal.cachedProvider === "custom-uauth") {
      const udname = await uauth.user();
      console.log("UAUTH Name: ", udname);
      setUdName(udname.sub);
      console.log("UDName: " + udName);
      setaccount(udname.wallet_address);
      console.log("UDName's Address: ", account);
    } else {
      setaccount(accounts[0]);
      console.log("Normal Address: ", account);
    }
    // console.log(account);
  };

  const onDisconnect = async (e) => {
    e.preventDefault();

    // console.log(
    //   "cached provider before provider.close(): ",
    //   web3Modal.cachedProvider
    // );
    // console.log("Killing the session", web3.currentProvider);
    // console.log("web3.givenProvider", web3.givenProvider);

    if (web3 && window.ethereum && window.ethereum.disconnect) {
      await window.ethereum.disconnect();
    }

    // console.log(
    //   "cached provider after provider.close(): ",
    //   web3Modal.cachedProvider
    // );

    await web3Modal.clearCachedProvider();
    // console.log("cached provider after clear: ", web3Modal.cachedProvider);
    provider = null;
    // setaccount("");
    window.location.reload(); // removing for a while
  };

  return (
    <div>
      <Header
        account={account}
        udName={udName}
        onConnectWallet={onConnectWallet}
        onDisconnect={onDisconnect}
      />
      <Switch>
        <Route exact path="/" component={() => <Home account={account} />} />
        <Route
          exact
          path="/:id"
          component={() => <Profile account={account} />}
        />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
