import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { ContextType } from "../common/contextType";
import { Service } from "typedi";
import * as auth from "./auth";
import * as enums from "../../enums";

@Service()
export class AuthChecker implements AuthCheckerInterface<ContextType> {
    async check({ context }: ResolverData<ContextType>, roles: enums.Roles[]) {
        const { token } = context;

        if (!token) {
            throw new Error("Unauthorized");
        }

        const verificationResult = await auth.verifyToken(token);
        if (verificationResult) {
            for (const checkRole of roles) {
                if (verificationResult.roles?.includes(checkRole)) {
                    return true;
                }
            }
        }

        return false;
    }
}
