import {
  NewPickup,
  Pickup,
  apiCreatePickupResponseSchema,
  convertApiPickup,
  convertPickupToRequest,
} from "helpers/convertPickup"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

type CreatePickupOptions = {
  /** Data of the new pickup */
  pickup: NewPickup
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
export const createPickup = async (options: CreatePickupOptions): Promise<Pickup> => {
  const requestBody = convertPickupToRequest(options.pickup)
  const response = await makeApiRequest(
    { ...options, schema: apiCreatePickupResponseSchema },
    "POST",
    "pickupcode",
    requestBody
  )

  const pickup = convertApiPickup(response)

  return pickup
}
