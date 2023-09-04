import { ApiPosition, Position, apiPositionSchema, convertApiPosition } from "helpers/convertPosition"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiXlAutomatenDatabaseObject,
} from "helpers/convertXlAutomatenDatabaseObject"
import { z } from "zod"

/** A tray */
export type Tray = {
  /** ID of the machine this tray belongs to */
  machineId: number
  /** Type of this tray
   *
   * TODO: What does this mean?
   */
  type: 1 | 2 | 3
  /** TODO: What does this mean?
   *
   * An integer up to 5 digits
   */
  mountingPosition: number
  /** TODO: What does this mean?
   *
   * An integer between 1 and 18
   */
  slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
} & XlAutomatenDatabaseObject

export type TrayPositions = {
  positions: Array<Position>
}

/** Tray, but only the fields that can be edited */
export type EditableTray = Omit<Tray, keyof XlAutomatenDatabaseObject>

/** Data of a new tray
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewTray = Required<Pick<Tray, "machineId" | "type" | "mountingPosition" | "slot">> & Partial<EditableTray>

export type ApiTray = {
  /** ID of the machine this tray belongs to */
  machine_id: number
  /** Type of this tray
   *
   * TODO: What does this mean?
   */
  type: 1 | 2 | 3
  /** TODO: What does this mean?
   *
   * An integer up to 5 digits
   */
  mounting_position: number
  /** TODO: What does this mean?
   *
   * An integer between 1 and 18
   */
  slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
  /** TODO: What does this mean?
   *
   * Apparently always null
   */
  position: null
}

export const apiTraySchema = z
  .object({
    machine_id: z.number(),
    type: z.literal(1).or(z.literal(2)).or(z.literal(3)),
    mounting_position: z.number(),
    slot: z
      .literal(1)
      .or(z.literal(2))
      .or(z.literal(3))
      .or(z.literal(4))
      .or(z.literal(5))
      .or(z.literal(6))
      .or(z.literal(7))
      .or(z.literal(8))
      .or(z.literal(9))
      .or(z.literal(10))
      .or(z.literal(11))
      .or(z.literal(12))
      .or(z.literal(13))
      .or(z.literal(14))
      .or(z.literal(15))
      .or(z.literal(16))
      .or(z.literal(17))
      .or(z.literal(18)),
    position: z.null(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiTraySchema> = undefined as unknown as ApiTray
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiTray = undefined as unknown as z.infer<typeof apiTraySchema>
}

export type ApiTrayPositions = {
  /** Categories that are associated with this article */
  positions: Array<ApiPosition & ApiXlAutomatenDatabaseObject>
}

export const apiTrayPositionsSchema = z
  .object({
    positions: z.array(apiPositionSchema.merge(apiXlAutomatenDatabaseObjectSchema).strict()),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiTrayPositionsSchema> = undefined as unknown as ApiTrayPositions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiTrayPositions = undefined as unknown as z.infer<typeof apiTrayPositionsSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsRequiredForCreate = ["machine_id", "type", "slot", "mounting_position"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = [] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = ["machine_id", "type", "slot", "mounting_position"] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Tray, at least the fields are included */
export type MinimalApiTrayResponse = Required<Pick<ApiTray, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiTray> &
  ApiXlAutomatenDatabaseObject

export const minimalTrayResponseSchema = apiTraySchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .merge(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreateTrayRequest = Required<Pick<ApiTray, FieldsRequiredForCreate>> & Partial<ApiTray>
export type ApiCreateTrayResponse = MinimalApiTrayResponse

export const apiCreateTrayResponseSchema = minimalTrayResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateTrayResponseSchema> = undefined as unknown as ApiCreateTrayResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateTrayResponse = undefined as unknown as z.infer<typeof apiCreateTrayResponseSchema>
}

export type ApiUpdateTrayRequest = Required<Omit<Pick<ApiTray, FieldsRequiredForCreate>, FieldsThatAreReadOnly>> &
  Partial<ApiTray>
export type ApiUpdateTrayResponse = ApiTray & ApiXlAutomatenDatabaseObject

export const apiUpdateTrayResponseSchema = apiTraySchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateTrayResponseSchema> = undefined as unknown as ApiUpdateTrayResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateTrayResponse = undefined as unknown as z.infer<typeof apiUpdateTrayResponseSchema>
}

export type ApiGetTrayRequest = void
export type ApiGetTrayResponse = ApiTray & ApiXlAutomatenDatabaseObject

export const apiGetTrayResponseSchema = apiTraySchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetTrayResponseSchema> = undefined as unknown as ApiGetTrayResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetTrayResponse = undefined as unknown as z.infer<typeof apiGetTrayResponseSchema>
}

export type ApiDeleteTrayRequest = void
export type ApiDeleteTrayResponse = ApiTray & ApiXlAutomatenDatabaseObject & ApiTrayPositions

export const apiDeleteTrayResponseSchema = apiTraySchema
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .merge(apiTrayPositionsSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteTrayResponseSchema> = undefined as unknown as ApiDeleteTrayResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteTrayResponse = undefined as unknown as z.infer<typeof apiDeleteTrayResponseSchema>
}

export type ApiGetTraysRequest = void
export type ApiGetTraysResponse = Array<ApiTray & ApiXlAutomatenDatabaseObject & ApiTrayPositions>

export const apiGetTraysResponseSchema = z.array(
  apiTraySchema.merge(apiXlAutomatenDatabaseObjectSchema).merge(apiTrayPositionsSchema)
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetTraysResponseSchema> = undefined as unknown as ApiGetTraysResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetTraysResponse = undefined as unknown as z.infer<typeof apiGetTraysResponseSchema>
}

export function convertApiTray(response: MinimalApiTrayResponse): Tray {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    machineId: response.machine_id,
    type: response.type,
    mountingPosition: response.mounting_position,
    slot: response.slot,
  } satisfies Tray

  return result
}

export function convertApiTrayWithPositions(response: ApiTrayPositions & MinimalApiTrayResponse): Tray & TrayPositions {
  const tray = convertApiTray(response)
  const result = {
    ...tray,
    positions: response.positions.map(convertApiPosition),
  } satisfies Tray & TrayPositions

  return result
}

export const convertTrayToRequest = (request: NewTray): ApiCreateTrayRequest => {
  const result = {
    machine_id: request.machineId,
    type: request.type,
    mounting_position: request.mountingPosition,
    slot: request.slot,
  } satisfies ApiCreateTrayRequest

  return result
}
