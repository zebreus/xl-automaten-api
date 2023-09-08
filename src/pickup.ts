import {
  EditablePickup,
  NewPickup,
  Pickup,
  PickupItems,
  apiCreatePickupResponseSchema,
  apiDeletePickupResponseSchema,
  apiGetPickupResponseSchema,
  apiGetPickupsResponseSchema,
  apiUpdatePickupResponseSchema,
  convertApiPickup,
  convertApiPickupWithItems,
  convertPickupToRequest,
} from "./helpers/convertPickup.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type CreatePickupOptions = {
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

export type UpdatePickupOptions = {
  /** Code of the pickup you want to update */
  code: string
  /** The fields you want to update */
  pickup: Partial<EditablePickup>
} & AuthenticatedApiRequestOptions

/** Update an existing pickup
 *
 * ```typescript
 * const pickup = await updatePickup({
 *   code: "code-of-an-existing-pickup",
 *   pickup: {
 *     callback: "https://example.com/pickup-callback",
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(pickup)
 * ```
 *
 * The updated pickup will be returned.
 */
export const updatePickup = async (options: UpdatePickupOptions): Promise<Pickup> => {
  const pickupUpdate = options.pickup
  const newPickup =
    pickupUpdate.validFrom && pickupUpdate.validUntil && pickupUpdate.mastermoduleId
      ? {
          ...pickupUpdate,
          code: options.code,
          validFrom: pickupUpdate.validFrom,
          validUntil: pickupUpdate.validUntil,
          mastermoduleId: pickupUpdate.mastermoduleId,
        }
      : { ...(await getPickup({ code: options.code, token: options.token })), ...pickupUpdate }

  const requestBody = convertPickupToRequest(newPickup)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdatePickupResponseSchema },
    "PUT",
    `pickupcode/${encodeURIComponent(options.code)}`,
    requestBody
  )

  const pickup = convertApiPickup(response)

  return pickup
}

export type DeletePickupOptions = {
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
    { ...options, schema: apiDeletePickupResponseSchema },
    "DELETE",
    `pickupcode/${encodeURIComponent(options.code)}`
  )

  const pickup = convertApiPickup(response)

  return pickup
}

export type GetPickupOptions = {
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
 * The result also includes short versions of all items included in the pickup.
 */
export const getPickup = async (options: GetPickupOptions): Promise<Pickup & PickupItems> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetPickupResponseSchema },
    "GET",
    `pickupcode/${encodeURIComponent(options.code)}`
  )

  const pickup = convertApiPickupWithItems(response)

  return pickup
}

export type GetPickupsOptions = AuthenticatedApiRequestOptions

/** Get all pickups
 *
 * ```typescript
 * const pickups = await getPickups({
 *   token: "your-token",
 * })
 *
 * pickups.forEach(pickup => console.log(pickup))
 * ```
 */
export const getPickups = async (options: GetPickupsOptions): Promise<Array<Pickup & PickupItems>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetPickupsResponseSchema }, "GET", `pickupcodes`)

  const pickups = response.map(receivedPickup => convertApiPickupWithItems(receivedPickup))

  return pickups
}
