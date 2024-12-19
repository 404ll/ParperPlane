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
    const airRawPlanes = await suiClient.queryEvents({
      query: {
        MoveEventType: `${variables.packageId}::paperairplane::CreatedAirplaneEvent`
      },
      cursor: nextCursor,
    })
    console.log(airRawPlanes)
    nextCursor = airRawPlanes.nextCursor ?? null;
    hasNextPage = airRawPlanes.hasNextPage;

    const airQueryPlanes: AirPlane[] = airRawPlanes.data.map((event) => {
      const { parsedJson } = event;
      const { name, b36addr, event_id } = parsedJson as AirPlane;
      return { name, b36addr, event_id }
    })
    const airPlanes = await suiClient.multiGetObjects({
      ids: airQueryPlanes.map((plane) => plane.event_id),
      options: {
        showContent: true,
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
    console.log(`result: ${result}`)
    allResults = allResults.concat(result);
  }
  
  return allResults;
}