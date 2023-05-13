import { Service } from "typedi";
import { paths } from "./gatewaySchema";
import { Fetcher } from "@cuppachino/openapi-fetch";

const KALEIDO_GATEWAY_URL = process.env.KALEIDO_GATEWAY_URL;
const ETH_USER = process.env.ETH_USER;
const ETH_PASSWORD = process.env.ETH_PASSWORD;

@Service()
export class KaleidoGatewayService {
    fetcher: ReturnType<typeof Fetcher.for<paths>>;
    constructor() {
        this.fetcher = Fetcher.for<paths>();
        this.fetcher.configure({
            baseUrl: KALEIDO_GATEWAY_URL,
            init: {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        [ETH_USER, ETH_PASSWORD].join(":")
                    ).toString("base64")}`,
                },
            },
        });
    }
}
