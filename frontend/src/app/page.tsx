import Image from 'next/image';
import LockDonForm from "../components/LockDonForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-0">
        <div className="text-center mb-[-150px]">
          <img 
            src="/your-logo.svg"
            alt="Logo"
            className="w-[800px] h-[800px]"
          />
        </div>
        <div className="flex justify-center w-full">
          <LockDonForm />
        </div>
      </div>
    </main>
  );
}
