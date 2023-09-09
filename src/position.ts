import {
  EditablePosition,
  NewPosition,
  Position,
  apiCreatePositionResponseSchema,
  apiGetPositionResponseSchema,
  apiGetPositionsResponseSchema,
  apiUpdatePositionResponseSchema,
  convertApiPosition,
  convertPositionToRequest,
} from "./helpers/convertPosition.js"
import {
  PositionMapping,
  apiDeletePositionResponseSchema,
  convertApiPositionWithMapping,
} from "./helpers/convertPositionAvoidDependencyCycle.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type CreatePositionOptions = {
  /** Data of the new position */
  position: NewPosition
} & AuthenticatedApiRequestOptions

/** Create a new position code
 *
 * ```typescript
 * const position = await createPosition({
 *   position: {
 *     trayId: 2343,
 *     number: 2, // Combination of trayId and number must be unique
 *     width: 2,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(position)
 * ```
 *
 * The new position will be returned.
 *
 * The combination of trayId and number must be unique.
 */
export const createPosition = async (options: CreatePositionOptions): Promise<Position> => {
  const requestBody = convertPositionToRequest(options.position)
  const response = await makeApiRequest(
    { ...options, schema: apiCreatePositionResponseSchema },
    "POST",
    "position",
    requestBody
  )

  const position = convertApiPosition(response)

  return position
}

export type GetPositionOptions = {
  /** id of the position you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a position by its id
 *
 * ```typescript
 * const position = await getPosition({
 *   id: 2000, // ID of an existing position
 *   token: "your-token",
 * })
 *
 * console.log(position)
 * ```
 */
export const getPosition = async (options: GetPositionOptions): Promise<Position> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetPositionResponseSchema },
    "GET",
    `position/${encodeURIComponent(options.id)}`
  )

  const position = convertApiPosition(response)

  return position
}

export type GetPositionsOptions = AuthenticatedApiRequestOptions

/** Get all positions
 *
 * ```typescript
 * const position = await getPositions({
 *   token: "your-token",
 * })
 *
 * positions.forEach(position => console.log(position))
 * ```
 */
export const getPositions = async (options: GetPositionsOptions): Promise<Array<Position>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetPositionsResponseSchema }, "GET", `positions`)

  const positions = response.map(receivedPosition => convertApiPosition(receivedPosition))

  return positions
}

export type UpdatePositionOptions = {
  /** ID of the position */
  id: number
  /** All fields that should get updated */
  position: Partial<EditablePosition>
} & AuthenticatedApiRequestOptions

/** Update an existing position
 *
 * You can only edit the width of a position.
 *
 * ```typescript
 * const position = await updatePosition({
 *   id: 2000, // ID of an existing position
 *   position: {
 *     width: 2
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(position)
 * ```
 *
 * The updated position will be returned.
 */
export const updatePosition = async (options: UpdatePositionOptions): Promise<Position> => {
  const requestedChanges = options.position
  const positionUpdate = { ...(await getPosition({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertPositionToRequest(positionUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdatePositionResponseSchema },
    "PUT",
    `position/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const position = convertApiPosition(response)

  return position
}

export type DeletePositionOptions = {
  /** ID of the position you want to delete */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a position
 *
 * ```typescript
 * const position = await deletePosition({
 *   id: 2000, // ID of an existing position
 *   token: "your-token",
 * })
 *
 * console.log(position)
 * ```
 *
 * The last state of the deleted position will be returned.
 */
export const deletePosition = async (options: DeletePositionOptions): Promise<Position & PositionMapping> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeletePositionResponseSchema },
    "DELETE",
    `position/${encodeURIComponent(options.id)}`
  )

  const position = convertApiPositionWithMapping(response)

  return position
}

/** Calculate the name that will be displayed for this position from the trays slotId and the positions number
 *
 * ```typescript
 * const positionName = calculatePositionDisplayName(tray.slot, position.number)
 *
 * calculatePositionDisplayName(9, 1) // "122"
 * ```
 *
 * This is the name that will be displayed to users in the mastermodule UI
 */
export const calculatePositionDisplayName = (traySlot: number, positionNumber: number) => {
  const baseNumber = traySlot < 9 ? 100 * traySlot + 10 * traySlot : 100 * (traySlot - 8) + 10 * (traySlot - 7) + 2
  const positionName = baseNumber + (positionNumber - 1)
  return "" + positionName
}
