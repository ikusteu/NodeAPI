/**
 * create and export configuration variables
 *
 */

// loacal interfaces
interface EnviormentInterface {
  port: { http: number; https: number }
  envName: string
  hashingSecret: string
}

// container for all enviorments
const enviorments: Record<string, EnviormentInterface> = {
  // Staging (default) enviorment
  staging: {
    port: { http: 3000, https: 3001 },
    envName: "staging",
    hashingSecret: "This is a hashing secret",
  },
  // production enviorment
  production: {
    port: { http: 5000, https: 5001 },
    envName: "production",
    hashingSecret: "This is a hashing secret",
  },
}

// Check which env was passed as command-line argument
const currentEnviorment:
  | string
  | undefined = process.env.NODE_ENV?.toLowerCase().trim()

// Check the current enviorment exists in enviorments object else default to staging
export const enviormentToExport =
  currentEnviorment && Boolean(enviorments[currentEnviorment])
    ? enviorments[currentEnviorment]
    : enviorments["staging"]

// export hashing secret
export const hashingSecret = enviormentToExport.hashingSecret
