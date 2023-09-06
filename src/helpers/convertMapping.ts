import { ApiArticle, Article, apiArticleSchema, convertApiArticle } from "helpers/convertArticle"
import { ApiMachine, Machine, apiMachineSchema, convertApiMachine } from "helpers/convertMachine"
import { ApiPosition, Position, apiPositionSchema, convertApiPosition } from "helpers/convertPosition"
import { ApiTray, Tray, apiTraySchema, convertApiTray } from "helpers/convertTray"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiXlAutomatenDatabaseObject,
} from "helpers/convertXlAutomatenDatabaseObject"
import { z } from "zod"

/** A mapping */
export type Mapping = {
  /** ID of the mapped article */
  articleId: number
  /** ID of the position the article will be mapped to */
  positionId: number
  /** How many articles are currently in store */
  inventory: number
  /** TODO: Figure out what this means */
  empty?: boolean
  /** TODO: Figure out what this means */
  status?: "selection_empty" | "product_not_detected"
} & XlAutomatenDatabaseObject

export type MappingPosition = {
  /** Details of the mapped position */
  position: Position & { tray: Tray & { machine: Machine } }
}

export type MappingArticle = {
  /** Details of the mapped position */
  article: Article
}

/** Mapping, but only the fields that can be edited */
export type EditableMapping = Omit<
  Mapping,
  keyof XlAutomatenDatabaseObject | "articleId" | "positionId" | "status" | "position"
>

/** Data of a new mapping
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewMapping = Required<Pick<Mapping, "articleId" | "positionId">> & Partial<EditableMapping>

export type ApiMapping = {
  /** ID of the mapped article */
  article_id: number
  /** ID of the position the article will be mapped to */
  position_id: number
  /** How many articles are currently in store */
  inventory: number | null
  /** TODO: Figure out what this means */
  empty: null | 1 | 0
  /** TODO: Figure out what this means */
  last_use: null
  /** TODO: Figure out what this means */
  status: "" | "selection_empty" | "product_not_detected" | null
}

export const apiMappingSchema = z
  .object({
    article_id: z.number(),
    position_id: z.number(),
    inventory: z.number().nullable(),
    empty: z.literal(1).or(z.literal(0)).nullable(),
    last_use: z.null(),
    status: z.enum(["", "selection_empty", "product_not_detected"]).nullable(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMappingSchema> = undefined as unknown as ApiMapping
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMapping = undefined as unknown as z.infer<typeof apiMappingSchema>
}

export type ApiMappingPosition = {
  /** Details of the mapped position */
  position: ApiPosition &
    ApiXlAutomatenDatabaseObject & {
      tray: ApiTray & ApiXlAutomatenDatabaseObject & { machine: ApiMachine & ApiXlAutomatenDatabaseObject }
    }
}

export const apiMappingPositionSchema = z
  .object({
    position: apiPositionSchema
      .merge(apiXlAutomatenDatabaseObjectSchema)
      .merge(
        z.object({
          tray: apiTraySchema
            .merge(apiXlAutomatenDatabaseObjectSchema)
            .merge(z.object({ machine: apiMachineSchema.merge(apiXlAutomatenDatabaseObjectSchema).strict() })),
        })
      )
      .strict(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMappingPositionSchema> = undefined as unknown as ApiMappingPosition
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMappingPosition = undefined as unknown as z.infer<typeof apiMappingPositionSchema>
}

export type ApiMappingArticle = {
  /** Details of the mapped article */
  article: ApiArticle & ApiXlAutomatenDatabaseObject
}

export const apiMappingArticleSchema = z
  .object({
    article: apiArticleSchema.merge(apiXlAutomatenDatabaseObjectSchema).strict(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMappingArticleSchema> = undefined as unknown as ApiMappingArticle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMappingArticle = undefined as unknown as z.infer<typeof apiMappingArticleSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsRequiredForCreate = ["article_id", "position_id"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = ["article_id", "position_id", "last_use", "status", "position"] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = [
  "article_id",
  "position_id",
  "last_use",
  "status",
  "empty",
  "inventory",
] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Mapping, at least the fields are included */
export type MinimalApiMappingResponse = Required<Pick<ApiMapping, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiMapping> &
  ApiXlAutomatenDatabaseObject

export const minimalMappingResponseSchema = apiMappingSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .strict()

export type ApiCreateMappingRequest = Required<Pick<ApiMapping, FieldsRequiredForCreate>> & Partial<ApiMapping>
export type ApiCreateMappingResponse = Array<ApiMapping & ApiXlAutomatenDatabaseObject & ApiMappingPosition>

export const apiCreateMappingResponseSchema = z.array(
  apiMappingSchema.merge(apiMappingPositionSchema).merge(apiXlAutomatenDatabaseObjectSchema).strict()
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateMappingResponseSchema> = undefined as unknown as ApiCreateMappingResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateMappingResponse = undefined as unknown as z.infer<typeof apiCreateMappingResponseSchema>
}

export type ApiUpdateMappingRequest = Required<Omit<Pick<ApiMapping, FieldsRequiredForCreate>, FieldsThatAreReadOnly>> &
  Partial<ApiMapping>
export type ApiUpdateMappingResponse = ApiMapping & ApiXlAutomatenDatabaseObject & ApiMappingArticle

export const apiUpdateMappingResponseSchema = apiMappingSchema
  .merge(apiMappingArticleSchema)
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateMappingResponseSchema> = undefined as unknown as ApiUpdateMappingResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateMappingResponse = undefined as unknown as z.infer<typeof apiUpdateMappingResponseSchema>
}

export type ApiGetMappingRequest = void
export type ApiGetMappingResponse = ApiMapping & ApiXlAutomatenDatabaseObject & ApiMappingPosition

export const apiGetMappingResponseSchema = apiMappingSchema
  .merge(apiMappingPositionSchema)
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMappingResponseSchema> = undefined as unknown as ApiGetMappingResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMappingResponse = undefined as unknown as z.infer<typeof apiGetMappingResponseSchema>
}

export type ApiDeleteMappingRequest = void
export type ApiDeleteMappingResponse = Array<ApiMapping & ApiXlAutomatenDatabaseObject & ApiMappingPosition>

export const apiDeleteMappingResponseSchema = z.array(
  apiMappingSchema.merge(apiMappingPositionSchema).merge(apiXlAutomatenDatabaseObjectSchema).strict()
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteMappingResponseSchema> = undefined as unknown as ApiDeleteMappingResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteMappingResponse = undefined as unknown as z.infer<typeof apiDeleteMappingResponseSchema>
}

export type ApiGetMappingsRequest = void
export type ApiGetMappingsResponse = Array<ApiMapping & ApiXlAutomatenDatabaseObject & ApiMappingPosition>

export const apiGetMappingsResponseSchema = z.array(
  apiMappingSchema.merge(apiMappingPositionSchema).merge(apiXlAutomatenDatabaseObjectSchema).strict()
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMappingsResponseSchema> = undefined as unknown as ApiGetMappingsResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMappingsResponse = undefined as unknown as z.infer<typeof apiGetMappingsResponseSchema>
}

export const convertApiMapping = (response: MinimalApiMappingResponse): Mapping => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    articleId: response.article_id,
    positionId: response.position_id,
    inventory: response.inventory ?? 0,
    ...(response.empty != null ? { empty: response.empty === 1 } : {}),
    ...(response.status ? { status: response.status } : {}),
  } satisfies Mapping

  return result
}

export const convertApiMappingWithPosition = (
  response: MinimalApiMappingResponse & ApiMappingPosition
): Mapping & MappingPosition => {
  const machine = convertApiMachine(response.position.tray.machine)
  const tray = { ...convertApiTray(response.position.tray), machine }
  const position = { ...convertApiPosition(response.position), tray }
  const mapping = convertApiMapping(response)
  const result = {
    ...mapping,
    position,
  } satisfies Mapping & MappingPosition

  return result
}

export const convertApiMappingWithArticle = (
  response: MinimalApiMappingResponse & ApiMappingArticle
): Mapping & MappingArticle => {
  const article = convertApiArticle(response.article)
  const mapping = convertApiMapping(response)
  const result = {
    ...mapping,
    article,
  } satisfies Mapping & MappingArticle

  return result
}

export const convertMappingToRequest = (request: NewMapping): ApiCreateMappingRequest => {
  const result = {
    article_id: request.articleId,
    position_id: request.positionId,
    ...(request.empty != null ? { empty: request.empty ? 1 : 0 } : {}),
    ...(request.inventory != null ? { inventory: request.inventory } : {}),
  } satisfies ApiCreateMappingRequest

  return result
}
