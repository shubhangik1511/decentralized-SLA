import { IPasetoData } from "./classes";
import { V3 as paseto } from "paseto";
import fs from "fs";

const pasetoSecretKey =
    "/7Fu5fLp/NXNlLv/rpH52ZvtNXgorCKhHKJglUBk8PsWVnsFRXDmNMhxmGV4rG4E";

export async function generateKey() {
    const key = await paseto.generateKey("public");
    fs.writeFileSync("privateKey", paseto.keyObjectToBytes(key).toString());
}

export async function signToken(data: IPasetoData): Promise<string> {
    const privateKey = paseto.bytesToKeyObject(
        Buffer.from(pasetoSecretKey, "base64")
    );

    return paseto.sign({ data }, privateKey, {
        expiresIn: "24h",
    });
}

export async function verifyToken(token: string): Promise<IPasetoData> {
    const privateKey = paseto.bytesToKeyObject(
        Buffer.from(pasetoSecretKey, "base64")
    );
    return (await paseto.verify(token, privateKey)).data as IPasetoData;
}
