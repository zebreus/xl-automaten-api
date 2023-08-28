import {
  Category,
  EditableCategory,
  NewCategory,
  apiCreateCategoryResponseSchema,
  apiGetCategoriesResponseSchema,
  apiGetCategoryResponseSchema,
  apiUpdateCategoryResponseSchema,
  convertApiCategory,
  convertCategoryToRequest,
} from "helpers/convertCategory"
import {
  CategoryArticles,
  apiDeleteCategoryResponseSchema,
  convertApiCategoryWithArticles,
} from "helpers/convertCategoryAvoidDependencyCycle"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

type CreateCategoryOptions = {
  /** Data of the new category */
  category: NewCategory
} & AuthenticatedApiRequestOptions

/** Create a new category code
 *
 * ```typescript
 * const category = await createCategory({
 *   category: {
 *     name: "name-of-the-new-category"
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(category)
 * ```
 *
 * The new category will be returned.
 */
export const createCategory = async (options: CreateCategoryOptions): Promise<Category> => {
  const requestBody = convertCategoryToRequest(options.category)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateCategoryResponseSchema },
    "POST",
    "category",
    requestBody
  )

  const category = convertApiCategory(response)

  return category
}

type GetCategoryOptions = {
  /** id of the category you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a category by its id
 *
 * ```typescript
 * const category = await getCategory({
 *   id: 2000, // ID of an existing category
 *   token: "your-token",
 * })
 *
 * console.log(category)
 * ```
 */
export const getCategory = async (options: GetCategoryOptions): Promise<Category> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetCategoryResponseSchema },
    "GET",
    `category/${encodeURIComponent(options.id)}`
  )

  const category = convertApiCategory(response)

  return category
}

type GetCategoriesOptions = AuthenticatedApiRequestOptions

/** Get all categories
 *
 * ```typescript
 * const category = await getCategories({
 *   token: "your-token",
 * })
 *
 * categories.forEach(category => console.log(category))
 * ```
 */
export const getCategories = async (options: GetCategoriesOptions): Promise<Array<Category>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetCategoriesResponseSchema }, "GET", `categories`)

  const categories = response.map(receivedCategory => convertApiCategory(receivedCategory))

  return categories
}

type UpdateCategoryOptions = {
  /** ID of the category */
  id: number
  /** New data
   *
   * Needs to include all fields that are required when creating a new category.
   */
  category: Partial<EditableCategory>
} & AuthenticatedApiRequestOptions

/** Update an existing category
 *
 * ```typescript
 * const category = await updateCategory({
 *   id: 2000, // ID of an existing category
 *   category: {
 *     name: "New name of the category"
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(category)
 * ```
 *
 * The updated category will be returned.
 */
export const updateCategory = async (options: UpdateCategoryOptions): Promise<Category> => {
  const requestedChanges = options.category
  const categoryUpdate = requestedChanges.name
    ? {
        ...requestedChanges,
        name: requestedChanges.name,
      }
    : { ...(await getCategory({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertCategoryToRequest(categoryUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdateCategoryResponseSchema },
    "PUT",
    `category/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const category = convertApiCategory(response)

  return category
}

type DeleteCategoryOptions = {
  /** ID of the category you want to delete */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a category
 *
 * ```typescript
 * const category = await deleteCategory({
 *   id: 2000, // ID of an existing category
 *   token: "your-token",
 * })
 *
 * console.log(category)
 * ```
 *
 * The last state of the deleted category will be returned.
 */
export const deleteCategory = async (options: DeleteCategoryOptions): Promise<Category & CategoryArticles> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeleteCategoryResponseSchema },
    "DELETE",
    `category/${encodeURIComponent(options.id)}`
  )

  const category = convertApiCategoryWithArticles(response)

  return category
}
