import { V3 as paseto } from "paseto";

(async () => {
    const keyStore = await paseto.generateKey("public");
    const secretKey = paseto.keyObjectToBytes(keyStore).toString('base64');
    console.log("secretKey", secretKey);
})();
