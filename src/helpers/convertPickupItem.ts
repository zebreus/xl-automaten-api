import { parseApiDate } from "helpers/apiDates"
import { z } from "zod"

export type XlAutomatenDatabaseObject = {
  /** When the data was last changed
   *
   * Precision finer than seconds is not supported and is ignored
   */
  updatedAt: Date
  /** When the data was created
   *
   * Precision finer than seconds is not supported and is ignored
   */
  createdAt: Date
  /** Internal id */
  id: number
}

/** A pickupitem */
export type PickupItem = {
  /** ID of the pickup code this item belongs to
   *
   * Can only be set during creation
   */
  pickupId: number
  /** ID of the article represented by this item */
  articleId: number
  /** Override the price specified in the associated article
   *
   * Set to 0 if the article is already paid
   *
   * Set to undefined to use the price of the associated article
   */
  overrideArticlePrice: number | undefined
  /** ID of the associated sale
   *
   * Readonly
   */
  saleId?: number
} & XlAutomatenDatabaseObject

/** PickupItem, but only the fields that can be edited */
export type EditablePickupItem = Omit<PickupItem, keyof XlAutomatenDatabaseObject | "saleId" | "pickupId">

/** Data of a new pickupitem
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewPickupItem = Required<Pick<PickupItem, "pickupId" | "articleId" | "overrideArticlePrice">> &
  Partial<EditablePickupItem>

export type ApiXlAutomatenDatabaseObject = {
  /** With seconds */
  updated_at: string
  /** With seconds */
  created_at: string
  /** Internal id */
  id: number
}

export const apiXlAutomatenDatabaseObjectSchema = z.object({
  updated_at: z.string(),
  created_at: z.string(),
  id: z.number(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiXlAutomatenDatabaseObjectSchema> = undefined as unknown as ApiXlAutomatenDatabaseObject
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiXlAutomatenDatabaseObject = undefined as unknown as z.infer<typeof apiXlAutomatenDatabaseObjectSchema>
}

export type ApiPickupItem = {
  /** ID of the pickup code this item belongs to
   *
   * Can only be set during creation
   */
  pickup_code_id: number
  /** ID of the article represented by this item */
  article_id: number
  /** TODO: Find out what this means
   *
   * Readonly
   */
  dispensed: null
  /** Override the price specified in the associated article
   *
   * 1 = Use price field of this item
   *
   * 0 = Use price of associated article
   */
  fixed_price: 0 | 1
  /** Price of this item if a fixed price is used
   *
   * Set to 0 for orders that are already paid
   */
  price: number
  /** ID of the associated sale
   *
   * Readonly
   */
  sale_id: number | null
}

export const apiPickupItemSchema = z.object({
  pickup_code_id: z.number(),
  article_id: z.number(),
  dispensed: z.null(),
  fixed_price: z.literal(0).or(z.literal(1)),
  price: z.number(),
  sale_id: z.number().nullable(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiPickupItemSchema> = undefined as unknown as ApiPickupItem
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiPickupItem = undefined as unknown as z.infer<typeof apiPickupItemSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsRequiredForCreate = ["pickup_code_id", "article_id", "price"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = ["pickup_code_id", "dispensed", "sale_id"] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = ["pickup_code_id", "article_id", "price"] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a PickupItem, at least the fields are included */
export type MinimalApiPickupItemResponse = Required<Pick<ApiPickupItem, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiPickupItem> &
  ApiXlAutomatenDatabaseObject

export const minimalPickupItemResponseSchema = apiPickupItemSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .and(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreatePickupItemRequest = Required<Pick<ApiPickupItem, FieldsRequiredForCreate>> & Partial<ApiPickupItem>
export type ApiCreatePickupItemResponse = MinimalApiPickupItemResponse

export const apiCreatePickupItemResponseSchema = minimalPickupItemResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreatePickupItemResponseSchema> = undefined as unknown as ApiCreatePickupItemResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreatePickupItemResponse = undefined as unknown as z.infer<typeof apiCreatePickupItemResponseSchema>
}

export type ApiUpdatePickupItemRequest = Required<
  Omit<Pick<ApiPickupItem, FieldsRequiredForCreate>, FieldsThatAreReadOnly>
> &
  Partial<ApiPickupItem>
export type ApiUpdatePickupItemResponse = ApiPickupItem & ApiXlAutomatenDatabaseObject

export const apiUpdatePickupItemResponseSchema = apiPickupItemSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdatePickupItemResponseSchema> = undefined as unknown as ApiUpdatePickupItemResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdatePickupItemResponse = undefined as unknown as z.infer<typeof apiUpdatePickupItemResponseSchema>
}

export type ApiDeletePickupItemRequest = void
export type ApiDeletePickupItemResponse = ApiPickupItem & ApiXlAutomatenDatabaseObject

export const apiDeletePickupItemResponseSchema = apiPickupItemSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeletePickupItemResponseSchema> = undefined as unknown as ApiDeletePickupItemResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeletePickupItemResponse = undefined as unknown as z.infer<typeof apiDeletePickupItemResponseSchema>
}

export type ApiGetPickupItemsRequest = void
export type ApiGetPickupItemsResponse = Array<ApiPickupItem & ApiXlAutomatenDatabaseObject>

export const apiGetPickupItemsResponseSchema = z.array(apiPickupItemSchema.and(apiXlAutomatenDatabaseObjectSchema))

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetPickupItemsResponseSchema> = undefined as unknown as ApiGetPickupItemsResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetPickupItemsResponse = undefined as unknown as z.infer<typeof apiGetPickupItemsResponseSchema>
}

export const convertApiPickupItem = (response: MinimalApiPickupItemResponse): PickupItem => {
  const result = {
    updatedAt: parseApiDate(response.updated_at),
    createdAt: parseApiDate(response.created_at),
    id: response.id,
    pickupId: response.pickup_code_id,
    articleId: response.article_id,
    overrideArticlePrice: response.fixed_price == 1 ? response.price : undefined,
    ...(response.sale_id != null ? { saleId: response.sale_id } : {}),
  } satisfies PickupItem

  return result
}

export const convertPickupItemToRequest = (request: NewPickupItem): ApiCreatePickupItemRequest => {
  const result = {
    pickup_code_id: request.pickupId,
    article_id: request.articleId,
    fixed_price: request.overrideArticlePrice === undefined ? 0 : 1,
    price: request.overrideArticlePrice === undefined ? 0 : request.overrideArticlePrice,
  } satisfies ApiCreatePickupItemRequest

  return result
}
