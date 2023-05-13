import { Service } from "typedi";
import { paths } from "./globalSchema";
import { Fetcher } from "@cuppachino/openapi-fetch";
const KALEIDO_GLOBAL_API_KEY = process.env.KALEIDO_GLOBAL_API_KEY;

@Service()
export class KaleidoGlobalService {
    fetcher: ReturnType<typeof Fetcher.for<paths>>;
    constructor() {
        this.fetcher = Fetcher.for<paths>();
        this.fetcher.configure({
            baseUrl: `https://console.kaleido.io/api/v1/`,
            init: {
                headers: {
                    Authorization: `Bearer ${KALEIDO_GLOBAL_API_KEY}`,
                },
            },
        });
    }
}
