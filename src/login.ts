import { z } from "zod"
import { ApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

/** Options for obtaining a new token */
export type LoginOptions = {
  /** The email of your account */
  email: string
  /** The password of your account */
  password: string
} & ApiRequestOptions

/** Response of a login request */
export type LoginResponse = {
  /** The new token */
  token: string
  /** The token type. I think it is always "bearer" */
  token_type: "bearer"
  /** The token will expire after this many seconds */
  expires_in: number
}

const loginResponseSchema: z.Schema<LoginResponse> = z.object({
  token: z.string(),
  token_type: z.literal("bearer"),
  expires_in: z.number(),
})

/** Login and obtain an API token
 *
 * ```typescript
 * const result = await login({
 *   email: "your@email.com",
 *   password: "your-password",
 * })
 *
 * const token = result.token
 * ```
 *
 * The token is usually valid for 1 hour.
 */
export const login = async (options: LoginOptions) => {
  const response = await makeApiRequest({ ...options, schema: loginResponseSchema }, "POST", "login", {
    email: options.email,
    password: options.password,
  })

  return response
}
