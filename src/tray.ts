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
} from "./helpers/convertTray.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type CreateTrayOptions = {
  /** Data of the new tray */
  tray: NewTray
} & AuthenticatedApiRequestOptions

/** Create a new tray for a machine
 *
 * ```typescript
 * const tray = await createTray({
 *   tray: {
 *     machineId: 10, // ID of an existing machine
 *     slot: 2, // Between 1 and 18
 *     mountingPosition: 72, // Integer up to 5 digits long
 *     type: 1,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(tray)
 * ```
 *
 * Combination of `machineId` and `slot` needs to be unique.
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

export type GetTrayOptions = {
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

export type GetTraysOptions = AuthenticatedApiRequestOptions

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

export type UpdateTrayOptions = {
  /** ID of the tray */
  id: number
  /** New data */
  tray: Partial<EditableTray>
} & AuthenticatedApiRequestOptions

/** Update an existing tray
 *
 * ```typescript
 * const tray = await updateTray({
 *   id: 2000, // ID of an existing tray
 *   tray: {
 *     machineId: 10, // ID of any machine
 *     slot: 2, // Between 1 and 18
 *     mountingPosition: 72, // Integer up to 5 digits long
 *     type: 1,
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

export type DeleteTrayOptions = {
  /** ID of the tray you want to delete */
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
