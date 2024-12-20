'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { AirPlaneFields } from '@/contracts/query';
import Image from 'next/image'

interface PlaneCardProps {
  airplanes: AirPlaneFields[];
  onPickUp: () => void; // 传入函数
}

export function PlaneCard({ airplanes, onPickUp }: PlaneCardProps) {
  const handlePickUp = () => {
    onPickUp(); // 在点击时触发请求
  };

  return (
    <div className="flex gap-4 relative">
      <Dialog>
        {/* 使用DialogTrigger作为按钮触发器，不要在其中嵌套 <Button> */}
        <DialogTrigger asChild>
          <Button 
            className="font-['DynaPuff'] px-[40px] h-fit"
            onClick={handlePickUp}
          >
            Pick up another person's plane
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>You picked up a paper plane!</DialogTitle>
          </DialogHeader>

          <DialogDescription>
  <div className="w-full max-w-md">
    {airplanes.length > 0 ? (
      airplanes.map((plane: AirPlaneFields) => (
        <Card key={plane.id.id} className="w-full bg-gray-200 mb-4">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-sm font-medium" style={{ fontFamily: 'DynaPuff' }}>Name: {plane.name}</span>
            </div>

            {plane.blobs && plane.blobs.length > 0 && (
              <div className="space-y-1">
                <div className="bg-black text-white rounded-md overflow-hidden">
                  {plane.blobs.map((item, index) => (
                    <div key={index}>
                      <Image
                        src={`https://aggregator.walrus-testnet.walrus.space/v1/${item}`}
                        alt={`Airplane`}
                        width={240}
                        height={240}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-sm font-medium" style={{ fontFamily: 'DynaPuff' }}>It says...</span>
              <div className="bg-white rounded-md p-4 min-h-[100px]">
                {plane.content}
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <div className="text-center text-sm text-gray-500">No planes available</div>
    )}
  </div>
</DialogDescription>


        </DialogContent>
      </Dialog>
    </div>
  );
}
