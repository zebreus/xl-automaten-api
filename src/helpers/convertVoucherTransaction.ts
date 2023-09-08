import { z } from "zod"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  convertApiXlAutomatenDatabaseObject,
} from "./convertXlAutomatenDatabaseObject.js"

/** A transaction on a voucher*/
export type VoucherTransaction = {
  /** ID of the voucher */
  voucherId: number
  /** ID of the mastermodule where this transaction happend
   *
   * undefined if the transaction did not happen on a mastermodule
   * e.g. A voucher created via the API
   */
  mastermoduleId?: number
  /** Amount before this transaction */
  beforeAmount: number
  /** Change applied by this transaction
   *
   * -1 means add one Euro
   *
   * 1 means subtract one Euro
   */
  changedAmount: number
  /** Amount after this transaction */
  afterAmount: number
  /** Profile ID of the user that created the transaction */
  userId?: number
  /** Comment for this transaction */
  comment: string
} & XlAutomatenDatabaseObject

/** Data of a new vouchertransaction
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewVoucherTransaction = {
  /** Amount of the new transaction
   *
   * 1 means add 1 euro
   *
   * -1 means subtract 1 euro
   */
  amount: number
} & Pick<VoucherTransaction, "comment">

export type ApiVoucherTransaction = {
  /** ID of the voucher */
  cash_voucher_id: number
  /** ID of the mastermodule where this transaction happend
   *
   * 0 if the transaction did not happen on a mastermodule
   * e.g. A voucher created via the API
   */
  mastermodule_id: number
  /** Amount before this transaction */
  before_amount: number
  /** Change applied by this transaction
   *
   * -1 means add one Euro
   *
   * 1 means subtract one Euro
   */
  used_amount: number
  /** Amount after this transaction */
  after_amount: number
  /** Profile ID of the user that created the transaction */
  user_id: string | number | null
  /** Comment for this transaction */
  comment: string
}

export const apiVoucherTransactionSchema = z
  .object({
    cash_voucher_id: z.number(),
    mastermodule_id: z.number(),
    before_amount: z.number(),
    used_amount: z.number(),
    after_amount: z.number(),
    user_id: z.union([z.string(), z.number()]).nullable(),
    comment: z.string(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiVoucherTransactionSchema> = undefined as unknown as ApiVoucherTransaction
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiVoucherTransaction = undefined as unknown as z.infer<typeof apiVoucherTransactionSchema>
}

export type ApiCreateVoucherTransactionRequest = {
  /** Amount of the new transaction
   *
   * 1 means add 1 euro
   *
   * -1 means subtract 1 euro
   */
  amount: number
} & Pick<ApiVoucherTransaction, "comment">

export const convertApiVoucherTransaction = (
  response: ApiVoucherTransaction & ApiXlAutomatenDatabaseObject
): VoucherTransaction => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    voucherId: response.cash_voucher_id,
    ...(response.mastermodule_id !== 0 ? { mastermoduleId: response.mastermodule_id } : {}),
    beforeAmount: response.before_amount,
    changedAmount: response.used_amount,
    afterAmount: response.after_amount,
    ...(Number(response.user_id) ? { userId: Number(response.user_id) } : {}),
    comment: response.comment,
  }

  return result
}

export const convertVoucherTransactionToRequest = (
  request: NewVoucherTransaction
): ApiCreateVoucherTransactionRequest => {
  const result = {
    amount: request.amount,
    comment: request.comment,
  }

  return result
}
