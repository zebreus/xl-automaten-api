import {
  MastermoduleStockArticle,
  apiGetMastermoduleStockArticlesResponseSchema,
  convertApiMastermoduleStockArticle,
} from "helpers/convertMastermoduleStockArticle"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

export type GetMastermoduleStockOptions = {
  /** id of the mastermodule you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get all the stock of a mastermodule
 *
 * ```typescript
 * const stock = await getMastermoduleStock({
 *   id: 133, // ID of an existing mastermodule
 *   token: "your-token",
 * })
 *
 * stock.forEach(article => console.log(article))
 * ```
 */
export const getMastermoduleStock = async (
  options: GetMastermoduleStockOptions
): Promise<Array<MastermoduleStockArticle>> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetMastermoduleStockArticlesResponseSchema },
    "GET",
    `mastermodulestock/${options.id}`
  )

  const mastermodulestock = response.map(receivedMastermodule =>
    convertApiMastermoduleStockArticle(receivedMastermodule)
  )

  return mastermodulestock
}
