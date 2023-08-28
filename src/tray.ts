import {
  EditableTray,
  NewTray,
  Tray,
  TrayPositions,
  apiCreateTrayResponseSchema,
  apiDeleteTrayResponseSchema,
  apiGetTrayResponseSchema,
  apiGetTraysResponseSchema,
  apiUpdateTrayResponseSchema,
  convertApiTray,
  convertApiTrayWithPositions,
  convertTrayToRequest,
} from "helpers/convertTray"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

type CreateTrayOptions = {
  /** Data of the new tray */
  tray: NewTray
} & AuthenticatedApiRequestOptions

/** Create a new tray code
 *
 * ```typescript
 * const tray = await createTray({
 *   tray: {
 *     name: "name-of-the-new-tray"
 *     number: "123456",
 *     price: 4,
 *     supplierId: supplierId,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(tray)
 * ```
 *
 * The new tray will be returned.
 */
export const createTray = async (options: CreateTrayOptions): Promise<Tray> => {
  const requestBody = convertTrayToRequest(options.tray)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateTrayResponseSchema },
    "POST",
    "tray",
    requestBody
  )

  const tray = convertApiTray(response)

  return tray
}

type GetTrayOptions = {
  /** id of the tray you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a tray by its id
 *
 * ```typescript
 * const tray = await getTray({
 *   id: 2000, // ID of an existing tray
 *   token: "your-token",
 * })
 *
 * console.log(tray)
 * ```
 */
export const getTray = async (options: GetTrayOptions): Promise<Tray> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetTrayResponseSchema },
    "GET",
    `tray/${encodeURIComponent(options.id)}`
  )

  const tray = convertApiTray(response)

  return tray
}

type GetTraysOptions = AuthenticatedApiRequestOptions

/** Get all trays
 *
 * ```typescript
 * const tray = await getTrays({
 *   token: "your-token",
 * })
 *
 * trays.forEach(tray => console.log(tray))
 * ```
 */
export const getTrays = async (options: GetTraysOptions): Promise<Array<Tray & TrayPositions>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetTraysResponseSchema }, "GET", `trays`)

  const trays = response.map(receivedTray => convertApiTrayWithPositions(receivedTray))

  return trays
}

type UpdateTrayOptions = {
  /** ID of the tray */
  id: number
  /** New data
   *
   * Needs to include all fields that are required when creating a new tray.
   */
  tray: Partial<EditableTray>
} & AuthenticatedApiRequestOptions

/** Update an existing tray
 *
 * ```typescript
 * const tray = await updateTray({
 *   id: 2000, // ID of an existing tray
 *   tray: {
 *     name: "New name of the tray"
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(tray)
 * ```
 *
 * The updated tray will be returned.
 */
export const updateTray = async (options: UpdateTrayOptions): Promise<Tray> => {
  const requestedChanges = options.tray
  const trayUpdate =
    requestedChanges.machineId != null &&
    requestedChanges.type != null &&
    requestedChanges.mountingPosition != null &&
    requestedChanges.slot != null
      ? {
          ...requestedChanges,
          machineId: requestedChanges.machineId,
          type: requestedChanges.type,
          mountingPosition: requestedChanges.mountingPosition,
          slot: requestedChanges.slot,
        }
      : { ...(await getTray({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertTrayToRequest(trayUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdateTrayResponseSchema },
    "PUT",
    `tray/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const tray = convertApiTray(response)

  return tray
}

type DeleteTrayOptions = {
  /** id of the tray you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a tray
 *
 * ```typescript
 * const tray = await deleteTray({
 *   id: 2000, // ID of an existing tray
 *   token: "your-token",
 * })
 *
 * console.log(tray)
 * ```
 *
 * The last state of the deleted tray will be returned.
 */
export const deleteTray = async (options: DeleteTrayOptions): Promise<Tray & TrayPositions> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeleteTrayResponseSchema },
    "DELETE",
    `tray/${encodeURIComponent(options.id)}`
  )

  const tray = convertApiTrayWithPositions(response)

  return tray
}
