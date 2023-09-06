import { ApiMapping, Mapping, apiMappingSchema, convertApiMapping } from "helpers/convertMapping"
import {
  ApiPosition,
  MinimalApiPositionResponse,
  Position,
  apiPositionSchema,
  convertApiPosition,
} from "helpers/convertPosition"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
} from "helpers/convertXlAutomatenDatabaseObject"
import { z } from "zod"

export type PositionMapping = {
  /** The mapping that used this position */
  mapping?: Mapping
} & XlAutomatenDatabaseObject

export type ApiPositionMapping = {
  /** TODO: Find out what this means
   *
   * Seems to be always null
   */
  mapping: null | (ApiMapping & ApiXlAutomatenDatabaseObject)
}

export const apiPositionMappingSchema = z
  .object({
    mapping: apiMappingSchema.merge(apiXlAutomatenDatabaseObjectSchema).strict().nullable(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiPositionMappingSchema> = undefined as unknown as ApiPositionMapping
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiPositionMapping = undefined as unknown as z.infer<typeof apiPositionMappingSchema>
}

export type ApiDeletePositionRequest = void
export type ApiDeletePositionResponse = ApiPosition & ApiXlAutomatenDatabaseObject & ApiPositionMapping

export const apiDeletePositionResponseSchema = apiPositionSchema
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .merge(apiPositionMappingSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeletePositionResponseSchema> = undefined as unknown as ApiDeletePositionResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeletePositionResponse = undefined as unknown as z.infer<typeof apiDeletePositionResponseSchema>
}

export const convertApiPositionWithMapping = (
  response: MinimalApiPositionResponse & ApiPositionMapping
): Position & PositionMapping => {
  const position = convertApiPosition(response)
  const result = {
    ...position,
    ...(response.mapping ? { mapping: convertApiMapping(response.mapping) } : {}),
  } satisfies Position

  return result
}
