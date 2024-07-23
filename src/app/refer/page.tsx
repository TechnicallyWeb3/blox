"use client";

import { useEffect, useState, useRef } from 'react';
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
    indirectReferrals: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Refs for carousel
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (isAuthenticated && user?.userId) {
        setLoading(true);
        try {
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

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
            <div className="p-6 bg-[#333] border-2 border-blue-700 rounded-lg lg:col-span-3 shadow-main-card relative">
              <button
                className="arrow arrow-left"
                onClick={() => scroll('left')}
              >
                &lt;
              </button>
              <button
                className="arrow arrow-right"
                onClick={() => scroll('right')}
              >
                &gt;
              </button>
              <div ref={carouselRef} className="carousel-container overflow-hidden">
                <div className="carousel-content">
                  <div className="p-4 bg-[#444] rounded-lg shadow-rewards-card carousel-item">
                    <p className="text-lg font-bold mb-2">Tier I: Basic</p>
                    <p className="text-lg mb-2">Referrals Left To Tier II: Gold - 34</p>
                    <p className="text-lg mb-2">Points Left To Tier II: Gold - 73.44</p>
                    <p className="text-lg mb-2">Upcoming Bonus Tier II: Gold - 1,800 Points</p>
                  </div>
                  <div className="p-4 bg-[#444] rounded-lg shadow-rewards-card carousel-item">
                    <p className="text-lg font-bold mb-2">Tier II: Basic</p>
                    <p className="text-lg mb-2">Referrals Left To Tier III: Diamond - 100</p>
                    <p className="text-lg mb-2">Points Left To Tier III: Diamond - 250.00</p>
                    <p className="text-lg mb-2">Upcoming Bonus Tier III: Diamond - 5,000 Points</p>
                  </div>
                  <div className="p-4 bg-[#444] rounded-lg shadow-rewards-card carousel-item">
                    <p className="text-lg font-bold mb-2">Tier III: Diamond</p>
                    <p className="text-lg mb-2">Referrals Left To Tier IV: Platinum - 150</p>
                    <p className="text-lg mb-2">Points Left To Tier IV: Platinum - 500.00</p>
                    <p className="text-lg mb-2">Upcoming Bonus Tier IV: Platinum - 10,000 Points</p>
                  </div>
                  <div className="p-4 bg-[#444] rounded-lg shadow-rewards-card carousel-item">
                    <p className="text-lg font-bold mb-2">Tier IV: Platinum</p>
                    <p className="text-lg mb-2">Referrals Left To Tier V: Ruby - 200</p>
                    <p className="text-lg mb-2">Points Left To Tier V: Ruby - 1,000.00</p>
                    <p className="text-lg mb-2">Upcoming Bonus Tier V: Ruby - 15,000 Points</p>
                  </div>
                  <div className="p-4 bg-[#444] rounded-lg shadow-rewards-card carousel-item">
                    <p className="text-lg font-bold mb-2">Tier V: Ruby</p>
                    <p className="text-lg mb-2">Referrals Left To Next Tier: N/A</p>
                    <p className="text-lg mb-2">Points Left To Next Tier: N/A</p>
                    <p className="text-lg mb-2">Upcoming Bonus Next Tier: N/A</p>
                  </div>
                </div>
              </div>
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