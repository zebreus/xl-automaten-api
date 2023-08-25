import {
  ApiPickupItem,
  NewPickup,
  Pickup,
  apiCreatePickupResponseSchema,
  apiGetPickupResponseSchema,
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
