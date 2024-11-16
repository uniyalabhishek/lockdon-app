'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function WalletButton() {
  const { login, logout, authenticated, user } = usePrivy();

  return (
    <button
      onClick={authenticated ? logout : login}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 lock-don-text"
    >
      {authenticated ? `${user?.wallet?.address?.slice(0, 6)}...${user?.wallet?.address?.slice(-4)}` : 'CONNECT WALLET'}
    </button>
  );
}