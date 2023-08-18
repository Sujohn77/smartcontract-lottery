"use client";

import Image from "next/image";
import { MoralisProvider } from "react-moralis";
import ManualHeader from "./components/ManualHeader";
import { NotificationProvider } from "web3uikit";
import LotteryEntrance from "./components/LotteryEntrance";

export default function Home() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <ManualHeader />
      </NotificationProvider>
    </MoralisProvider>
  );
}
