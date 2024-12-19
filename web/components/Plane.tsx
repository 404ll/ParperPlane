'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { AirPlaneFields, getAirplanes } from '@/contracts/query';
import Image from 'next/image'
import { useNetworkVariables } from '@/contracts';



// 定义 PlaneCardProps 接口
interface PlaneCardProps {
  disabled?: boolean; // 可选属性
}

export function PlaneCard({disabled }: PlaneCardProps) {
  const [planes, setAirplanes] = useState<AirPlaneFields[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const networkVariables = useNetworkVariables();


  useEffect(() => {
    getAirplanes(networkVariables).then((planes) => {
      setAirplanes(planes ?? []);
    });
  }, [networkVariables]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 在渲染之前打印 planes 确保数据正确
  console.log('Planes:', planes);

  return (
    <div className="w-full max-w-md">
      <Button onClick={toggleExpand} className="font-['DynaPuff'] w-full px-[40px] mb-4">
        {isExpanded ? 'Hide paperplane' : 'Pick up paperplane'}
      </Button>

      {/* 确保 isExpanded 为 true 且 planes 是数组时才渲染卡片 */}
      {isExpanded && planes.length > 0 ? (
        planes.map((plane: AirPlaneFields) => (
          <Card key={plane.id.id} className="w-full bg-gray-200">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium" style={{ fontFamily: 'DynaPuff' }}>name:</p>
                <p className="text-base" style={{ fontFamily: 'DynaPuff' }}>{plane.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium" style={{ fontFamily: 'DynaPuff' }}>it says...</p>
                <div className="bg-white rounded-md p-4 min-h-[100px]">
                  {plane.content}
                </div>
              </div>

              {plane.blobls && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">picture show</p>
                  <div className="bg-black text-white rounded-md overflow-hidden">
                    <Image
                      src={`https://aggregator.walrus-testnet.walrus.space/v1/${plane.blobls}`}
                      alt="Attached picture"
                      width={300}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        // 如果 planes 数组为空或 isExpanded 为 false，显示提示信息
        isExpanded && planes.length === 0 && (
          <div className="text-center text-sm text-gray-500">No planes available</div>
        )
      )}
    </div>
  );
}
