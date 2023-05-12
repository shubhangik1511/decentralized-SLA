
import type { CodegenConfig } from '@graphql-codegen/cli';

/* eslint-disable @typescript-eslint/ban-types */
const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:4001/",
    documents: 'schema.gql',
    generates: {
        "./src/generated/resolvers-types.ts": {
            plugins: ["typescript", {
                add: {
                    content: "/* eslint-disable @typescript-eslint/ban-types */"
                }
            }, "typescript-resolvers"],
            config: {
                namingConvention: {
                    enumValues: 'keep'
                },
                mappers: {
                    User: './db#UserDbObject'
                }
            }
        },
        "./src/generated/db.ts": {
            plugins: [{
                add: {
                    content: "import { Maybe } from './resolvers-types'"
                }
            }, "typescript-mongodb"],
            config: {
                namingConvention: {
                    enumValues: 'keep'
                }
            }
        },
        './src/generated/api.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                fetcher: 'fetch'
            }
        },
    }
};

export default config;
