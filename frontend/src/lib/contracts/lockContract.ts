import { ethers } from 'ethers';
import LockContractABI from '../../abi/LockContract.json';

// Replace with your deployed contract address from Anvil/testnet
const LOCK_CONTRACT_ADDRESS = '0x0B306BF915C4d645ff596e518fAf3F9669b97016';

export async function createLock(
  target: string,
  proofType: string,
  deadline: number,
  amount: string
) {
  try {
    if (!window.ethereum) throw new Error('No wallet found');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(
      LOCK_CONTRACT_ADDRESS,
      LockContractABI.abi,
      signer
    );

    const tx = await contract.createLock(
      target,
      proofType,
      deadline,
      { value: ethers.parseEther(amount) }
    );

    return await tx.wait();
  } catch (error) {
    console.error('Error creating lock:', error);
    throw error;
  }
}