'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WalletButton from './ui/WalletButton';

interface LockData {
  target: string;
  proofType: string;
  amount: string;
  date: string;
  email: string;
  isGroupTarget: boolean;
  lockAmount: string;
}

export default function LockDonForm() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('newTarget'); // 'newTarget', 'groupTarget', 'setHit', 'hitlist'
  const [target, setTarget] = useState('');
  const [proofType, setProofType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [isGroupTarget, setIsGroupTarget] = useState(false);
  const [approvedAddresses, setApprovedAddresses] = useState('');
  const [lockAmount, setLockAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proofType || !amount || !date || !email || !target || !lockAmount) {
      alert('Please fill in all fields');
      return;
    }

    const lockData = {
      target,
      proofType,
      amount,
      date,
      email,
      isGroupTarget,
      lockAmount
    };

    try {
      console.log('Sending data:', lockData); // Debug log

      const response = await fetch('/api/saveLock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lockData),
      });

      const result = await response.json();
      console.log('Response:', result); // Debug log

      if (response.ok) {
        alert('Lock saved successfully!');
      } else {
        throw new Error(result.error || 'Failed to save lock');
      }

      // After successful contract interaction, save the form data
      try {
        const lockData = {
          target,
          proofType,
          amount,
          date,
          email,
          isGroupTarget,
          lockAmount,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };

        const response = await fetch('/api/locks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lockData),
        });

        if (!response.ok) {
          throw new Error('Failed to save lock data');
        }

        // Reset form or redirect as needed
        // ... your existing success handling ...

      } catch (error) {
        console.error('Error saving lock data:', error);
        // Handle error appropriately
      }
    } catch (error) {
      console.error('Error saving lock:', error);
      alert('Error saving lock. Please try again.');
    }
  };

  const renderProofInputs = () => {
    switch (proofType) {
      case 'email':
        return (
          <div className="flex gap-4">
            <input 
              type="number" 
              className="input-field" 
              placeholder="METERS"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input 
              type="date" 
              className="date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        );
      case 'website':
        return (
          <div className="flex gap-4">
            <input 
              type="number" 
              className="input-field" 
              placeholder="KG"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input 
              type="date" 
              className="date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        );
      case 'fitness':
        return (
          <div className="flex gap-4">
            <input 
              type="number" 
              className="input-field" 
              placeholder="STEPS"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input 
              type="date" 
              className="date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        );
      case 'github':
        return (
          <div className="flex gap-4">
            <input 
              type="number" 
              className="input-field" 
              placeholder="CONTRIBUTIONS"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input 
              type="date" 
              className="date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getProofLabel = () => {
    switch (proofType) {
      case 'email':
        return 'I WILL RUN..';
      case 'website':
        return 'I WILL LOOSE..';
      case 'fitness':
        return 'I WILL WALK..';
      case 'github':
        return 'I WILL COMPLETE..';
      default:
        return 'PROOF:';
    }
  };

  const handleHitlistClick = () => {
    router.push('/hitlistpage');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <div className="flex gap-4 text-center items-center">
          <button
            className={`lock-don-text text-xl ${activeSection === 'newTarget' ? 'text-red-600' : ''}`}
            onClick={() => setActiveSection('newTarget')}
          >
            NEW TARGET
          </button>
          <span className="font-['CCDeadlineDreadedOpen'] text-[2rem] text-red-600">/</span>
          <button
            className={`lock-don-text text-xl ${activeSection === 'groupTarget' ? 'text-red-600' : ''}`}
            onClick={() => setActiveSection('groupTarget')}
          >
            JOIN GROUP TARGET
          </button>
          <span className="font-['CCDeadlineDreadedOpen'] text-[2rem] text-red-600">/</span>
          <button
            className={`lock-don-text text-xl ${activeSection === 'setHit' ? 'text-red-600' : ''}`}
            onClick={() => setActiveSection('setHit')}
          >
            SET HIT
          </button>
          <span className="font-['CCDeadlineDreadedOpen'] text-[2rem] text-red-600">/</span>
          <button
            className={`lock-don-text text-xl`}
            onClick={handleHitlistClick}
          >
            MY HITLIST
          </button>
        </div>
      </div>

      {activeSection === 'newTarget' && (
        <div className="space-y-2">
          <label className="lock-don-text">TARGET</label>
          <input 
            type="text" 
            className="input-field"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      )}

      {activeSection === 'groupTarget' && (
        <div className="space-y-2">
          <label className="lock-don-text">GROUP ID</label>
          <input 
            type="text" 
            className="input-field"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      )}

      {activeSection === 'setHit' && (
        <div className="space-y-2">
          <label className="lock-don-text">APPROVED ADDRESSES</label>
          <textarea 
            className="input-field min-h-[100px]"
            value={approvedAddresses}
            onChange={(e) => setApprovedAddresses(e.target.value)}
            placeholder="Enter addresses separated by commas"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="lock-don-text">PROOF:</label>
        <div className="flex gap-2">
          <button 
            className={`input-field ${proofType === 'email' ? 'bg-red-600 text-white' : ''}`}
            onClick={() => setProofType('email')}
          >
            EMAIL
          </button>
          <button 
            className={`input-field ${proofType === 'website' ? 'bg-red-600 text-white' : ''}`}
            onClick={() => setProofType('website')}
          >
            WEBSITE
          </button>
          <button 
            className={`input-field ${proofType === 'fitness' ? 'bg-red-600 text-white' : ''}`}
            onClick={() => setProofType('fitness')}
          >
            FITNESS
          </button>
          <button 
            className={`input-field ${proofType === 'github' ? 'bg-red-600 text-white' : ''}`}
            onClick={() => setProofType('github')}
          >
            GITHUB
          </button>
        </div>
      </div>

      {proofType && (
        <div className="space-y-2">
          <label className="lock-don-text">{getProofLabel()}</label>
          {renderProofInputs()}
        </div>
      )}

      <div className="space-y-2">
        <label className="lock-don-text">EMAIL</label>
        <input 
          type="email" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          className="w-5 h-5 bg-zinc-800 border-zinc-700"
          checked={isGroupTarget}
          onChange={(e) => setIsGroupTarget(e.target.checked)}
        />
        <label className="lock-don-text">GROUP TARGET</label>
      </div>

      <div className="space-y-2">
        <label className="lock-don-text">LOCK</label>
        <input 
          type="number" 
          className="input-field" 
          placeholder="ETH"
          value={lockAmount}
          onChange={(e) => setLockAmount(e.target.value)}
        />
      </div>

      <button 
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md lock-don-text"
        onClick={handleSubmit}
      >
        LOCK DON
      </button>
    </div>
  );
} 