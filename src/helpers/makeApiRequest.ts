import { z } from "zod"

/** Interface of a fetch function. Compatible with the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) */
export type FetchFunction = (
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<{ text: () => Promise<string>; ok: boolean; status: number; statusText: string }>

/** Basic options for every request */
export type ApiRequestOptions = {
  /** Use a custom fetch function. Defaults to the native fetch or `node-fetch` */
  fetch?: FetchFunction
  /** You need an API token for nearly all operations. You can obtain one by calling the login endpoint with your username and password. */
  token?: string
  /** The actual API endpoint root. Defaults to "https://api.XlAutomaten.com/v1/" */
  apiUrl?: string
}

/** Basic options for every request */
export type AuthenticatedApiRequestOptions = ApiRequestOptions & Required<Pick<ApiRequestOptions, "token">>

// webpackIgnore: true
const nodeFetch = "node-fetch"

const defaultFetch: FetchFunction | undefined | Promise<FetchFunction | undefined> =
  typeof fetch !== "undefined"
    ? fetch
    : typeof self === "undefined"
    ? // eslint-disable-next-line import/no-unresolved
      import(/* webpackIgnore: true */ nodeFetch).then(module => module.default).catch(() => undefined)
    : undefined

// type GetPickupCodeNotFoundError = {
//   error: "Entry for PickupCode not found"
// }
// type ErrorResponseIdAlreadyExists = {
//   /** The error message
//    *
//    * Shortened example: SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry '1EDF31xss-21' for key 'pickup_codes_code_company_id_unique'
//    */
//   message: string
//   /** Type of the serverside exception
//    *
//    * Mostly irrelevant, because it is internal
//    *
//    * Example: "Illuminate\\Database\\QueryException"
//    */
//   exception: string
//   /** The file in which the exception occurred */
//   file: string
//   /** The linenumber on which the exception occurred */
//   line: number
//   /** Serverside stacktrace */
//   trace: Array<{
//     file: string
//     line?: number
//     function?: string
//     class?: string
//     type?: string
//   }>
// }

// /** Error response type if fields are missing or the request has invalid json */
// type RequiredFieldMissingErrorResponse = {
//   code: ["The code field is required."]
//   valid_from: ["The valid from field is required."]
//   valid_until: ["The valid until field is required."]
//   mastermodule_id: ["The mastermodule id field is required."]
// }

export async function makeApiRequest<ExpectedResponse>(
  {
    fetch: passedFetchFunction,
    token,
    apiUrl = "https://xlapi.xl-automaten.com/v1/",
    schema,
  }: ApiRequestOptions & { schema?: z.Schema<ExpectedResponse> },
  method: "POST" | "GET" | "DELETE" | "PUT",
  endpoint: string,
  content?: Record<string, unknown>
) {
  const url = `${apiUrl}${endpoint}`
  const body = (method === "POST" || method === "PUT") && content ? JSON.stringify(content) : null
  // if ((method === "POST" || method === "PUT" || method === "DELETE") && !endpoint.includes("login")) {
  //   throw new Error("Currently preventing writes")
  // }
  const fetchFunctionOrPromise = passedFetchFunction || defaultFetch
  const fetchFunction = await fetchFunctionOrPromise

  if (!fetchFunction) {
    throw new Error("fetch is not available. Use node >= 18 or install node-fetch")
  }

  const response = await fetchFunction(url, {
    method,
    body,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "xl-automaten-api/0.0.1",
    },
  })

  const responseText = await response.text()

  const responseJson = await (async () => JSON.parse(responseText))().catch(() => {
    throw new Error(`Request failed (${response.status}): Response is not JSON`)
  })

  if (!response.ok) {
    const detail = responseJson.error || responseJson.message
    if (typeof detail !== "string") {
      throw new Error(`Request failed (${response.status}): ${JSON.stringify(responseJson)}`)
    }
    throw new Error(`Request failed (${response.status}): ${detail}`)
  }

  if (!schema) {
    return responseJson as ExpectedResponse
  }

  const validatedResponse = schema.safeParse(responseJson)
  if (!validatedResponse.success) {
    throw new Error(`Response did not match the schema for ${endpoint}: ${JSON.stringify(validatedResponse.error)}`)
  }

  return validatedResponse.data
}
