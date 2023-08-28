import { formatApiDate, parseApiDate } from "helpers/apiDates"
import { ApiPickupItem, PickupItem, apiPickupItemSchema, convertApiPickupItem } from "helpers/convertPickupItem"
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

/** A pickup */
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
  /** User id of the user that created it
   *
   * Readonly
   */
  userId: number
} & XlAutomatenDatabaseObject

export type PickupItems = {
  items: Array<PickupItem>
}

/** Pickup, but only the fields that can be edited */
export type EditablePickup = Omit<Pickup, keyof XlAutomatenDatabaseObject | "userId">

/** Data of a new pickup
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewPickup = Required<Pick<Pickup, "code" | "validFrom" | "validUntil" | "mastermoduleId">> &
  Partial<EditablePickup>

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
  /** User id of the user that created it */
  user_id: number
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
  user_id: z.number(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiPickupSchema> = undefined as unknown as ApiPickup
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiPickup = undefined as unknown as z.infer<typeof apiPickupSchema>
}

export type ApiPickupItems = {
  /** Categories that are associated with this article */
  items: Array<ApiPickupItem & ApiXlAutomatenDatabaseObject>
}

export const apiPickupItemsSchema = z.object({
  items: z.array(apiPickupItemSchema.and(apiXlAutomatenDatabaseObjectSchema)),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiPickupItemsSchema> = undefined as unknown as ApiPickupItems
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiPickupItems = undefined as unknown as z.infer<typeof apiPickupItemsSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsRequiredForCreate = ["code", "valid_from", "valid_until", "mastermodule_id"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = [] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = [
  "valid_from",
  "valid_until",
  "code",
  "mastermodule_id",
  "reserve_from",
  "user_id",
] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Pickup, at least the fields are included */
export type MinimalApiPickupResponse = Required<Pick<ApiPickup, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiPickup> &
  ApiXlAutomatenDatabaseObject

export const minimalPickupResponseSchema = apiPickupSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .and(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreatePickupRequest = Required<Pick<ApiPickup, FieldsRequiredForCreate>> & Partial<ApiPickup>
export type ApiCreatePickupResponse = MinimalApiPickupResponse

export const apiCreatePickupResponseSchema = minimalPickupResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreatePickupResponseSchema> = undefined as unknown as ApiCreatePickupResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreatePickupResponse = undefined as unknown as z.infer<typeof apiCreatePickupResponseSchema>
}

export type ApiUpdatePickupRequest = Required<Omit<Pick<ApiPickup, FieldsRequiredForCreate>, FieldsThatAreReadOnly>> &
  Partial<ApiPickup>
export type ApiUpdatePickupResponse = ApiPickup & ApiXlAutomatenDatabaseObject

export const apiUpdatePickupResponseSchema = apiPickupSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdatePickupResponseSchema> = undefined as unknown as ApiUpdatePickupResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdatePickupResponse = undefined as unknown as z.infer<typeof apiUpdatePickupResponseSchema>
}

export type ApiGetPickupRequest = void
export type ApiGetPickupResponse = ApiPickup & ApiXlAutomatenDatabaseObject & ApiPickupItems

export const apiGetPickupResponseSchema = apiPickupSchema
  .and(apiXlAutomatenDatabaseObjectSchema)
  .and(apiPickupItemsSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetPickupResponseSchema> = undefined as unknown as ApiGetPickupResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetPickupResponse = undefined as unknown as z.infer<typeof apiGetPickupResponseSchema>
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

export type ApiGetPickupsRequest = void
export type ApiGetPickupsResponse = Array<ApiPickup & ApiXlAutomatenDatabaseObject & ApiPickupItems>

export const apiGetPickupsResponseSchema = z.array(
  apiPickupSchema.and(apiXlAutomatenDatabaseObjectSchema).and(apiPickupItemsSchema)
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetPickupsResponseSchema> = undefined as unknown as ApiGetPickupsResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetPickupsResponse = undefined as unknown as z.infer<typeof apiGetPickupsResponseSchema>
}

export function convertApiPickup(response: MinimalApiPickupResponse): Pickup {
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
    id: response.id,
  } satisfies Pickup

  return result
}

export function convertApiPickupWithItems(response: ApiPickupItems & MinimalApiPickupResponse): Pickup & PickupItems {
  const pickup = convertApiPickup(response)
  const result = {
    ...pickup,
    items: response.items.map(convertApiPickupItem),
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
  } satisfies ApiCreatePickupRequest

  return result
}
