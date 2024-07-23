"use client";

import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { useDynamicContext, DynamicWidget, useUserWallets, Wallet, useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { WalletIcon } from "@dynamic-labs/wallet-book";
import axios from 'axios';
import Link from "next/link";

export default function PortfolioPage() {
  const { isAuthenticated, user, primaryWallet } = useDynamicContext();
  const connectedWallets: Wallet = useUserWallets();
  const { tokenBalances, isLoading, isError, error } = useTokenBalances();

  const [bloxId, setBloxId] = useState<number | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchBloxId = async () => {
      if (isAuthenticated && (user?.email || primaryWallet?.address)) {
        setLoading(true);
        try {
          const generateBloxResponse = await axios.post('/api/generateBloxId', {
            dynamic_id: user?.userId,
            wallet_address: primaryWallet?.address,
          });
          const saveBloxResponse = await axios.post('/api/saveUserId', {
            dynamic_id: user?.userId,
            blox_id: generateBloxResponse.data.blox_id,
          });
          setBloxId(saveBloxResponse.data.blox_id);
        } catch (err) {
          console.error('Error:', err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBloxId();
  }, [isAuthenticated, user, primaryWallet]);

  const handleCopyWalletAddress = () => {
    if (primaryWallet && primaryWallet.address) {
      navigator.clipboard.writeText(primaryWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  function getPoints() {
    const AUTH_PTS = isAuthenticated ? 20 : 0;
    const LINK_PTS = connectedWallets.length * 50;
    const PHONE_PTS = user?.phoneNumber ? 50 : 0;
    return AUTH_PTS + LINK_PTS + PHONE_PTS;
  }

  const totalBalance = tokenBalances ? tokenBalances.reduce((sum, token) => sum + token.balance, 0) : 0;

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-[#000] text-white">
      <div className="w-full max-w-5xl">
        <Header />
      </div>
      <h2 className="mb-3 text-4xl font-semibold">Blox Solutions User Portfolio</h2>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {isAuthenticated && (user?.email || primaryWallet) ? (
          <>
            <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
              <p className="text-lg font-bold mb-2">Hi! {user?.username}</p>
              <p className="text-lg font-bold mb-2">Your Blox ID:</p>
              <p className="text-lg mb-2">{user?.userId}</p>
              <br />
              <p className="text-lg font-bold mt-4">Total Portfolio Balance:</p>
              <p className="text-2xl">{totalBalance}</p>
<br />
              <p className="text-lg font-bold mb-2">Wallet Balances:</p>
              {isLoading ? (
                <p>Loading balances...</p>
              ) : isError ? (
                <p>Error: {error?.message}</p>
              ) : tokenBalances && tokenBalances.length > 0 ? (
                tokenBalances.map((token) => (
                  <p key={token.address} className="text-lg mb-2">
                    {token.name} ({token.symbol}): {token.balance} (Network ID: {token.networkId})
                  </p>
                ))
              ) : (
                <p>No token balances available</p>
              )}
<br />
<br />
              <span>
                <div className="text-sky-200 text-sm leading-5 grow whitespace-nowrap">
                  POINTS
                </div>
              </span>
              <span style={{ color: '#7DF9FF' }} className="text-6xl self-center">
                {getPoints()}
              </span>
            </div>
            <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
              <p className="text-lg font-bold mb-2">Your Wallet Address:</p>
              <p className="text-lg break-all mb-2">{primaryWallet?.address}</p>
              <button
                onClick={handleCopyWalletAddress}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {copied ? 'Copied!' : 'Copy Wallet Address'}
              </button>
              <br /> <br />
              <span className="items-stretch flex justify-between gap-2 self-center">
                <div className="text-sky-200 text-sm leading-5 grow whitespace-nowrap">
                  LINKED WALLETS
                </div>
              </span>
              <br />
              <div className="text-start text-purple-400 text-sm leading-5 self-start my-auto">
                {connectedWallets.map((wallet, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div style={{ width: '32px', height: '32px' }}>
                      <WalletIcon walletKey={wallet?.connector?.key} />
                    </div>
                    <Link legacyBehavior href={`/explorer/overview/${wallet.address}`}>
                      <a className="text-purple-400 hover:underline ml-2">{wallet.address}</a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-[#333] rounded-lg shadow-main-card col-span-1 md:col-span-2 lg:col-span-2">
              {/* Insert code here */}
            </div>
          </>
        ) : (
          <div className="p-6 bg-[#333] rounded-lg shadow-main-card w-3/4">
            <p className="text-lg font-bold">Please log in to view your profile.</p>
          </div>
        )}
      </div>
    </main>
  );
}