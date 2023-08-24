import { ApiPickupItem, Pickup, apiGetPickupResponseSchema, convertApiPickup } from "helpers/convertPickup"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

type GetPickupOptions = {
  /** Code of the pickup you want to retrieve */
  code: string
} & AuthenticatedApiRequestOptions

/** Get a pickup by its code
 *
 * ```typescript
 * const pickup = await getPickup({
 *   code: "code-of-an-existing-pickup",
 *   token: "your-token",
 * })
 *
 * console.log(pickup)
 *
 * // With getPickup, you can also get the items included in the pickup:
 * console.log(pickup.items)
 * ```
 *
 * Returns the last state of the pickup before deletion.
 */
export const getPickup = async (options: GetPickupOptions): Promise<Pickup & { items: ApiPickupItem[] }> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetPickupResponseSchema },
    "GET",
    `pickupcode/${encodeURIComponent(options.code)}`
  )

  const pickupWithoutItems = convertApiPickup(response)
  const pickup = { ...pickupWithoutItems, items: response.items }

  return pickup
}
