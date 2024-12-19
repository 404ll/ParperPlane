'use client'

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import Image from 'next/image';
import { CreatePlaneDialog} from '@/components/CreatePlane';
import { PlaneCard } from '@/components/Plane';
import { Card } from '@/components/ui/card';
import { useNetworkVariables } from '@/contracts';
import { useEffect, useState } from 'react';
import { AirPlaneFields, getAirplanes } from '@/contracts/query';


export default function Home() {
  const account = useCurrentAccount();
  const networkVariables = useNetworkVariables();
  const [airplanes, setAirplanes] = useState<AirPlaneFields[]>([]);
  
  
  useEffect(() => {
    getAirplanes(networkVariables).then((planes) => {
      setAirplanes(planes ?? []);
    });
  }, [networkVariables]);
  return (
    <>
      <header className='flex justify-between items-center bg-[#F0F1F5] p-6'>
        <div className='flex items-center gap-6'>
          <Image src="/logo/image_1.png" alt="Logo" width={60} height={120} />
          <div style={{ fontFamily: 'DynaPuff', fontSize: '2rem', textTransform: 'uppercase' }}>
            PaperPlane
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <ConnectButton style={{fontFamily: 'DynaPuff'}} />
        </div>
      </header>
     
      {account ? (
         <main className="container mx-auto px-4 py-8 relative min-h-screen">
           {/* 背景布局 */}
           <div className="absolute inset-0 overflow-hidden">
             <div className="absolute top-[10%] left-[5%] rotate-[-15deg]">
               <Image src="/logo/image_2.png" alt="Paper Plane" width={150} height={283} style={{opacity: 0.2}} />
             </div>
             <div className="absolute top-[30%] right-[15%] rotate-[25deg]">
               <Image src="/logo/image_2.png" alt="Paper Plane" width={120} height={226} style={{opacity: 0.15}} />
             </div>
             <div className="absolute bottom-[20%] left-[25%] rotate-[-5deg]">
               <Image src="/logo/image_2.png" alt="Paper Plane" width={180} height={339} style={{opacity: 0.25}} />
             </div>
             <div className="absolute top-[50%] right-[30%] rotate-[10deg]">
               <Image src="/logo/image_2.png" alt="Paper Plane" width={140} height={264} style={{opacity: 0.2}} />
             </div>
             <div className="absolute bottom-[10%] right-[5%] rotate-[35deg]">
               <Image src="/logo/image_2.png" alt="Paper Plane" width={160} height={302} style={{opacity: 0.15}} />
             </div>
           </div>
           
           <div className="relative z-10">
             <div className="flex justify-center items-center">
               <CreatePlaneDialog disabled={!account}/>
             </div>
             <div className="flex flex-wrap justify-center gap-6 mt-10">
              <Card className="w-[350px] p-4">
                <div className="flex flex-col items-center gap-4">
                  <Image 
                    src="/logo/image_2.png" 
                    alt="Paper Plane" 
                    width={200} 
                    height={200} 
                    className="object-contain"
                  />
                  <h2 className="text-2xl font-bold text-center font-['DynaPuff']">Paper Plane Title</h2>
                  <p className="text-center text-gray-600">Your message content goes here...</p>
                </div>
              </Card>
              {airplanes.length > 0 && <PlaneCard airplanes={airplanes} />}
             </div>
           </div>
         </main>
         ) : <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        paddingTop: '10rem'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontFamily: 'DynaPuff',
          marginBottom: '1rem' 
        }}>
          Making a paper plane to carry away your worries!
        </h2>
        <h2 style={{
          fontSize: '1.5rem',
          fontFamily: 'DynaPuff'
        }}>
          Connect wallet to get started
        </h2>
      </div>
      }
    </>
  );
}
