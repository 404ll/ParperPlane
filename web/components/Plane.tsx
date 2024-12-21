'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { AirPlaneFields } from '@/contracts/query';
import Image from 'next/image'


// 定义 PlaneCardProps 接口
interface PlaneCardProps {
  airplanes: AirPlaneFields[];
}

export function PlaneCard({ airplanes }: PlaneCardProps) {
 

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 添加日志输出
  console.log('Airplanes data:', airplanes.map(plane => ({
    name: plane.name,
    blobs: plane.blobs,
    content: plane.content
  })));

  return (
    <div className="w-full max-w-md">

      <Button onClick={toggleExpand} className="font-['DynaPuff'] w-full px-[40px] mb-4">
        {isExpanded ? 'Hide paperplane' : 'Pick up paperplane'}
      </Button>
      <div>
        <Image
          src={`https://aggregator.walrus-testnet.walrus.space/v1/${airplanes[0].blobs[0]}`}
          alt="Attached picture"
          width={300}
          height={300}
          className="w-full h-auto object-cover"
        />
      </div>
      {/* 确保 isExpanded 为 true 且 planes 是数组时才渲染卡片 */}
      {isExpanded && airplanes.length > 0 ? (
        airplanes.map((plane: AirPlaneFields) => (
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

              {plane.blobs && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">picture show</p>
                  <div className="bg-black text-white rounded-md overflow-hidden">
                    {plane.blobs.map((item, index) => (
                      <div key={index}>
                        <Image
                          src={`https://aggregator.walrus-testnet.walrus.space/v1/${item}`}
                          alt={`Airplane`}
                          width={300}
                          height={300}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        // 如果 planes 数组为空或 isExpanded 为 false，显示提示信息
        isExpanded && airplanes.length === 0 && (
          <div className="text-center text-sm text-gray-500">No planes available</div>
        )
      )}
    </div>
  );
}
