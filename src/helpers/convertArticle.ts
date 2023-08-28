import { ApiCategory, Category, apiCategorySchema, convertApiCategory } from "helpers/convertCategory"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiXlAutomatenDatabaseObject,
} from "helpers/convertXlAutomatenDatabaseObject"
import { z } from "zod"

/** A article */
export type Article = {
  /** TODO: Figure out what this means */
  number: string
  /** TODO: Figure out what this means */
  orderNumber?: string
  /** Name of the article */
  name: string
  /** Description of the article
   *
   * Can contain HTML
   */
  description?: string
  /** URL to an image for the article
   *
   * Cannot be set
   *
   * TODO: Find out how to set this
   */
  image?: string
  /** URL of a preview image for the article
   *
   * TODO: Find out how to set this
   */
  previewImage?: string
  /** ID for some kind of supplier
   *
   * TODO: Figure out what this means
   * */
  supplierId: number
  /** Price of the article
   */
  price: number
  /** TODO: Figure out what this means */
  price2?: number
  /** TODO: Figure out what this means */
  price3?: number
  /** TODO: Figure out what this means */
  price4?: number
  /** TODO: Figure out what this means */
  liftDistancePusher?: number
  /** TODO: Figure out what this means */
  liftDistanceSpiral?: number
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  pushable: boolean
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  spiralable: boolean
  /** TODO: Figure out what this means
   *
   * Default: true
   */
  spiralAsPusher: boolean // Default: 1
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  blocked: boolean
  /** TODO: Figure out what this means
   *
   * Default: true
   */
  photocell: boolean
  /** TODO: Figure out what this means
   *
   * Default: true
   */
  doubleTurn: boolean
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  sellOnTempStop: boolean
  /** TODO: Figure out what this means
   *
   * Default: 0
   */
  overPush: number
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  ageControl: boolean
  /** Probably the tax rate, idk
   *
   * Default: "19.00"
   */
  taxRate: string
  /** TODO: Figure out what this means */
  code?: number
  /** TODO: Figure out what this means */
  maxFillingLevel?: number
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  roll: boolean
  /** TODO: Figure out what this means */
  priority: number
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  archived: boolean
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  virtual: boolean
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  topUp: boolean
  /** TODO: Figure out what this means
   *
   * Default: 0
   */
  bonusAmount: number
  /** TODO: Figure out what this means */
  internalPrice?: number
  /** TODO: Figure out what this means
   *
   * Default: 0
   */
  spiralAdditionalTurnTime: number
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  isHandover: boolean
  /** TODO: Figure out what this means
   *
   * Default: false
   */
  isLend: boolean
  /** TODO: Figure out what this means */
  activeLendings: Array<never>
} & XlAutomatenDatabaseObject

export type ArticleExtraFields = {
  /** Mastermodules that are associated with this article */
  mastermodules: Array<never>
  /** Tags that are associated with this article */
  tags: Array<never>
}

export type ArticleCategories = {
  categories: Array<
    Category & {
      pivot: { categorizableId: number; categorizableType: "App\\Article" }
    }
  >
}

/** Article, but only the fields that can be edited */
export type EditableArticle = Omit<Article, "archived" | keyof XlAutomatenDatabaseObject>

/** Data of a new article
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewArticle = Required<Pick<Article, "number" | "name" | "price" | "supplierId">> & Partial<EditableArticle>

export type ApiArticle = {
  /** ID of the article */
  id: number
  /** TODO: Figure out what this means */
  number: string
  /** TODO: Figure out what this means */
  order_number: string | null
  /** Name of the article */
  name: string
  /** Description of the article
   *
   * Can contain HTML
   */
  description: string | null
  /** URL of an image for the article
   *
   * TODO: Find out how to set this
   */
  main_img: string | null
  /** URL of a preview image for the article
   *
   * TODO: Find out how to set this
   */
  preview_img: string | null
  /** ID for some kind of supplier
   *
   * Needs to be set
   *
   * TODO: Figure out what this means
   * */
  supplier_id: number
  /** Price of the article
   *
   * TODO: Figure out what this means
   */
  price: number
  /** TODO: Figure out what this means */
  price2: number | null
  /** TODO: Figure out what this means */
  price3: number | null
  /** TODO: Figure out what this means */
  price4: number | null
  /** TODO: Figure out what this means */
  lift_distance_pusher: number | null
  /** TODO: Figure out what this means */
  lift_distance_spiral: number | null
  /** TODO: Figure out what this means */
  push_able: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  spiral_able: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  spiral_as_pusher: 0 | 1 // Default: 1
  /** TODO: Figure out what this means */
  blocked: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  photocell: 0 | 1 // Default: 1
  /** TODO: Figure out what this means */
  double_turn: 0 | 1 // Default: 1
  /** TODO: Figure out what this means */
  sell_on_temp_stop: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  over_push: number // Default: 0
  /** TODO: Figure out what this means */
  deleted_at: null
  /** TODO: Figure out what this means */
  age_control: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  attributes: null
  /** Probably the tax rate, IDK */
  tax_rate: string
  /** TODO: Figure out what this means */
  code: number | null
  /** TODO: Figure out what this means */
  max_filling_level: number | null
  /** TODO: Figure out what this means */
  roll: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  priority: number
  /** TODO: Figure out what this means */
  archived: 0 | 1 | true // Default: 0
  /** TODO: Figure out what this means */
  is_virtual: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  is_top_up: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  bonus_amount: number
  /** TODO: Figure out what this means */
  internal_price: number | null
  /** TODO: Figure out what this means */
  spiral_additional_turn_time: number
  /** TODO: Figure out what this means */
  is_handover: 0 | 1 // Default: 0
  /** TODO: Figure out what this means */
  is_lend: boolean
  /** TODO: Figure out what this means */
  lend_data: null
  /** TODO: Figure out what this means */
  active_lendings: Array<never>
}

export const apiArticleSchema = z.object({
  id: z.number(),
  number: z.string(),
  order_number: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  main_img: z.string().nullable(),
  preview_img: z.string().nullable(),
  supplier_id: z.number(),
  price: z.number(),
  price2: z.number().nullable(),
  price3: z.number().nullable(),
  price4: z.number().nullable(),
  lift_distance_pusher: z.number().nullable(),
  lift_distance_spiral: z.number().nullable(),
  push_able: z.literal(0).or(z.literal(1)),
  spiral_able: z.literal(0).or(z.literal(1)),
  spiral_as_pusher: z.literal(0).or(z.literal(1)),
  blocked: z.literal(0).or(z.literal(1)),
  photocell: z.literal(0).or(z.literal(1)),
  double_turn: z.literal(0).or(z.literal(1)),
  sell_on_temp_stop: z.literal(0).or(z.literal(1)),
  over_push: z.number(),
  deleted_at: z.null(),
  age_control: z.literal(0).or(z.literal(1)),
  attributes: z.null(),
  tax_rate: z.string(),
  code: z.number().nullable(),
  max_filling_level: z.number().nullable(),
  roll: z.literal(0).or(z.literal(1)),
  priority: z.number(),
  archived: z.literal(0).or(z.literal(1)).or(z.literal(true)),
  is_virtual: z.literal(0).or(z.literal(1)),
  is_top_up: z.literal(0).or(z.literal(1)),
  bonus_amount: z.number(),
  internal_price: z.number().nullable(),
  spiral_additional_turn_time: z.number(),
  is_handover: z.literal(0).or(z.literal(1)),
  is_lend: z.boolean(),
  lend_data: z.null(),
  active_lendings: z.array(z.never()),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiArticleSchema> = undefined as unknown as ApiArticle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiArticle = undefined as unknown as z.infer<typeof apiArticleSchema>
}

export type ApiArticleCategories = {
  /** Categories that are associated with this article */
  categories: Array<
    ApiCategory &
      ApiXlAutomatenDatabaseObject & {
        pivot: {
          categorizable_id: number
          category_id: number
          categorizable_type: "App\\Article"
        }
      }
  >
}

export const apiArticleCategoriesSchema = z.object({
  categories: z.array(
    apiCategorySchema.and(apiXlAutomatenDatabaseObjectSchema).and(
      z.object({
        pivot: z.object({
          categorizable_id: z.number(),
          category_id: z.number(),
          categorizable_type: z.literal("App\\Article"),
        }),
      })
    )
  ),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiArticleCategoriesSchema> = undefined as unknown as ApiArticleCategories
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiArticleCategories = undefined as unknown as z.infer<typeof apiArticleCategoriesSchema>
}

export type ApiArticleExtraFields = {
  /** Mastermodules that are associated with this article */
  mastermodules: Array<never>
  /** Tags that are associated with this article */
  tags: Array<never>
}

export const apiArticleExtraFieldsSchema = z.object({
  mastermodules: z.array(z.never()),
  tags: z.array(z.never()),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiArticleExtraFieldsSchema> = undefined as unknown as ApiArticleExtraFields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiArticleExtraFields = undefined as unknown as z.infer<typeof apiArticleExtraFieldsSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

// requiredFields need to be explicitly set when created
// constFields can only be set at creation
// lockedFields cannot be changed by us

const fieldsRequiredForCreate = ["number", "name", "price", "supplier_id"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = ["archived", "lend_data", "active_lendings"] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = [
  "number",
  "name",
  "price",
  "supplier_id",
  "code",
  "price2",
  "price3",
  "price4",
  "is_lend",
  "lend_data",
] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Article, at least the fields are included */
export type MinimalApiArticleResponse = Required<Pick<ApiArticle, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiArticle> &
  ApiXlAutomatenDatabaseObject

export const minimalArticleResponseSchema = apiArticleSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .and(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreateArticleRequest = Required<Pick<Omit<ApiArticle, FieldsThatAreReadOnly>, FieldsRequiredForCreate>> &
  Partial<ApiArticle>
export type ApiCreateArticleResponse = MinimalApiArticleResponse

export const apiCreateArticleResponseSchema = minimalArticleResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateArticleResponseSchema> = undefined as unknown as ApiCreateArticleResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateArticleResponse = undefined as unknown as z.infer<typeof apiCreateArticleResponseSchema>
}

export type ApiUpdateArticleRequest = ApiCreateArticleRequest
export type ApiUpdateArticleResponse = ApiArticle & ApiXlAutomatenDatabaseObject

export const apiUpdateArticleResponseSchema = apiArticleSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateArticleResponseSchema> = undefined as unknown as ApiUpdateArticleResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateArticleResponse = undefined as unknown as z.infer<typeof apiUpdateArticleResponseSchema>
}

export type ApiGetArticleRequest = void
export type ApiGetArticleResponse = ApiArticle & ApiXlAutomatenDatabaseObject & ApiArticleExtraFields

export const apiGetArticleResponseSchema = apiArticleSchema
  .and(apiXlAutomatenDatabaseObjectSchema)
  .and(apiArticleExtraFieldsSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetArticleResponseSchema> = undefined as unknown as ApiGetArticleResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetArticleResponse = undefined as unknown as z.infer<typeof apiGetArticleResponseSchema>
}

export type ApiDeleteArticleRequest = void
export type ApiDeleteArticleResponse = ApiArticle & ApiXlAutomatenDatabaseObject

export const apiDeleteArticleResponseSchema = apiArticleSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteArticleResponseSchema> = undefined as unknown as ApiDeleteArticleResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteArticleResponse = undefined as unknown as z.infer<typeof apiDeleteArticleResponseSchema>
}

export type ApiGetArticlesRequest = void
export type ApiGetArticlesResponse = Array<
  ApiArticle & ApiXlAutomatenDatabaseObject & ApiArticleExtraFields & ApiArticleCategories
>

export const apiGetArticlesResponseSchema = z.array(
  apiArticleSchema
    .and(apiXlAutomatenDatabaseObjectSchema)
    .and(apiArticleExtraFieldsSchema)
    .and(apiArticleCategoriesSchema)
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetArticlesResponseSchema> = undefined as unknown as ApiGetArticlesResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetArticlesResponse = undefined as unknown as z.infer<typeof apiGetArticlesResponseSchema>
}

export const convertApiArticle = (response: MinimalApiArticleResponse): Article => {
  const result = {
    number: response.number,
    ...(response.order_number ? { orderNumber: response.order_number } : {}),
    name: response.name,
    ...(response.description ? { description: response.description } : {}),
    ...(response.main_img ? { image: response.main_img } : {}),
    ...(response.preview_img ? { previewImage: response.preview_img } : {}),
    supplierId: response.supplier_id,
    price: response.price,
    ...(response.price2 != null ? { price2: response.price2 } : {}),
    ...(response.price3 != null ? { price3: response.price3 } : {}),
    ...(response.price4 != null ? { price4: response.price4 } : {}),
    ...(response.lift_distance_pusher != null ? { liftDistancePusher: response.lift_distance_pusher } : {}),
    ...(response.lift_distance_spiral != null ? { liftDistanceSpiral: response.lift_distance_spiral } : {}),
    pushable: response.push_able === 1 ? true : false,
    spiralable: response.spiral_able === 1 ? true : false,
    spiralAsPusher: (response.spiral_as_pusher ?? 1) === 1 ? true : false,
    blocked: response.blocked === 1 ? true : false,
    photocell: (response.photocell ?? 1) === 1 ? true : false,
    doubleTurn: (response.double_turn ?? 1) === 1 ? true : false,
    sellOnTempStop: response.sell_on_temp_stop === 1 ? true : false,
    overPush: response.over_push ?? 0,
    ageControl: response.age_control === 1 ? true : false,
    taxRate: response.tax_rate ?? "19.00",
    ...(response.code != null ? { code: response.code } : {}),
    ...(response.max_filling_level != null ? { maxFillingLevel: response.max_filling_level } : {}),
    roll: response.roll === 1 ? true : false,
    priority: response.priority ?? 0,
    archived: [1, true].includes(response.archived ?? false) ? true : false,
    virtual: response.is_virtual === 1 ? true : false,
    topUp: response.is_top_up === 1 ? true : false,
    bonusAmount: response.bonus_amount ?? 0,
    ...(response.internal_price != null ? { internalPrice: response.internal_price } : {}),
    spiralAdditionalTurnTime: response.spiral_additional_turn_time ?? 0,
    isHandover: response.is_handover === 1 ? true : false,
    isLend: response.is_lend,
    activeLendings: response.active_lendings ?? [],
    ...convertApiXlAutomatenDatabaseObject(response),
  } satisfies Article

  return result
}

export const convertApiArticleWithExtraFields = (
  response: ApiArticleExtraFields & MinimalApiArticleResponse
): Article & ArticleExtraFields => {
  const article = convertApiArticle(response)
  const result = {
    ...article,
    mastermodules: response.mastermodules ?? [],
    tags: response.tags ?? [],
  }

  return result
}

export const convertApiArticleWithCategories = (
  response: ApiArticleCategories & ApiArticleExtraFields & MinimalApiArticleResponse
): Article & ArticleExtraFields & ArticleCategories => {
  const article = convertApiArticleWithExtraFields(response)
  const result = {
    ...article,
    categories: response.categories.map(category => ({
      ...convertApiCategory(category),
      pivot: {
        categorizableId: category.pivot.categorizable_id,
        categorizableType: category.pivot.categorizable_type,
      },
    })),
  }

  return result
}

export const convertArticleToRequest = (request: NewArticle): ApiCreateArticleRequest => {
  const result = {
    number: request.number,
    name: request.name,
    ...("orderNumber" in request ? { order_number: request.orderNumber || null } : {}),
    ...("description" in request ? { description: request.description || null } : {}),
    ...("image" in request ? { main_img: request.image || null } : {}),
    ...("previewImage" in request ? { preview_img: request.previewImage || null } : {}),
    supplier_id: request.supplierId,
    price: request.price,
    ...("price2" in request ? { price2: request.price2 ?? null } : {}),
    ...("price3" in request ? { price3: request.price3 ?? null } : {}),
    ...("price4" in request ? { price4: request.price4 ?? null } : {}),
    ...("liftDistancePusher" in request ? { lift_distance_pusher: request.liftDistancePusher ?? null } : {}),
    ...("liftDistanceSpiral" in request ? { lift_distance_spiral: request.liftDistanceSpiral ?? null } : {}),
    ...("pushable" in request ? { push_able: request.pushable ? 1 : 0 } : {}),
    ...("spiralable" in request ? { spiral_able: request.spiralable ? 1 : 0 } : {}),
    ...("spiralAsPusher" in request ? { spiral_as_pusher: request.spiralAsPusher ? 1 : 0 } : {}),
    ...("blocked" in request ? { blocked: request.blocked ? 1 : 0 } : {}),
    ...("photocell" in request ? { photocell: request.photocell ? 1 : 0 } : {}),
    ...("doubleTurn" in request ? { double_turn: request.doubleTurn ? 1 : 0 } : {}),
    ...("sellOnTempStop" in request ? { sell_on_temp_stop: request.sellOnTempStop ? 1 : 0 } : {}),
    ...("overPush" in request ? { over_push: request.overPush ?? 0 } : {}),
    ...("ageControl" in request ? { age_control: request.ageControl ? 1 : 0 } : {}),
    ...("taxRate" in request ? { tax_rate: request.taxRate } : {}),
    ...("code" in request ? { code: request.code ?? null } : {}),
    ...("maxFillingLevel" in request ? { max_filling_level: request.maxFillingLevel ?? null } : {}),
    ...("roll" in request ? { roll: request.roll ? 1 : 0 } : {}),
    ...("priority" in request ? { priority: request.priority ?? 0 } : {}),
    ...("virtual" in request ? { is_virtual: request.virtual ? 1 : 0 } : {}),
    ...("topUp" in request ? { is_top_up: request.topUp ? 1 : 0 } : {}),
    ...("bonusAmount" in request ? { bonus_amount: request.bonusAmount ?? 0 } : {}),
    ...("internalPrice" in request ? { internal_price: request.internalPrice ?? null } : {}),
    ...("spiralAdditionalTurnTime" in request
      ? { spiral_additional_turn_time: request.spiralAdditionalTurnTime ?? 0 }
      : {}),
    ...("isHandover" in request ? { is_handover: request.isHandover ? 1 : 0 } : {}),
    ...("isLend" in request ? { is_lend: request.isLend } : {}),
  } satisfies ApiCreateArticleRequest

  return result
}
