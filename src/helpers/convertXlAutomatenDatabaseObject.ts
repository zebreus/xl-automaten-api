import { z } from "zod"
import { parseApiDate } from "./apiDates.js"

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

export type ApiXlAutomatenDatabaseObject = {
  /** With seconds */
  updated_at: string
  /** With seconds */
  created_at: string
  /** Internal id */
  id: number
}

export const apiXlAutomatenDatabaseObjectSchema = z
  .object({
    updated_at: z.string(),
    created_at: z.string(),
    id: z.number(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiXlAutomatenDatabaseObjectSchema> = undefined as unknown as ApiXlAutomatenDatabaseObject
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiXlAutomatenDatabaseObject = undefined as unknown as z.infer<typeof apiXlAutomatenDatabaseObjectSchema>
}

export const convertApiXlAutomatenDatabaseObject = (
  response: ApiXlAutomatenDatabaseObject
): XlAutomatenDatabaseObject => {
  const result = {
    updatedAt: parseApiDate(response.updated_at),
    createdAt: parseApiDate(response.created_at),

    id: response.id,
  }

  return result
}
