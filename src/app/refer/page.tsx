"use client";

import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import axios from 'axios';

export default function ReferPage() {
  const { isAuthenticated, user, primaryWallet } = useDynamicContext();
  const [bloxId, setBloxId] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [referralData, setReferralData] = useState<any>(null); // To store referral and points data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchBloxId = async () => {
      if (isAuthenticated && (user?.email || primaryWallet?.address)) {
        setLoading(true);
        setError(null);

        try {
          // Generate Blox ID
          const generateBloxResponse = await axios.post('/api/generateBloxId', {
            dynamic_id: user?.userId,
            wallet_address: primaryWallet?.address,
          });

          // Save Blox ID
          const saveBloxResponse = await axios.post('/api/saveUserId', {
            dynamic_id: user?.userId,
            blox_id: generateBloxResponse.data.blox_id,
          });

          setBloxId(saveBloxResponse.data.blox_id);
        } catch (err) {
          console.error('Error:', err.response?.data || err.message);
          setError('Failed to generate or save Blox ID.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBloxId();
  }, [isAuthenticated, user, primaryWallet]);

  useEffect(() => {
    if (isAuthenticated && user && bloxId) {
      fetchReferralData(bloxId); // Fetch referral data based on Blox ID
    }
  }, [isAuthenticated, user, bloxId]);

  const fetchReferralData = async (bloxId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/referrals/${bloxId}`);
      setReferralData(response.data);
    } catch (err) {
      setError('Error fetching referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyWalletAddress = () => {
    if (primaryWallet && primaryWallet.address) {
      navigator.clipboard.writeText(primaryWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateReferralLink = async () => {
    try {
      const response = await axios.post('/api/generateReferralLink', { bloxId });
      setReferralLink(response.data.referralLink);
    } catch (err) {
      setError('Error generating referral link');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-[#000] text-white">
      <div className="w-full max-w-5xl">
        <Header />
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {loading ? (
          <p>Loading...</p>
        ) : isAuthenticated && user ? (
          <>
            <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
              <p className="text-lg font-bold mb-2">Hi! {user.firstName}</p>
              <p className="text-lg font-bold mb-2">Your Blox ID:</p>
              <p className="text-lg mb-2">{bloxId}</p>
              <p className="text-lg font-bold mb-2">Your Dynamic ID:</p>
              <p className="text-lg">{user.userId}</p>
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
            </div>

            <div className="p-6 bg-[#333] rounded-lg shadow-main-card col-span-1 md:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="p-4 bg-[#444] rounded-lg shadow-rewards-card">
                  <p className="text-lg font-bold mb-2">Blox Referral Rewards:</p>
                  <p className="text-2xl">{referralData?.totalPoints || 0}</p>
                  <p className="text-lg font-bold mt-2">Referrals:</p>
                  <p className="text-2xl">{referralData?.directReferrals || 0}</p>
                  <p className="text-lg mt-2">Pending Referrals: {referralData?.pendingReferrals || 0}</p>
                </div>
                <div className="p-4 bg-[#444] rounded-lg lg:col-span-2 flex flex-col justify-between shadow-rewards-card">
                  <div>
                    <p className="text-lg font-bold mb-2">Tier I: Basic</p>
                    <p className="text-lg mb-2">Referrals Left To Tier II: Gold - 34</p>
                    <p className="text-lg mb-2">Points Left To Tier II: Gold - 73.44</p>
                    <p className="text-lg mb-2">Upcoming Bonus Tier II: Gold - 1,800 Points</p>
                  </div>
                  <button className="mt-4 px-4 py-2 max-w-xs bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleGenerateReferralLink}>
                    Generate Referral Link
                  </button>
                  {referralLink && (
                    <div className="mt-4">
                      <p className="text-lg font-bold mb-2">Your Referral Link:</p>
                      <p className="text-lg break-all mb-2">{referralLink}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
            <p className="text-lg font-bold">Please log in to generate a referral link.</p>
          </div>
        )}
        {error && <div className="p-6 bg-red-500 text-white rounded-lg">{error}</div>}
      </div>
    </main>
  );
}