import * as mongodb from "mongodb";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { DbService } from "../../db";
import * as utils from "../../utils";
import * as auth from "./auth";
import { Account, User } from "./classes";
import * as enums from "../../enums";
import { SignUpInput } from "./inputs";

@Service()
@Resolver(User)
export class UserResolver {
    constructor(private readonly dbService: DbService) { }

    @Authorized(enums.Roles.Admin)
    @Query((returns) => [User])
    async users(): Promise<User[]> {
        const usersCollection = this.dbService.getCollection<User>(
            enums.Collections.User
        );
        return usersCollection.find().toArray();
    }

    @Query((returns) => User)
    async user(@Arg("_id") _id: string) {
        const usersCollection = this.dbService.getCollection<User>(
            enums.Collections.User
        );
        const user = await usersCollection.findOne({ _id });

        if (!user) {
            throw new Error("Invalid user");
        }

        return user;
    }

    @Mutation((returns) => String)
    async signUp(@Arg("signUp") signUp: SignUpInput): Promise<string> {
        const accountCollection = this.dbService.getCollection<Account>(
            enums.Collections.Account
        );
        const usersCollection = this.dbService.getCollection<User>(
            enums.Collections.User
        );

        let createdUserId: string | null = null;

        await this.dbService.withTransaction(
            async (session: mongodb.ClientSession) => {
                const accountInsertResult = await accountCollection.insertOne(
                    { companyName: signUp.companyName },
                    { session }
                );

                const userInsertResult = await usersCollection.insertOne(
                    {
                        emailId: signUp.emailId,
                        firstName: signUp.firstName,
                        lastName: signUp.lastName,
                        accountId: accountInsertResult.insertedId,
                        password: utils.crypto.sha256Hash(signUp.password),
                        roles: [enums.Roles.AccountUser],
                    },
                    { session }
                );

                createdUserId = userInsertResult.insertedId;
            }
        );

        if (createdUserId === null) throw new Error("Error creating user");

        return this.login(signUp.emailId, signUp.password);
    }

    @Mutation((returns) => String)
    async login(
        @Arg("emailId") emailId: string,
        @Arg("password") password: string
    ): Promise<string> {
        const usersCollection = this.dbService.getCollection<User>(
            enums.Collections.User
        );

        const user = await usersCollection.findOne({
            emailId: emailId,
            password: utils.crypto.sha256Hash(password),
        });

        if (!user) throw new Error("Unauthorized");

        return auth.signToken({ userId: user._id, roles: user.roles });
    }
}
