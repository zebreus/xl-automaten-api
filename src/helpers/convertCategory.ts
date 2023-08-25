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

/** A category */
export type Category = {
  /** Name of the category */
  name: string
  /** Description of the category */
  description?: string
  /** URL of an image for the category */
  image?: string
  /** URL of a small preview image */
  previewImage?: string
  /** TODO: Figure out what this means */
  priority: number
} & XlAutomatenDatabaseObject

/** Category, but only the fields that can be edited */
export type EditableCategory = Omit<Category, keyof XlAutomatenDatabaseObject>

/** Data of a new category
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewCategory = Required<Pick<Category, "name">> & Partial<EditableCategory>

export type ApiCategory = {
  /** Name of the category */
  name: string
  /** Description of the category */
  description: string | null
  /** URL of an image for the category */
  main_img: string | null
  /** URL of a small preview image */
  preview_img: string | null
  /** TODO: Figure out what this means */
  priority: number
}

export const apiCategorySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  main_img: z.string().nullable(),
  preview_img: z.string().nullable(),
  priority: z.number(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCategorySchema> = undefined as unknown as ApiCategory
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCategory = undefined as unknown as z.infer<typeof apiCategorySchema>
}

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

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

// requiredFields need to be explicitly set when created
// constFields can only be set at creation
// lockedFields cannot be changed by us

const fieldsWithoutDefault = ["name"] as const
type FieldsWithoutDefault = (typeof fieldsWithoutDefault)[number]
const fieldsWithoutDefaultMap = fieldsWithoutDefault.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsWithoutDefault, true>
)

/** If the server responds with a Category, at least the fields are included */
export type MinimalApiCategoryResponse = Required<Pick<ApiCategory, FieldsWithoutDefault>> &
  PartialOrUndefined<ApiCategory> &
  ApiXlAutomatenDatabaseObject

export type ApiCreateCategoryRequest = Required<Pick<ApiCategory, FieldsWithoutDefault>> & Partial<ApiCategory>
export type ApiCreateCategoryResponse = MinimalApiCategoryResponse

export const apiCreateCategoryResponseSchema = apiCategorySchema
  .partial()
  .required(fieldsWithoutDefaultMap)
  .and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateCategoryResponseSchema> = undefined as unknown as ApiCreateCategoryResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateCategoryResponse = undefined as unknown as z.infer<typeof apiCreateCategoryResponseSchema>
}

export type ApiUpdateCategoryRequest = ApiCreateCategoryRequest
export type ApiUpdateCategoryResponse = ApiCategory & ApiXlAutomatenDatabaseObject

export const apiUpdateCategoryResponseSchema = apiCategorySchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateCategoryResponseSchema> = undefined as unknown as ApiUpdateCategoryResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateCategoryResponse = undefined as unknown as z.infer<typeof apiUpdateCategoryResponseSchema>
}

export type ApiGetCategoryRequest = void
export type ApiGetCategoryResponse = ApiCategory & ApiXlAutomatenDatabaseObject

export const apiGetCategoryResponseSchema = apiCategorySchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetCategoryResponseSchema> = undefined as unknown as ApiGetCategoryResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetCategoryResponse = undefined as unknown as z.infer<typeof apiGetCategoryResponseSchema>
}

export type ApiDeleteCategoryRequest = void
export type ApiDeleteCategoryResponse = ApiCategory & ApiXlAutomatenDatabaseObject

export const apiDeleteCategoryResponseSchema = apiCategorySchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteCategoryResponseSchema> = undefined as unknown as ApiGetCategoryResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteCategoryResponse = undefined as unknown as z.infer<typeof apiDeleteCategoryResponseSchema>
}

export type ApiGetCategoriesRequest = void
export type ApiGetCategoriesResponse = Array<ApiCategory & ApiXlAutomatenDatabaseObject>

export const apiGetCategoriesResponseSchema = z.array(apiCategorySchema.and(apiXlAutomatenDatabaseObjectSchema))

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetCategoriesResponseSchema> = undefined as unknown as ApiGetCategoriesResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetCategoriesResponse = undefined as unknown as z.infer<typeof apiGetCategoriesResponseSchema>
}

export const convertApiCategory = (response: MinimalApiCategoryResponse): Category => {
  const result = {
    name: response.name,
    ...(response.description ? { description: response.description } : {}),
    ...(response.main_img ? { image: response.main_img } : {}),
    ...(response.preview_img ? { previewImage: response.preview_img } : {}),
    priority: response.priority ?? 0,
    updatedAt: parseApiDate(response.updated_at),
    createdAt: parseApiDate(response.created_at),
    id: response.id,
  }

  return result
}

export const convertCategoryToRequest = (request: NewCategory): ApiCreateCategoryRequest => {
  const result = {
    name: request.name,
    description: request.description || null,
    main_img: request.image || null,
    preview_img: request.previewImage || null,
    priority: request.priority ?? 0,
  }

  return result
}
