import { Pickup, apiCreatePickupResponseSchema, convertApiPickup } from "helpers/convertPickup"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

type DeletePickupOptions = {
  /** Code of the pickup you want to delete */
  code: string
} & AuthenticatedApiRequestOptions

/** Create a new pickup code
 *
 * ```typescript
 * const pickup = await createPickup({
 *   pickup: {
 *     code: "any-string-you-want",
 *     valid_from: new Date(),
 *     valid_until: new Date(Date.now() + 1000*60*60*24),
 *     mastermoduleId: 99,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(pickup)
 * ```
 *
 * The mastermoduleId is the ID of the vending machine that the pickup is for.
 *
 * The new pickup will be returned.
 */
export const deletePickup = async (options: DeletePickupOptions): Promise<Pickup> => {
  const response = await makeApiRequest(
    { ...options, schema: apiCreatePickupResponseSchema },
    "DELETE",
    `pickupcode/${encodeURIComponent(options.code)}`
  )

  const pickup = convertApiPickup(response)

  return pickup
}
