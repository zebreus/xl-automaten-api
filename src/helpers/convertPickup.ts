import { formatApiDate, parseApiDate } from "helpers/apiDates"
import { z } from "zod"

export type XlAutomatenDatabaseObject = {
  /** User id of the user that created it */
  userId: number
  /** When the pickup was last changed
   *
   * Precision finer than seconds is not supported and is ignored
   */
  updatedAt: Date
  /** When the pickup was created
   *
   * Precision finer than seconds is not supported and is ignored
   */
  createdAt: Date
  /** Internal id */
  internalId: number
}

/** A pickup code */
export type Pickup = {
  /** The pickup code */
  code: string
  /** Start of the pickup window.
   *
   * Precision finer than seconds is not supported and is ignored
   */
  validFrom: Date
  /** End of the pickup window
   *
   * Precision finer than seconds is not supported and is ignored
   */
  validUntil: Date
  /** ID of the mastermodule of the vending machine
   *
   * Used to select the vending machine
   */
  mastermoduleId: number
  /** Used to enable pickup via RFID card or QR code
   *
   * If set the QR code or RFID card must contain this value
   */
  cardNumber?: string
  /** Prevent the user from editing the articles of the pickup after creation
   *
   * Useful for prepaid orders
   */
  preventCartsEdits?: boolean
  /** Do not reserve articles that are available in the vending machine
   *
   * By default this is set to 1
   */
  dontReserveArticles?: boolean
  /** When articles in the vending machine will be reserved
   *
   * Should be before the start of the pickup window
   *
   * Only relevant if `dontReserveArticles` is not set
   *
   * Defaults to start of the first day of the pickup window
   *
   * Precision finer than seconds is not supported and is ignored
   */
  reserveFrom?: Date
  /** A callback URL
   *
   * Will be called at pickup.
   */
  callback?: string
  /** Prevent this pickup from being automatically deleted */
  preventAutoDeletion?: boolean
  /** An additional ID that will be stored with the pickup code */
  externalId?: string
} & XlAutomatenDatabaseObject

/** Pickup, but only the fields that can be edited */
export type EditablePickup = Omit<Pickup, "code" | keyof XlAutomatenDatabaseObject>
/** Data of a new pickup code
 *
 * All fields that are not required for creating a new pickup are set to optional.
 */
export type NewPickup = Required<Pick<Pickup, "code" | "validFrom" | "validUntil" | "mastermoduleId">> &
  Partial<EditablePickup>

/** Data of a pickup update
 *
 * The same as NewPickup, but without "code"
 *
 * Technically the API request requires code, but it is completely ignored, as the field is read-only. The updatePickup function inserts a dummy value into the actual call
 */
export type UpdatePickup = Partial<EditablePickup>

export type ApiPickup = {
  /** Used to enable pickup via RFID card or QR code
   *
   * If set the QR code or RFID card must contain this value
   *
   * TODO: Find out details about this
   *
   * Defaults to null or empty string
   */
  card_number: string | null
  /** Whether the customer can edit the cart
   *
   * By default the customer can edit the cart. Set this explicitly to one to prevent this
   *
   * Useful for prepaid orders
   */
  cart_editable: 0 | 1
  /** Whether products available in the machine should be reserved
   *
   * By default this is set to 1
   */
  reserve: 0 | 1
  /** Start of the pickup window
   *
   * Date as a string in the format "YYYY-MM-DD HH:MM:SS"
   *
   * The timezone is UTC
   *
   * Date can also be simpler, e.g. "2022-12-21"
   */
  valid_from: string
  /** End of the pickup window
   *
   * Date as a string in the format "YYYY-MM-DD HH:MM:SS"
   *
   * The timezone is UTC
   *
   * Date can also be simpler, e.g. "2022-12-21"
   */
  valid_until: string
  /** The pickup code
   *
   * Needs to be unique
   */
  code: string
  /** ID of the mastermodule of the vending machine
   *
   * idk what this means
   */
  mastermodule_id: number
  /** If articles will be reserved, this is the start of the reservation window
   *
   * Only relevant if `reserve` is set to 1 (or not set at all)
   *
   * Date as a string in the format "YYYY-MM-DD HH:MM:SS"
   *
   * The timezone is UTC
   *
   * Defaults to start of the day of `valid_from`
   */
  reserve_from: string
  /** A callback URL
   *
   * Will be called at pickup.
   *
   * TODO: Test this
   */
  callback: string | null
  /** TODO: Figure out how this works */
  auto_delete: 0 | 1
  /** An additional ID that will be stored with the pickup code
   *
   * TODO: Figure out if this has any functionality besides reflecting the ID back in the response
   */
  external_id: string | null
}

export const apiPickupSchema = z.object({
  card_number: z.string().nullable(),
  cart_editable: z.literal(0).or(z.literal(1)),
  reserve: z.literal(0).or(z.literal(1)),
  valid_from: z.string(),
  valid_until: z.string(),
  code: z.string(),
  mastermodule_id: z.number(),
  reserve_from: z.string(),
  callback: z.string().nullable(),
  auto_delete: z.literal(0).or(z.literal(1)),
  external_id: z.string().nullable(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiPickupSchema> = undefined as unknown as ApiPickup
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiPickup = undefined as unknown as z.infer<typeof apiPickupSchema>
}

export type ApiXlAutomatenDatabaseObject = {
  /** User id of the user that created it */
  user_id: number
  /** With seconds */
  updated_at: string
  /** With seconds */
  created_at: string
  /** Internal id */
  id: number
}

export const apiXlAutomatenDatabaseObjectSchema = z.object({
  user_id: z.number(),
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
  /** The ID of the article */
  article_id: number
  /** TODO: Figure out what this means */
  fixed_price: number
  /** TODO: Figure out what this means */
  price: number
}

export const apiPickupItemSchema = z.object({
  article_id: z.number(),
  fixed_price: z.number(),
  price: z.number(),
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

/** If the server responds with a pickup, at least the fields are included */
export type MinimalApiPickupResponse = Required<
  Pick<ApiPickup, "code" | "valid_from" | "valid_until" | "mastermodule_id" | "reserve_from">
> &
  PartialOrUndefined<ApiPickup> &
  ApiXlAutomatenDatabaseObject

export type ApiCreatePickupRequest = Required<
  Pick<ApiPickup, "code" | "valid_from" | "valid_until" | "mastermodule_id">
> &
  Partial<ApiPickup>
export type ApiCreatePickupResponse = MinimalApiPickupResponse

export const apiCreatePickupResponseSchema = apiPickupSchema
  .partial()
  .required({ code: true, valid_from: true, valid_until: true, mastermodule_id: true, reserve_from: true })
  .and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreatePickupResponseSchema> = undefined as unknown as ApiCreatePickupResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreatePickupResponse = undefined as unknown as z.infer<typeof apiCreatePickupResponseSchema>
}

export type ApiGetPickupRequest = void
export type ApiGetPickupResponse = ApiPickup & ApiXlAutomatenDatabaseObject & { items: Array<ApiPickupItem> }

export const apiGetPickupResponseSchema = apiPickupSchema
  .and(apiXlAutomatenDatabaseObjectSchema)
  .and(z.object({ items: z.array(apiPickupItemSchema) }))

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetPickupResponseSchema> = undefined as unknown as ApiGetPickupResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetPickupResponse = undefined as unknown as z.infer<typeof apiGetPickupResponseSchema>
}

export type ApiGetPickupsRequest = void
export type ApiGetPickupsResponse = Array<ApiGetPickupResponse>

export const apiGetPickupsResponseSchema = z.array(apiGetPickupResponseSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetPickupsResponseSchema> = undefined as unknown as ApiGetPickupsResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetPickupsResponse = undefined as unknown as z.infer<typeof apiGetPickupsResponseSchema>
}

export type ApiUpdatePickupRequest = ApiCreatePickupRequest
export type ApiUpdatePickupResponse = ApiPickup & ApiXlAutomatenDatabaseObject

export const apiUpdatePickupResponseSchema = apiPickupSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdatePickupResponseSchema> = undefined as unknown as ApiUpdatePickupResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdatePickupResponse = undefined as unknown as z.infer<typeof apiUpdatePickupResponseSchema>
}

export type ApiDeletePickupRequest = void
export type ApiDeletePickupResponse = ApiPickup & ApiXlAutomatenDatabaseObject

export const apiDeletePickupResponseSchema = apiPickupSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeletePickupResponseSchema> = undefined as unknown as ApiDeletePickupResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeletePickupResponse = undefined as unknown as z.infer<typeof apiDeletePickupResponseSchema>
}

export const convertApiPickup = (response: MinimalApiPickupResponse): Pickup => {
  const result = {
    code: response.code,
    validFrom: parseApiDate(response.valid_from),
    validUntil: parseApiDate(response.valid_until),
    ...(response.card_number ? { cardNumber: response.card_number } : {}),
    preventCartsEdits: response.cart_editable === 0 ? true : false,
    dontReserveArticles: response.reserve === 0 ? true : false,
    mastermoduleId: response.mastermodule_id,
    reserveFrom: parseApiDate(response.reserve_from ?? response.valid_from),
    ...(response.callback ? { callback: response.callback } : {}),
    preventAutoDeletion: response.auto_delete === 0 ? true : false,
    ...(response.external_id ? { externalId: response.external_id } : {}),
    userId: response.user_id,
    updatedAt: parseApiDate(response.updated_at),
    createdAt: parseApiDate(response.created_at),
    internalId: response.id,
  }

  return result
}

export const convertPickupToRequest = (request: NewPickup): ApiCreatePickupRequest => {
  const result = {
    code: request.code,
    valid_from: formatApiDate(request.validFrom),
    valid_until: formatApiDate(request.validUntil),
    mastermodule_id: request.mastermoduleId,
    ...(request.cardNumber ? { cardNumber: request.cardNumber } : {}),
    cart_editable: request.preventCartsEdits ? (0 as const) : (1 as const),
    reserve: request.dontReserveArticles ? (0 as const) : (1 as const),
    ...(request.reserveFrom ? { reserve_from: formatApiDate(request.reserveFrom) } : {}),
    ...(request.callback ? { callback: request.callback } : {}),
    auto_delete: request.preventAutoDeletion ? (0 as const) : (1 as const),
    ...(request.externalId ? { external_id: request.externalId } : {}),
  }

  return result
}
