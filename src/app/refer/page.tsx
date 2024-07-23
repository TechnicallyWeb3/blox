"use client";

import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import axios from 'axios';

interface ReferralData {
  directReferrals: number;
  indirectReferrals: number;
  totalPoints: number;
}

export default function ReferPage() {
  const { isAuthenticated, user, primaryWallet } = useDynamicContext();
  const [referralData, setReferralData] = useState<ReferralData>({
    directReferrals: 0,
    indirectReferrals: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (isAuthenticated && user?.userId) {
        setLoading(true);

        try {
          // Fetch referral data
          const response = await axios.post('/api/referrals', { dynamic_id: user.userId });
          setReferralData(response.data);
        } catch (err) {
          console.error('Error fetching referral data:', err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReferralData();
  }, [isAuthenticated, user]);

  const handleCopyWalletAddress = () => {
    if (primaryWallet?.address) {
      navigator.clipboard.writeText(primaryWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-[#000] text-white">
      <div className="w-full max-w-5xl">
        <Header />
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {loading ? (
          <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
            <p className="text-lg">Loading...</p>
          </div>
        ) : isAuthenticated && user ? (
          <>
            <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
              <p className="text-lg font-bold mb-2">Hi! {user.firstName}</p>
              <p className="text-lg font-bold mb-2">Your Blox ID:</p>
              <p className="text-lg mb-2">{user.userId}</p>
              <p className="text-lg font-bold mb-2">Your Dynamic ID:</p>
              <p className="text-lg">{user.userId}</p>
            </div>
            <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
              <p className="text-lg font-bold mb-2">Your Wallet Address:</p>
              <p className="text-lg break-all mb-2">{primaryWallet?.address || 'Address not available'}</p>
              <button
                onClick={handleCopyWalletAddress}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {copied ? 'Copied!' : 'Copy Wallet Address'}
              </button>
            </div>
            <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
              <p className="text-lg font-bold mb-2">Your Referral Count:</p>
              <p className="text-lg mb-2">Direct Referrals: {referralData.directReferrals}</p>
              <p className="text-lg mb-2">Indirect Referrals: {referralData.indirectReferrals}</p>
              <p className="text-lg font-bold mb-2">Total Points:</p>
              <p className="text-lg">{referralData.totalPoints}</p>
            </div>
          </>
        ) : (
          <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
            <p className="text-lg font-bold">Please log in to generate a referral link.</p>
          </div>
        )}
      </div>
    </main>
  );
}