import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiXlAutomatenDatabaseObject,
} from "helpers/convertXlAutomatenDatabaseObject"
import { z } from "zod"

/** A position */
export type Position = {
  /** The ID of the tray this position belongs to.
   *
   * Not changeable after creation.
   */
  trayId: number
  /** The width of this position
   *
   * TODO: What does this mean?
   */
  width: number
  /** The number of this position
   *
   * Needs to be unique among all positions of a tray
   */
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
} & XlAutomatenDatabaseObject

/** Position, but only the fields that can be edited */
export type EditablePosition = Omit<Position, keyof XlAutomatenDatabaseObject | "trayId" | "number">

/** Data of a new position
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewPosition = Required<Pick<Position, "trayId" | "width" | "number">> & Partial<EditablePosition>

export type ApiPosition = {
  /** The ID of the tray this position belongs to.
   *
   * Not changeable after creation.
   */
  tray_id: number
  /** The width of this position
   *
   * TODO: What does this mean?
   */
  width: number
  /** The number of this position
   *
   * Needs to be unique among all positions of a tray
   */
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export const apiPositionSchema = z
  .object({
    tray_id: z.number(),
    width: z.number(),
    number: z
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
      .or(z.literal(12)),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiPositionSchema> = undefined as unknown as ApiPosition
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiPosition = undefined as unknown as z.infer<typeof apiPositionSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsRequiredForCreate = ["tray_id", "width", "number"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = ["tray_id", "number"] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = ["tray_id", "width", "number"] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Position, at least the fields are included */
export type MinimalApiPositionResponse = Required<Pick<ApiPosition, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiPosition> &
  ApiXlAutomatenDatabaseObject

export const minimalPositionResponseSchema = apiPositionSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .merge(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreatePositionRequest = Required<Pick<ApiPosition, FieldsRequiredForCreate>> & Partial<ApiPosition>
export type ApiCreatePositionResponse = MinimalApiPositionResponse

export const apiCreatePositionResponseSchema = minimalPositionResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreatePositionResponseSchema> = undefined as unknown as ApiCreatePositionResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreatePositionResponse = undefined as unknown as z.infer<typeof apiCreatePositionResponseSchema>
}

export type ApiUpdatePositionRequest = Required<
  Omit<Pick<ApiPosition, FieldsRequiredForCreate>, FieldsThatAreReadOnly>
> &
  Partial<ApiPosition>
export type ApiUpdatePositionResponse = ApiPosition & ApiXlAutomatenDatabaseObject

export const apiUpdatePositionResponseSchema = apiPositionSchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdatePositionResponseSchema> = undefined as unknown as ApiUpdatePositionResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdatePositionResponse = undefined as unknown as z.infer<typeof apiUpdatePositionResponseSchema>
}

export type ApiGetPositionRequest = void
export type ApiGetPositionResponse = ApiPosition & ApiXlAutomatenDatabaseObject

export const apiGetPositionResponseSchema = apiPositionSchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetPositionResponseSchema> = undefined as unknown as ApiGetPositionResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetPositionResponse = undefined as unknown as z.infer<typeof apiGetPositionResponseSchema>
}

export type ApiGetPositionsRequest = void
export type ApiGetPositionsResponse = Array<ApiPosition & ApiXlAutomatenDatabaseObject>

export const apiGetPositionsResponseSchema = z.array(apiPositionSchema.merge(apiXlAutomatenDatabaseObjectSchema))

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetPositionsResponseSchema> = undefined as unknown as ApiGetPositionsResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetPositionsResponse = undefined as unknown as z.infer<typeof apiGetPositionsResponseSchema>
}

export const convertApiPosition = (response: MinimalApiPositionResponse): Position => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    trayId: response.tray_id,
    width: response.width,
    number: response.number,
  } satisfies Position

  return result
}

export const convertPositionToRequest = (request: NewPosition): ApiCreatePositionRequest => {
  const result = {
    tray_id: request.trayId,
    width: request.width,
    number: request.number,
  } satisfies ApiCreatePositionRequest

  return result
}
