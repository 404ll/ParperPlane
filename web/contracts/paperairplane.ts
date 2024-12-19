




/*public entry fun create_airplane(airport:&mut Airport,name: String, content: String,blob:vector<String> ctx: &mut TxContext)*/

import { createBetterTxFactory } from "@/contracts";

type CreateAirplaneParams = {
    name: string,
    content: string,
    blobs: string[],
}

export const createAirplane = createBetterTxFactory<CreateAirplaneParams>(
    (tx, networkVariables, params) => {
        tx.moveCall({
            package: networkVariables.packageId,
            module: "paperairplane",
            function: "create_airplane",
            arguments: [
                tx.object(networkVariables.airportObjectId),
                tx.pure.string(params.name),
                tx.pure.string(params.content),
                tx.pure.vector("string", params.blobs)
            ],
        });
        return tx
    })


