"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ConnectButton, useNotification } from "web3uikit";
import { abi, contractAddresses } from "../../../contracts";
import { ethers } from "ethers";

const LotteryEntrance = () => {
  const { chainId, isWeb3Enabled } = useMoralis();
  const parsedChaindId = chainId ? parseInt(chainId) : 0;
  const dispatch = useNotification();

  const contractAddress =
    parsedChaindId in contractAddresses
      ? "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
      : "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi as Object,
    contractAddress,
    functionName: "enterRaffle",
    params: {},
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi as Object,
    contractAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi as Object,
    contractAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi as Object,
    contractAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const [entranceFee, setEntranceFee] = useState();
  const [numberOfPlayers, setNumberOfPlayers] = useState();
  const [recentWinner, setRecentWinner] = useState();
  const handleSuccess = async (tx: any) => {
    await tx.wait(1);
    handleNewNotification();
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      title: "Tx Notification",
      message: "Transaction complete",
      position: "topR",
      icon: "bell",
    });
  };

  const updateUI = async () => {
    try {
      const entranceFee = ((await getEntranceFee()) as any).toString();
      const numPlayers = ((await getNumberOfPlayers()) as any).toString();
      const recentWinner = (await getRecentWinner()) as any;
      console.log("entranceFee:", entranceFee);
      console.log("numPlayers:", numPlayers);
      console.log("recentWinner:", recentWinner);
      entranceFee && setEntranceFee(entranceFee.toString());
      numPlayers && setNumberOfPlayers(numPlayers.toString());
      recentWinner && setRecentWinner(recentWinner.toString());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isWeb3Enabled && updateUI();
  }, [isWeb3Enabled]);

  return (
    <div className="container mx-auto text-center flex flex-col gap-2">
      <div>
        Entrance Fee:{" "}
        {entranceFee && ethers.formatUnits(entranceFee as any, "ether") + "ETH"}
      </div>
      <div>Number of Players: {numberOfPlayers}</div>
      <div>Recent winner: {recentWinner}</div>

      {isLoading || isFetching ? (
        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
      ) : (
        <button
          className=" p-2 whitespace-nowrap text-black bg-slate-300 rounded-xl hover:bg-slate-300/50"
          onClick={async () => {
            try {
              await enterRaffle({
                params: {
                  msgValue: ethers.parseEther("0.1"),
                },
                onSuccess: handleSuccess,
                onError: (error) => {
                  console.log("Error details:", error);
                },
              });
            } catch (error) {
              // Log more details about the error
              console.error("Transaction failed:", error);
              if (error.reason) {
                console.error("Revert reason:", error.reason); // Check for revert reason
              }
            }
          }}
        >
          Enter raffle
        </button>
      )}
    </div>
  );
};

export default LotteryEntrance;
