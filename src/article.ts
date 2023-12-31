import {
  Article,
  ArticleCategories,
  ArticleExtraFields,
  EditableArticle,
  NewArticle,
  apiCreateArticleResponseSchema,
  apiDeleteArticleResponseSchema,
  apiGetArticleResponseSchema,
  apiGetArticlesResponseSchema,
  apiUpdateArticleResponseSchema,
  convertApiArticle,
  convertApiArticleWithCategories,
  convertApiArticleWithExtraFields,
  convertArticleToRequest,
} from "./helpers/convertArticle.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type CreateArticleOptions = {
  /** Data of the new article */
  article: NewArticle
} & AuthenticatedApiRequestOptions

/** Create a new article code
 *
 * ```typescript
 * const article = await createArticle({
 *   article: {
 *     name: "name-of-the-new-article"
 *     number: "123456",
 *     price: 4,
 *     supplierId: 29, // ID of an existing supplier
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(article)
 * ```
 *
 * The new article will be returned.
 */
export const createArticle = async (options: CreateArticleOptions): Promise<Article> => {
  const requestBody = convertArticleToRequest(options.article)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateArticleResponseSchema },
    "POST",
    "article",
    requestBody
  )

  const article = convertApiArticle(response)

  return article
}

export type GetArticleOptions = {
  /** id of the article you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a article by its id
 *
 * ```typescript
 * const article = await getArticle({
 *   id: 2000, // ID of an existing article
 *   token: "your-token",
 * })
 *
 * console.log(article)
 * ```
 */
export const getArticle = async (options: GetArticleOptions): Promise<Article & ArticleExtraFields> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetArticleResponseSchema },
    "GET",
    `article/${encodeURIComponent(options.id)}`
  )

  const article = convertApiArticleWithExtraFields(response)

  return article
}

export type GetArticlesOptions = AuthenticatedApiRequestOptions

/** Get all articles
 *
 * ```typescript
 * const article = await getArticles({
 *   token: "your-token",
 * })
 *
 * articles.forEach(article => console.log(article))
 * ```
 */
export const getArticles = async (
  options: GetArticlesOptions
): Promise<Array<Article & ArticleExtraFields & ArticleCategories>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetArticlesResponseSchema }, "GET", `articles`)

  const articles = response.map(receivedArticle => convertApiArticleWithCategories(receivedArticle))

  return articles
}

export type UpdateArticleOptions = {
  /** ID of the article */
  id: number
  /** The updated fields */
  article: Partial<EditableArticle>
} & AuthenticatedApiRequestOptions

/** Update an existing article
 *
 * ```typescript
 * const article = await updateArticle({
 *   id: 2000, // ID of an existing article
 *   article: {
 *     name: "New name of the article"
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(article)
 * ```
 *
 * The updated article will be returned.
 */
export const updateArticle = async (options: UpdateArticleOptions): Promise<Article> => {
  const requestedChanges = options.article
  const articleUpdate =
    requestedChanges.price != null &&
    requestedChanges.number != null &&
    requestedChanges.name != null &&
    requestedChanges.supplierId != null
      ? {
          ...requestedChanges,
          price: requestedChanges.price,
          number: requestedChanges.number,
          name: requestedChanges.name,
          supplierId: requestedChanges.supplierId,
        }
      : { ...(await getArticle({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertArticleToRequest(articleUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdateArticleResponseSchema },
    "PUT",
    `article/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const article = convertApiArticle(response)

  return article
}

export type ArchiveArticleOptions = {
  /** ID of the article you want to delete */
  id: number
} & AuthenticatedApiRequestOptions

/** Archive a article
 *
 * ```typescript
 * const article = await deleteArticle({
 *   id: 2000, // ID of an existing article
 *   token: "your-token",
 * })
 *
 * console.log(article)
 * ```
 *
 * The last state of the archived article will be returned.
 *
 * Articles are not really getting deleted. The only thing this does is setting `archived` to true.
 */
export const archiveArticle = async (options: ArchiveArticleOptions): Promise<Article> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeleteArticleResponseSchema },
    "DELETE",
    `article/${encodeURIComponent(options.id)}`
  )

  const article = convertApiArticle(response)

  return article
}
