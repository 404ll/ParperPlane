'use client'

import { useBetterSignAndExecuteTransaction } from '@/hooks/useBetterTx';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { createAirplane } from '@/contracts/paperairplane';
import { useEffect, useState } from 'react'
import { isValidSuiAddress } from '@mysten/sui/utils';
import { useNetworkVariables } from '@/contracts';
import { AirPlaneFields, getAirplanes } from '@/contracts/query';

export default function Home() {
  const account = useCurrentAccount();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [airplanes, setAirplanes] = useState<AirPlaneFields[]>([]);
  const networkVariables = useNetworkVariables();

  const { handleSignAndExecuteTransaction} = useBetterSignAndExecuteTransaction({
    tx: createAirplane,
    onSuccess: () => {
      console.log('create airplane success');
    },
    onSettled: () => {
      console.log('create airplane settled');
    }
  });

  useEffect(() => {
    getAirplanes(networkVariables).then((airplanes) => {
      setAirplanes(airplanes ?? []);
    });
  }, [networkVariables]);

  const handleCreateAirplane = () => {
    if(!account || !isValidSuiAddress(account.address)) return;
    handleSignAndExecuteTransaction(networkVariables, {
      name: name,
      content: content,
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
        <header className='flex justify-between items-center p-12'>
            <div className='text-2xl font-bold uppercase'>PaperPlane</div>
            <div className='flex items-center gap-2'>
                <ConnectButton />
            </div>
        </header>
        <div className='flex-1 flex flex-col items-center justify-center gap-8'>
          <div className='flex flex-col gap-4 w-full max-w-md'>
            {airplanes.map((airplane) => (
              <div key={airplane.id.id}>
                <h2 className='text-2xl font-bold text-center'>{airplane.name}</h2>
                <p>{airplane.content}</p>
              </div>
            ))}
            <h2 className='text-2xl font-bold text-center'>Create Paper Airplane</h2>
            <div className='flex flex-col gap-3'>
              <input 
                type="text" 
                placeholder='Name' 
                className='w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input 
                type="text" 
                placeholder='Content' 
                className='w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button onClick={handleCreateAirplane} className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-3 transition-colors'>
                Create Airplane
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-4 w-full max-w-md'>
            <h2 className='text-2xl font-bold text-center'>Add Blob</h2>
            <div className='flex gap-3'>
              <input 
                type="text" 
                placeholder='Blob' 
                className='flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' 
              />
              <button className='bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-6 py-3 transition-colors'>
                Add
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
