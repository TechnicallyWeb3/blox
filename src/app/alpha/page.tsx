"use client";

import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { useDynamicContext, useUserWallets, Wallet } from "@dynamic-labs/sdk-react-core";
import { WalletIcon } from "@dynamic-labs/wallet-book";
import { FiCopy } from 'react-icons/fi'; // Importing the copy icon from react-icons
import Link from "next/link";
import {
    addUser,
    setReferralCode,
    getUserData,
    getReferralData,
    getReferralCodeData,
    getPointData
} from '@/utils/Mysql';

export default function Alpha() {
    const { isAuthenticated, user } = useDynamicContext();
    const [isLoggedIn, setIsLogedIn] = useState<boolean>(false);
    //   const [bloxId, setBloxId] = useState<number | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const [userData, setUserData] = useState();
    const [referralData, setReferralData] = useState();
    const [referralCodeData, setReferralCodeData] = useState();
    const [pointsData, setPointsData] = useState();

    const tiers = [
        5000,
        10000,
        50000,
        100000,
        1000000
    ]

    const nextTier = (points: number) => {
        for (let i = 0; i < tiers.length; i++) {
            if (tiers[i] > points) return tiers[i];
        }
    }

    // // Mock data
    // const referralData = () => {
    //     return {
    //         directReferrals: 5,
    //         indirectReferrals: 10,
    //         referralCode: 'ABCD1234',
    //     };
    // }

    // const pointData = () => {
    //     return {
    //         points: 2560,
    //         nextTier: 10000,
    //         entries: [],
    //     };
    // }

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && user?.userId && !isLoggedIn) {
                setIsLogedIn(true);
                // check db for userId, if not exist then add user
                const [rows] = await getUserData(user.userId) || [];
                let dbUserData: any[] = rows ? [0] : [];
                console.log(rows);
                console.log(dbUserData);
                if (!rows?.length) {
                    try {
                        addUser(user.userId, user.userId)
                    } catch (err) {
                        console.error('Error:', err.response?.data || err.message);
                    }
                }

                dbUserData = await getUserData(user.userId) || [];
                const dbReferralData = getReferralData(user.userId);
                const dbCodeData = getReferralCodeData(user.userId);
                const dbPointData = getPointData(user.userId);

                if (dbUserData.length === 1) {

                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, user,]);

    const handleCopyWalletAddress = (text: string) => {
        navigator.clipboard.writeText(text);
        // if (!copied) navigator.clipboard.writeText(text); // change to alert 
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-10 bg-[#000] text-white">
            <div className="w-full max-w-5xl">
                <Header />
            </div>
            <h2 className="mb-3 text-4xl font-semibold">Blox Solutions User Profile</h2>
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {isAuthenticated && (user?.email || primaryWallet) ? (
                    <>
                        <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
                            <h1 className="text-lg font-bold mb-2">Hi {user?.firstName}!</h1>
                            <p className="text-lg font-bold mb-2">Check out the Blox alpha referral program! Refer friends to us and earn points!</p>
                            {/* <p className="text-lg font-bold mb-2">Your Blox ID:</p>
                            <p className="text-lg mb-2">{user?.userId}</p>
                            <p className="text-lg font-bold mb-2">Your Dynamic ID:</p>
                            <p className="text-lg">{user?.userId}</p> */}
                        </div>
                        <div className="p-6 bg-[#333] rounded-lg shadow-main-card">
                            <div className="text-lg font-bold mb-2 leading-5 grow whitespace-nowrap">
                                REFERRAL CODE
                                <div className="flex items-center mt-2">
                                    <p className="text-sm break-all ml-2">{primaryWallet?.address}</p>
                                    <FiCopy
                                        onClick={() => handleCopyWalletAddress(primaryWallet?.address || '')}
                                        className="ml-3 text-lg cursor-pointer hover:text-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="text-lg font-bold mb-2 leading-5 grow whitespace-nowrap">
                                LINKED WALLETS
                            </div>
                            <div className="text-start text-purple-400 text-sm leading-5 self-start my-auto mt-4">
                                {connectedWallets.map((wallet, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <div style={{ width: '32px', height: '32px' }}>
                                            <WalletIcon walletKey={wallet?.connector?.key} />
                                        </div>
                                        <Link legacyBehavior href={`/explorer/overview/${wallet.address}`}>
                                            <a className="text-purple-400 hover:underline ml-2">{wallet.address}</a>
                                        </Link>
                                        <FiCopy
                                            onClick={() => handleCopyWalletAddress(wallet.address)}
                                            className="ml-3 text-lg cursor-pointer hover:text-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-[#333] rounded-lg shadow-main-card col-span-1 md:col-span-2 lg:col-span-2">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="p-4 bg-[#444] rounded-lg shadow-rewards-card">
                                    <p className="text-lg font-bold mb-2">Referred Users:</p>
                                    <p className="text-lg font-bold mt-2">Direct Referrals:</p>
                                    <p className="text-2xl">{referralData.directReferrals}</p>
                                    <p className="text-lg font-bold mt-2">Indirect Referrals:</p>
                                    <p className="text-2xl">{referralData.indirectReferrals}</p>
                                    <p className="text-lg mt-2">Total Referrals: {referralData.directReferrals + referralData.indirectReferrals}</p>
                                </div>
                                <div className="p-4 bg-[#444] rounded-lg lg:col-span-2 flex flex-col justify-between shadow-rewards-card">
                                    <div>
                                        <p className="text-lg font-bold mb-2">Tier I: Basic</p>
                                        <p className="text-lg mb-2">Referrals Left To Tier II: Gold - 34</p>
                                        <p className="text-lg mb-2">Points Left To Tier II: Gold - 73.44</p>
                                        <p className="text-lg mb-2">Upcoming Bonus Tier II: Gold - 1,800 Points</p>
                                    </div>
                                    <button className="mt-4 px-4 py-2 max-w-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Claim
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-6 bg-[#333] rounded-lg shadow-main-card w-3/4">
                        <p className="text-lg font-bold">Please log in to generate a referral link.</p>
                    </div>
                )}
            </div>
        </main>
        { user.userId, user.email, user.firstName, user?.lastName, user?.username }
    );
}