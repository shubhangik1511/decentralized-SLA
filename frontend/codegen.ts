import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../backend/schema.gql',
  documents: 'src/**/*.gql',
  generates: {
    './src/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-query'],
      config: {
        fetcher: 'fetch'
      }
    }
  }
}

export default config
