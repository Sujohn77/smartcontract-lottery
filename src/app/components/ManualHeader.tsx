"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";
import LotteryEntrance from "./LotteryEntrance";
const supportedChains = ["31337", "11155111"];

const ManualHeader = () => {
  const { enableWeb3, account, isWeb3Enabled, chainId } = useMoralis();

  useEffect(() => {
    const setupWeb3 = async () => {
      if (isWeb3Enabled) {
        await enableWeb3();
      }
    };

    setupWeb3();
  }, []);

  return (
    <div className="container max-w-[50%] mx-auto text-center flex flex-col gap-2 items-center justify-center">
      Decentralized lottery
      <ConnectButton moralisAuth={false} />
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(parseInt(chainId || "").toString()) ? (
            <div className="flex flex-row">
              <LotteryEntrance />
            </div>
          ) : (
            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
          )}
        </div>
      ) : (
        <div>Please connect to a Wallet</div>
      )}
    </div>
  );
};

export default ManualHeader;
