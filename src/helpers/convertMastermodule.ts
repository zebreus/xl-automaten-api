import { parseApiDate } from "helpers/apiDates"
import { z } from "zod"

/** A mastermodule */
export type Mastermodule = {
  /** ID of the mastermodule */
  id: number
  /** name of the mastermodule */
  name: string
  /** Id of the associated maching */
  machineId: number
  /** When it was connected last
   *
   * I am speculating that this is a Date
   */
  lastConnected?: Date
}

export type ApiMastermodule = {
  /** ID of the mastermodule */
  id: number
  /** name of the mastermodule */
  name: string
  /** Id of the associated maching */
  machine_id: number
  /** When it was connected last
   *
   * I am speculating that this is a Date
   */
  last_connected: string | null
}

export const apiMastermoduleSchema = z.object({
  id: z.number(),
  name: z.string(),
  machine_id: z.number(),
  last_connected: z.string().nullable(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMastermoduleSchema> = undefined as unknown as ApiMastermodule
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMastermodule = undefined as unknown as z.infer<typeof apiMastermoduleSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsThatWillAlwaysGetReturned = ["id", "name", "machine_id", "last_connected"] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]

/** If the server responds with a Mastermodule, at least the fields are included */
export type MinimalApiMastermoduleResponse = Required<Pick<ApiMastermodule, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiMastermodule>

export type ApiGetMastermodulesRequest = void
export type ApiGetMastermodulesResponse = Array<ApiMastermodule>

export const apiGetMastermodulesResponseSchema = z.array(apiMastermoduleSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMastermodulesResponseSchema> = undefined as unknown as ApiGetMastermodulesResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMastermodulesResponse = undefined as unknown as z.infer<typeof apiGetMastermodulesResponseSchema>
}

export const convertApiMastermodule = (response: MinimalApiMastermoduleResponse): Mastermodule => {
  const result = {
    id: response.id,
    name: response.name,
    machineId: response.machine_id,
    ...(response.last_connected ? { lastConnected: parseApiDate(response.last_connected) } : {}),
  } satisfies Mastermodule

  return result
}
