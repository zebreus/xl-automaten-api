import {
  EditablePickupItem,
  NewPickupItem,
  PickupItem,
  apiCreatePickupItemResponseSchema,
  apiDeletePickupItemResponseSchema,
  apiUpdatePickupItemResponseSchema,
  convertApiPickupItem,
  convertPickupItemToRequest,
} from "./helpers/convertPickupItem.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type CreatePickupItemOptions = {
  /** Data of the new pickupItem */
  pickupItem: NewPickupItem
} & AuthenticatedApiRequestOptions

/** Add a item to a pickup
 *
 * ```typescript
 * const pickupItem = await createPickupItem({
 *   pickupItem: {
 *     pickupId, // ID of an existing pickup
 *     articleId, // ID of an existing article
 *     overrideArticlePrice: 3, // Use this price instead of the price of the article
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(pickupitem)
 * ```
 *
 * The new pickupItem will be returned.
 */
export const createPickupItem = async (options: CreatePickupItemOptions): Promise<PickupItem> => {
  const requestBody = convertPickupItemToRequest(options.pickupItem)
  const response = await makeApiRequest(
    { ...options, schema: apiCreatePickupItemResponseSchema },
    "POST",
    "pickupcodeitem",
    requestBody
  )

  const pickupItem = convertApiPickupItem(response)

  return pickupItem
}

export type UpdatePickupItemOptions = {
  /** ID of the pickupItem */
  id: number
  /** New data
   *
   * Needs to include all fields that are required when creating a new pickupItem.
   */
  pickupItem: Required<EditablePickupItem>
} & AuthenticatedApiRequestOptions

/** Update an existing pickupItem
 *
 * ```typescript
 * const pickupItem = await updatePickupItem({
 *   id: 2000, // ID of an existing pickupItem
 *   pickupItem: {
 *     name: "New name of the pickupItem"
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(pickupitem)
 * ```
 *
 * The updated pickupItem will be returned.
 */
export const updatePickupItem = async (options: UpdatePickupItemOptions): Promise<PickupItem> => {
  const requestedChanges = options.pickupItem
  const pickupItemUpdate = { pickupId: 0, ...requestedChanges }

  const requestBody = convertPickupItemToRequest(pickupItemUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdatePickupItemResponseSchema },
    "PUT",
    `pickupcodeitem/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const pickupItem = convertApiPickupItem(response)

  return pickupItem
}

export type DeletePickupItemOptions = {
  /** ID of the pickupItem you want to delete */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a pickupItem
 *
 * ```typescript
 * const pickupItem = await deletePickupItem({
 *   id: 2000, // ID of an existing pickupItem
 *   token: "your-token",
 * })
 *
 * console.log(pickupitem)
 * ```
 *
 * The last state of the deleted pickupItem will be returned.
 */
export const deletePickupItem = async (options: DeletePickupItemOptions): Promise<PickupItem> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeletePickupItemResponseSchema },
    "DELETE",
    `pickupcodeitem/${encodeURIComponent(options.id)}`
  )

  const pickupItem = convertApiPickupItem(response)

  return pickupItem
}
