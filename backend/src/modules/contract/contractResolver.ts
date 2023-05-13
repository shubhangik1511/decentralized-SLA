import { Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { KaleidoGlobalService } from "../kaleido/kaleidoGlobalService";
import { KaleidoGatewayService } from "../kaleido/kaleidoGatewayService";

@Service()
@Resolver()
export class ContractResolver {
    constructor(
        private readonly kaleidoGlobal: KaleidoGlobalService,
        private readonly kaleidoGateway: KaleidoGatewayService
    ) {}

    @Mutation((returns) => String)
    async deployContract(): Promise<string | undefined> {
        const getConsortia = this.kaleidoGlobal.fetcher
            .path("/consortia")
            .method("get")
            .create();
        const getAllContracts = this.kaleidoGlobal.fetcher
            .path("/consortia/{consortia_id}/contracts")
            .method("get")
            .create();
        const getSpecificContract = this.kaleidoGlobal.fetcher
            .path("/consortia/{consortia_id}/contracts/{contract_id}")
            .method("get")
            .create();

        const getContractApi = this.kaleidoGateway.fetcher
            .path("/contracts/{contract_address_or_friendly_name}")
            .method("get")
            .create();

        const addNewContract = this.kaleidoGateway.fetcher
            .path("/abis")
            .method("get")
            .create();

        const getAllGatewayContracts = this.kaleidoGateway.fetcher
            .path("/contracts")
            .method("get")
            .create();

        const {
            data: [{ _id: consortiaId }],
        } = await getConsortia({});

        if (!consortiaId) throw new Error("Consortia not found");

        const {
            data: [{ _id: contractId }],
        } = await getAllContracts({
            consortia_id: consortiaId,
        });
        console.log(contractId);
        if (!contractId) throw new Error("Contract not found");

        const { data: contractApi } = await getContractApi({
            contract_address_or_friendly_name:
                "0x6a3f03dff826e0c148b71ad132f02d78ca4d67ac",
        });
        console.log("contractApi", contractApi);

        return contractApi.id;
    }
}
