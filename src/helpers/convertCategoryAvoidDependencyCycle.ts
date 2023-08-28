import { ApiArticle, Article, apiArticleSchema, convertApiArticle } from "helpers/convertArticle"
import {
  ApiCategory,
  ApiXlAutomatenDatabaseObject,
  Category,
  MinimalApiCategoryResponse,
  apiCategorySchema,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiCategory,
} from "helpers/convertCategory"
import { z } from "zod"

export type CategoryArticles = {
  articles: Array<Article>
}

export type ApiCategoryArticles = {
  /** Categories that are associated with this article */
  articles: Array<ApiArticle & ApiXlAutomatenDatabaseObject>
}

export const apiCategoryArticlesSchema = z.object({
  articles: z.array(apiArticleSchema.and(apiXlAutomatenDatabaseObjectSchema)),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCategoryArticlesSchema> = undefined as unknown as ApiCategoryArticles
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCategoryArticles = undefined as unknown as z.infer<typeof apiCategoryArticlesSchema>
}

export const convertApiCategoryWithArticles = (
  response: ApiCategoryArticles & MinimalApiCategoryResponse
): Category & CategoryArticles => {
  const category = convertApiCategory(response)
  const result = {
    ...category,
    articles: response.articles.map(convertApiArticle),
  }

  return result
}

export type ApiDeleteCategoryRequest = void
export type ApiDeleteCategoryResponse = ApiCategory & ApiXlAutomatenDatabaseObject & ApiCategoryArticles

export const apiDeleteCategoryResponseSchema = apiCategorySchema
  .and(apiXlAutomatenDatabaseObjectSchema)
  .and(apiCategoryArticlesSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteCategoryResponseSchema> = undefined as unknown as ApiDeleteCategoryResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteCategoryResponse = undefined as unknown as z.infer<typeof apiDeleteCategoryResponseSchema>
}
