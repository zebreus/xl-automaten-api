import {
  Mastermodule,
  apiGetMastermodulesResponseSchema,
  convertApiMastermodule,
} from "./helpers/convertMastermodule.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type GetMastermodulesOptions = AuthenticatedApiRequestOptions

/** Get all mastermodules
 *
 * ```typescript
 * const mastermodule = await getMastermodules({
 *   token: "your-token",
 * })
 *
 * mastermodules.forEach(mastermodule => console.log(mastermodule))
 * ```
 */
export const getMastermodules = async (options: GetMastermodulesOptions): Promise<Array<Mastermodule>> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetMastermodulesResponseSchema },
    "GET",
    `mastermodules`
  )

  const mastermodules = response.map(receivedMastermodule => convertApiMastermodule(receivedMastermodule))

  return mastermodules
}
