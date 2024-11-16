'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import path from 'path';
import fs from 'fs/promises';

interface Hit {
  target: string;
  approvedAddresses: string[];
  status: string;
  // Add other relevant fields
}

// Add new interface for locks data
interface Lock {
  target: string;
  proofType: string;
  amount: string;
  date: string;
  email: string;
  isGroupTarget: boolean;
  lockAmount: string;
  id: number;
  createdAt: string;
}

export default function HitlistPage() {
  const router = useRouter();
  const [hits, setHits] = useState<Hit[]>([]);
  const [activeTasks, setActiveTasks] = useState<Lock[]>([]);
  const [wastedTasks, setWastedTasks] = useState<Lock[]>([]);

  useEffect(() => {
    // Fetch hits from your smart contract
    const fetchHits = async () => {
      try {
        // Implement contract call to get hits
        // const hitsList = await contract.getHits();
        // setHits(hitsList);
      } catch (error) {
        console.error('Error fetching hits:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/locks');
        const allTasks = await response.json();
        
        const now = new Date();
        // Split tasks based on due date
        const active: Lock[] = [];
        const wasted: Lock[] = [];
        
        allTasks.forEach((task: Lock) => {
          const dueDate = new Date(task.date);
          if (dueDate > now) {
            active.push(task);
          } else {
            wasted.push(task);
          }
        });

        setActiveTasks(active);
        setWastedTasks(wasted);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchHits();
    fetchTasks();
  }, []);

  const handleUpdateProof = (taskId: number) => {
    // TODO: Implement proof update logic
    console.log('Update proof for task:', taskId);
  };

  const TaskTable = ({ tasks, isWasted = false }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="lock-don-text text-left p-4">PROOF TYPE</th>
            <th className="lock-don-text text-left p-4">TARGET</th>
            <th className="lock-don-text text-left p-4">QUANTITY</th>
            <th className="lock-don-text text-left p-4">{isWasted ? 'DONATION' : 'LOCK AMOUNT'} (ETH)</th>
            <th className="lock-don-text text-left p-4">DUE DATE</th>
            {!isWasted && <th className="lock-don-text text-left p-4">ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr 
                key={index} 
                className="border-b border-zinc-700 hover:bg-zinc-900"
              >
                <td className="p-4 text-green-500">{task.proofType}</td>
                <td className="p-4">{task.target}</td>
                <td className="p-4">{task.amount}</td>
                <td className="p-4">{task.lockAmount}</td>
                <td className="p-4">{new Date(task.date).toLocaleDateString()}</td>
                {!isWasted && (
                  <td className="p-4">
                    <button
                      onClick={() => handleUpdateProof(task.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Update Proof
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isWasted ? 5 : 6} className="p-4 text-center text-zinc-500">
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="lock-don-text text-2xl">MY HITLIST</h1>
        <button 
          className="lock-don-text text-red-600"
          onClick={() => router.push('/')}
        >
          BACK
        </button>
      </div>

      <div className="grid gap-4 mb-8">
        {hits.map((hit, index) => (
          <div 
            key={index} 
            className="border border-zinc-700 rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between">
              <span className="lock-don-text">TARGET: {hit.target}</span>
              <span className={`lock-don-text ${
                hit.status === 'active' ? 'text-green-500' : 'text-red-500'
              }`}>
                {hit.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-zinc-400">
              Approved Addresses: {hit.approvedAddresses.join(', ')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="lock-don-text text-xl mb-4">ACTIVE TASKS ({activeTasks.length})</h2>
        <TaskTable tasks={activeTasks} />
      </div>

      <div className="mt-12">
        <h2 className="lock-don-text text-xl mb-4 text-red-500">WASTED ({wastedTasks.length})</h2>
        <TaskTable tasks={wastedTasks} isWasted={true} />
      </div>
    </div>
  );
} 