import { z } from "zod"
import { parseApiDate } from "./apiDates.js"
import {
  ApiVoucherTransaction,
  VoucherTransaction,
  apiVoucherTransactionSchema,
  convertApiVoucherTransaction,
} from "./convertVoucherTransaction.js"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiXlAutomatenDatabaseObject,
} from "./convertXlAutomatenDatabaseObject.js"

/** A voucher */
export type Voucher = {
  /** Code of the voucher
   *
   * Readonly.
   *
   * Six characters, uppercase letters and numbers only.
   */
  voucher: string
  /** Initial amount of the voucher.
   *
   * In euros
   */
  initialAmount: number
  /** How much is already used
   *
   * In euros
   */
  usedAmount: number
  /** Comment for this voucher */
  comment?: string
  /** Profile ID of the user that created the voucher */
  createdBy: number
  /** Date when the code was blocked
   *
   * TODO: Figure out what this means
   *
   * TODO: Verify that this is actually a timestamp
   */
  blockedAt?: Date
  /** Date when the code was delete.
   *
   * Seems to be always null
   *
   * TODO: Figure out what this means
   *
   * TODO: Verify that this is actually a timestamp
   */
  deletedAt?: Date
} & XlAutomatenDatabaseObject

export type VoucherTransactions = {
  transactions: Array<VoucherTransaction>
}

/** Voucher, but only the fields that can be edited */
export type EditableVoucher = Omit<
  Voucher,
  keyof XlAutomatenDatabaseObject | "voucher" | "initialAmount" | "usedAmount" | "createdBy" | "blockedAt" | "deletedAt"
>

/** Data of a new voucher
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewVoucher = Required<Pick<Voucher, "initialAmount">> & Partial<EditableVoucher>

export type ApiVoucherTransactions = {
  /** History of the past transactions of this voucher */
  history: null | Array<ApiVoucherTransaction & ApiXlAutomatenDatabaseObject>
}

export const apiVoucherTransactionsSchema = z
  .object({
    history: z.array(apiVoucherTransactionSchema.merge(apiXlAutomatenDatabaseObjectSchema).strict()).nullable(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiVoucherTransactionsSchema> = undefined as unknown as ApiVoucherTransactions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiVoucherTransactions = undefined as unknown as z.infer<typeof apiVoucherTransactionsSchema>
}

export type ApiVoucher = {
  /** Code of the voucher
   *
   * Readonly.
   *
   * Six characters, uppercase letters and numbers only.
   */
  voucher: string
  /** Initial amount of the voucher */
  initial_amount: number
  /** How much is already used */
  used_amount: number
  /** Comment for this voucher */
  comment: string | null
  /** Profile ID of the user that created the voucher */
  created_by: string | number
  /** Date when the code was blocked
   *
   * TODO: Figure out what this means
   */
  blocked_at: string | null
  /** Date when the code was delete. Seems to be always null
   *
   * TODO: Figure out what this means
   */
  deleted_at: string | null
}

export const apiVoucherSchema = z
  .object({
    voucher: z.string().regex(/^[A-Z0-9]{6}$/),
    initial_amount: z.number(),
    used_amount: z.number(),
    comment: z.string().nullable(),
    created_by: z.string().or(z.number()),
    blocked_at: z.string().nullable(),
    deleted_at: z.string().nullable(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiVoucherSchema> = undefined as unknown as ApiVoucher
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiVoucher = undefined as unknown as z.infer<typeof apiVoucherSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsRequiredForCreate = ["initial_amount"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = [
  "voucher",
  "initial_amount",
  "used_amount",
  "created_by",
  "blocked_at",
  "deleted_at",
] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = ["initial_amount", "voucher", "used_amount", "created_by"] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Voucher, at least the fields are included */
export type MinimalApiVoucherResponse = Required<Pick<ApiVoucher, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiVoucher> &
  ApiXlAutomatenDatabaseObject

export const minimalVoucherResponseSchema = apiVoucherSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .merge(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreateVoucherRequest = Required<Pick<ApiVoucher, FieldsRequiredForCreate>> & Partial<ApiVoucher>
export type ApiCreateVoucherResponse = MinimalApiVoucherResponse

export const apiCreateVoucherResponseSchema = minimalVoucherResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateVoucherResponseSchema> = undefined as unknown as ApiCreateVoucherResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateVoucherResponse = undefined as unknown as z.infer<typeof apiCreateVoucherResponseSchema>
}

export type ApiUpdateVoucherRequest = Required<Omit<Pick<ApiVoucher, FieldsRequiredForCreate>, FieldsThatAreReadOnly>> &
  Partial<ApiVoucher>
export type ApiUpdateVoucherResponse = ApiVoucher & ApiXlAutomatenDatabaseObject

export const apiUpdateVoucherResponseSchema = apiVoucherSchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateVoucherResponseSchema> = undefined as unknown as ApiUpdateVoucherResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateVoucherResponse = undefined as unknown as z.infer<typeof apiUpdateVoucherResponseSchema>
}

export type ApiGetVoucherRequest = void
export type ApiGetVoucherResponse = ApiVoucher & ApiXlAutomatenDatabaseObject & ApiVoucherTransactions

export const apiGetVoucherResponseSchema = apiVoucherSchema
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .merge(apiVoucherTransactionsSchema)
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetVoucherResponseSchema> = undefined as unknown as ApiGetVoucherResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetVoucherResponse = undefined as unknown as z.infer<typeof apiGetVoucherResponseSchema>
}

export type ApiDeleteVoucherRequest = void
export type ApiDeleteVoucherResponse = ApiVoucher & ApiXlAutomatenDatabaseObject

export const apiDeleteVoucherResponseSchema = apiVoucherSchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteVoucherResponseSchema> = undefined as unknown as ApiDeleteVoucherResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteVoucherResponse = undefined as unknown as z.infer<typeof apiDeleteVoucherResponseSchema>
}

export type ApiGetVouchersRequest = void
export type ApiGetVouchersResponse = Array<ApiVoucher & ApiXlAutomatenDatabaseObject>

export const apiGetVouchersResponseSchema = z.array(apiVoucherSchema.merge(apiXlAutomatenDatabaseObjectSchema))

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetVouchersResponseSchema> = undefined as unknown as ApiGetVouchersResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetVouchersResponse = undefined as unknown as z.infer<typeof apiGetVouchersResponseSchema>
}

export const convertApiVoucher = (response: MinimalApiVoucherResponse): Voucher => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    voucher: response.voucher,
    initialAmount: response.initial_amount,
    usedAmount: response.used_amount,
    ...(response.comment != null ? { comment: response.comment } : {}),
    createdBy: Number(response.created_by),
    ...(response.blocked_at != null ? { blockedAt: parseApiDate(response.blocked_at) } : {}),
    ...(response.deleted_at != null ? { blockedAt: parseApiDate(response.deleted_at) } : {}),
  } satisfies Voucher

  return result
}

export const convertApiVoucherWithTransactions = (
  response: MinimalApiVoucherResponse & ApiVoucherTransactions
): Voucher & VoucherTransactions => {
  const voucher = convertApiVoucher(response)
  const transactions = (response.history ?? []).map(convertApiVoucherTransaction)

  const result = {
    ...voucher,
    transactions,
  }

  return result
}

export const convertVoucherToRequest = (request: NewVoucher): ApiCreateVoucherRequest => {
  const result = {
    initial_amount: request.initialAmount,
    ...("comment" in request ? { comment: request.comment ?? null } : {}),
  } satisfies ApiCreateVoucherRequest

  return result
}
