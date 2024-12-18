




/*public entry fun create_airplane(airport:&mut Airport,name: String, content: String, ctx: &mut TxContext)*/

import { createBetterTxFactory } from "@/contracts";

type CreateAirplaneParams = {
    name: string,
    content: string,
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
            ],
        });
        return tx
    })

/*public entry fun add_blob(plane:&mut Airplane,blob:String,ctx: &mut TxContext)*/

export const addBlob = createBetterTxFactory<{
    blob: string,
}>((tx, networkVariables, params) => {
    tx.moveCall({
        package: networkVariables.packageId,
        module: "paperairplane",
        function: "add_blob",
        arguments: [
            tx.object(networkVariables.airportObjectId),
            tx.pure.string(params.blob),
        ],
    });
    return tx
})
