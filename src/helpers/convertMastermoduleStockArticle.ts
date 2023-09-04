import { z } from "zod"

/** A mastermodulestockarticle */
export type MastermoduleStockArticle = {
  /** How many articles are in the machine */
  stock: number
  /** Name of the article */
  name: string
  /** Article number
   *
   * TODO: Figure out what this is
   *
   * Example: "STQST24_Misch_Rogger_750"
   */
  articleNumber: string
  /** Image for the article */
  image?: string
  /** ID of the article */
  articleId: number
}

export type ApiMastermoduleStockArticle = {
  /** How many articles are in the machine */
  stock: number
  /** Name of the article */
  name: string
  /** Article number
   *
   * TODO: Figure out what this is
   *
   * Example: "STQST24_Misch_Rogger_750"
   */
  article_number: string
  /** Image for the article */
  img: string | null
  /** ID of the article */
  id: number
}

export const apiMastermoduleStockArticleSchema = z
  .object({
    stock: z.number(),
    name: z.string(),
    article_number: z.string(),
    img: z.string().nullable(),
    id: z.number(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMastermoduleStockArticleSchema> = undefined as unknown as ApiMastermoduleStockArticle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMastermoduleStockArticle = undefined as unknown as z.infer<typeof apiMastermoduleStockArticleSchema>
}

export type ApiGetMastermoduleStockArticlesRequest = void
export type ApiGetMastermoduleStockArticlesResponse = Array<ApiMastermoduleStockArticle>

export const apiGetMastermoduleStockArticlesResponseSchema = z.array(apiMastermoduleStockArticleSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMastermoduleStockArticlesResponseSchema> =
    undefined as unknown as ApiGetMastermoduleStockArticlesResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMastermoduleStockArticlesResponse = undefined as unknown as z.infer<
    typeof apiGetMastermoduleStockArticlesResponseSchema
  >
}

export const convertApiMastermoduleStockArticle = (response: ApiMastermoduleStockArticle): MastermoduleStockArticle => {
  const result = {
    articleId: response.id,
    name: response.name,
    articleNumber: response.article_number,
    ...(response.img === null ? {} : { image: response.img }),
    stock: response.stock,
  } satisfies MastermoduleStockArticle

  return result
}
