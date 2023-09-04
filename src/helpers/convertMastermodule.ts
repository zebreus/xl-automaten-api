import { parseApiDate } from "helpers/apiDates"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
} from "helpers/convertXlAutomatenDatabaseObject"
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

  /** Idk, looks like some sort of id */
  remoteName?: string
  /** Idk */
  updateInterval?: number
  /** Idk
   *
   * Default maybe 1
   */
  requiresUpdate?: boolean

  /** When the data was last changed
   *
   * Precision finer than seconds is not supported and is ignored
   */
  updatedAt?: Date
  /** When the data was created
   *
   * Precision finer than seconds is not supported and is ignored
   */
  createdAt?: Date
  /** 6 digit PIN
   */
  pin?: number
  /** TODO: Figure out what this means
   */
  reboot?: boolean
  /** TODO: Figure out what this means
   */
  saveReboot?: boolean
  /** Idk
   *
   * Default maybe 0
   */
  offlineReported?: boolean
  /**
   *
   */
  parameters?: Array<MastermoduleParameter>
}

export type MastermoduleParameter = XlAutomatenDatabaseObject & {
  name: string
  parameterizableId: number
  parameterizableType: "App\\Mastermodule"
} & (
    | {
        default: number
        value: number
        type: "numeric"
      }
    | {
        default: string
        value: string
        type: "string"
      }
    | {
        default: boolean
        value: boolean
        type: "boolean"
      }
  )

type ApiMastermoduleParameter = {
  name:
    | "language"
    | "strict_stock"
    | "hide_coin_005"
    | "page_refresh_interval_minutes"
    | "show_card_payment"
    | "show_cash_payment"
    | "contact_details"
    | "category_preview_image_ratio"
    | "standard_price_is"
    | "offer_price_is"
    | "show_pickup_with_code"
    | "top_screen_msg"
  value: string
  level: ""
  validate: "string" | "boolean" | "numeric"
  default: 0
  parameterizable_id: number
  parameterizable_type: "App\\Mastermodule"
} & ApiXlAutomatenDatabaseObject

export const apiMastermoduleParameterSchema = z
  .object({
    name: z
      .literal("language")
      .or(z.literal("strict_stock"))
      .or(z.literal("hide_coin_005"))
      .or(z.literal("page_refresh_interval_minutes"))
      .or(z.literal("show_card_payment"))
      .or(z.literal("show_cash_payment"))
      .or(z.literal("contact_details"))
      .or(z.literal("category_preview_image_ratio"))
      .or(z.literal("standard_price_is"))
      .or(z.literal("offer_price_is"))
      .or(z.literal("show_pickup_with_code"))
      .or(z.literal("top_screen_msg")),
    value: z.string(),
    level: z.literal(""),
    validate: z.literal("string").or(z.literal("boolean")).or(z.literal("numeric")),
    default: z.literal(0),
    parameterizable_id: z.number(),
    parameterizable_type: z.literal("App\\Mastermodule"),
  })
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .strict()
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMastermoduleParameterSchema> = undefined as unknown as ApiMastermoduleParameter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMastermoduleParameter = undefined as unknown as z.infer<typeof apiMastermoduleParameterSchema>
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
   * Date as a string in the format "YYYY-MM-DD HH:MM:SS"
   *
   * The timezone is UTC
   *
   * Date can also be simpler, e.g. "2022-12-21"
   */
  last_connected: string | null

  /** Idk */
  remote_name?: string | undefined
  /** Idk */
  signup_code?: null | undefined
  /** Idk */
  version_control?: null | undefined
  /** Idk */
  version_display?: null | undefined
  /** Idk */
  hardware_information?: null | undefined
  /** Idk */
  update_interval?: number | undefined
  /** Idk */
  quick_update_until?: null | undefined
  /** Idk
   *
   * Default maybe 1
   */
  requires_update?: 0 | 1 | undefined
  /** Idk */
  notes?: null | undefined

  created_at?: string | undefined
  updated_at?: string | undefined
  /** Idk
   *
   * 6 digit code I think
   */
  pin?: number | undefined
  /** Idk
   *
   * Default maybe 0
   */
  reboot?: 0 | 1 | undefined
  /** Idk
   *
   * Default maybe 0
   */
  save_reboot?: 0 | 1 | undefined
  /** Idk
   *
   * Default maybe 0
   */
  offline_reported?: 0 | 1 | undefined
  /** Some sort of parameters */
  parameters?: Array<ApiMastermoduleParameter> | undefined
}

export const apiMastermoduleSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    machine_id: z.number(),
    last_connected: z.string().nullable(),
    remote_name: z.string().optional(),
    signup_code: z.null().optional(),
    version_control: z.null().optional(),
    version_display: z.null().optional(),
    hardware_information: z.null().optional(),
    update_interval: z.number().optional(),
    quick_update_until: z.null().optional(),
    requires_update: z.literal(0).or(z.literal(1)).optional(),
    notes: z.null().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    pin: z.number().optional(),
    reboot: z.literal(0).or(z.literal(1)).optional(),
    save_reboot: z.literal(0).or(z.literal(1)).optional(),
    offline_reported: z.literal(0).or(z.literal(1)).optional(),
    parameters: z.array(apiMastermoduleParameterSchema).optional(),
  })
  .strict()

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
    ...(response.remote_name ? { remoteName: response.remote_name } : {}),
    ...(response.update_interval ? { updateInterval: response.update_interval } : {}),
    ...(response.requires_update ? { requiresUpdate: response.requires_update === 1 } : {}),
    ...(response.created_at ? { createdAt: parseApiDate(response.created_at) } : {}),
    ...(response.updated_at ? { updatedAt: parseApiDate(response.updated_at) } : {}),
    ...(response.pin ? { pin: response.pin } : {}),
    ...(response.reboot ? { reboot: response.reboot === 1 } : {}),
    ...(response.save_reboot ? { saveReboot: response.save_reboot === 1 } : {}),
    ...(response.offline_reported ? { offlineReported: response.offline_reported === 1 } : {}),
    ...(response.parameters ? { parameters: response.parameters.map(convertApiMastermoduleParameter) } : {}),
  } satisfies Mastermodule

  return result
}

export const convertApiMastermoduleParameter = (response: ApiMastermoduleParameter): MastermoduleParameter => {
  const thing =
    response.validate === "numeric"
      ? (() => {
          const numberData = Number(response.value)
          if (Number.isNaN(numberData)) {
            throw new Error(`Could not parse number from ${response.value} while parsing ApiMastermoduleParameter`)
          }
          return {
            default: response.default,
            value: numberData,
            type: "numeric",
          } as const
        })()
      : response.validate === "boolean"
      ? ({
          default: (response.default as unknown) === 1,
          value: response.value !== "0" && response.value !== "false" && !!response.value,
          type: "boolean",
        } as const)
      : ({
          default: response.default || "",
          value: response.value,
          type: "string",
        } as const)

  const result = {
    id: response.id,
    updatedAt: parseApiDate(response.updated_at),
    createdAt: parseApiDate(response.created_at),
    name: response.name,
    parameterizableId: response.parameterizable_id,
    parameterizableType: response.parameterizable_type,
    ...thing,
  } satisfies MastermoduleParameter

  return result
}
