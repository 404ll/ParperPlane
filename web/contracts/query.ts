import { isValidSuiAddress } from "@mysten/sui/utils";
import { NetworkVariables, suiClient } from "./index";
import { EventId, SuiObjectResponse } from "@mysten/sui/client";
import { categorizeSuiObjects, CategorizedObjects } from "@/utils/assetsHelpers";

export const getUserProfile = async (address: string): Promise<CategorizedObjects> => {
  if (!isValidSuiAddress(address)) {
    throw new Error("Invalid Sui address");
  }

  let hasNextPage = true;
  let nextCursor: string | null = null;
  let allObjects: SuiObjectResponse[] = [];

  while (hasNextPage) {
    const response = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showContent: true,
      },
      cursor: nextCursor,
    });

    allObjects = allObjects.concat(response.data);
    hasNextPage = response.hasNextPage;
    nextCursor = response.nextCursor ?? null;
  }
  console.log("111")
  return categorizeSuiObjects(allObjects);
};

type AirPlane = {
  name: string;
  b36addr: string;
  event_id: string;
}

export type AirPlaneFields = {
  b36addr: string;
  blobs: string[];
  content: string;
  id: {
    id: string;
  };
  name: string;
  owner: string;
}

export const getAirplanes = async (variables: NetworkVariables): Promise<AirPlaneFields[]> => {
  let hasNextPage = true;
  let nextCursor: EventId | null = null;
  let allResults: AirPlaneFields[] = [];

  while (hasNextPage) {
    // 使用 suiClient.queryEvents 查询链上事件
    // 查询 CreatedAirplaneEvent 事件,该事件在创建纸飞机时会触发
    // 通过 packageId 和事件类型来过滤事件
    const airRawPlanes = await suiClient.queryEvents({
      query: {
        MoveEventType: `${variables.packageId}::paperairplane::CreatedAirplaneEvent`
      },
      cursor: nextCursor, // 使用 cursor 进行分页查询
    })

    // 更新分页信息
    // nextCursor 用于下一页查询
    // hasNextPage 表示是否还有更多数据
    nextCursor = airRawPlanes.nextCursor ?? null;
    hasNextPage = airRawPlanes.hasNextPage;

    //解释事件数据
    const airQueryPlanes: AirPlane[] = airRawPlanes.data.map((event) => {
       // 从事件对象中提取解析后的 JSON 数据
      const { parsedJson } = event;
      // 从解析的 JSON 数据中提取飞机的名称、地址和事件 ID
      const { name, b36addr, event_id } = parsedJson as AirPlane;
      return { name, b36addr, event_id }
    })
    
    // 使用 suiClient.multiGetObjects 批量获取飞机对象
    // 通过 event_id 获取每个飞机的详细信息
    // options.showContent = true 表示返回对象的完整内容
    const airPlanes = await suiClient.multiGetObjects({
      ids: airQueryPlanes.map((plane) => plane.event_id), // 从事件中提取的飞机 ID 列表
      options: {
        showContent: true, // 返回完整的对象内容
      }
    })
    
    const result = airPlanes.map((plane) => {
      const data = plane.data?.content as unknown
      const { fields } = data as {
        fields: {
          b36addr: string
          blobs: string[]
          content: string
          id: {
            id: string
          }
          name: string
          owner: string
        }
      }
      return fields as AirPlaneFields;
    })
    // 将当前查询结果添加到总结果数组中
    // allResults 存储了所有分页查询的飞机对象
    // 使用 concat 方法将新查询的结果合并到现有结果中
    allResults = allResults.concat(result);
  }
  
  if (allResults.length === 0) {
    throw new Error("No airplanes found");
  }

  // 生成一个随机索引,范围是从0到结果数组的长度减1
  const randomIndex = Math.floor(Math.random() * allResults.length);
  return [allResults[randomIndex]];
}

