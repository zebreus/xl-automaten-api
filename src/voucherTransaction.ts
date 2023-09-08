import { Voucher, VoucherTransactions, convertApiVoucherWithTransactions } from "./helpers/convertVoucher.js"
import { NewVoucherTransaction, convertVoucherTransactionToRequest } from "./helpers/convertVoucherTransaction.js"
import { apiCreateVoucherTransactionResponseSchema } from "./helpers/convertVoucherTransactionAvoidDependencyCycle.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type CreateVoucherTransactionOptions = {
  /** ID of the affected voucher */
  voucherId: number
  /** Data of the new vouchertransaction */
  voucherTransaction: NewVoucherTransaction
} & AuthenticatedApiRequestOptions

/** Create a new vouchertransaction code
 *
 * ```typescript
 * const vouchertransaction = await createVoucherTransaction({
 *   vouchertransaction: {
 *     trayId: 2343,
 *     number: 2, // Combination of trayId and number must be unique
 *     width: 2,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(vouchertransaction)
 * ```
 *
 * The new vouchertransaction will be returned.
 *
 * The combination of trayId and number must be unique.
 */
export const createVoucherTransaction = async (
  options: CreateVoucherTransactionOptions
): Promise<Voucher & VoucherTransactions> => {
  const requestBody = convertVoucherTransactionToRequest(options.voucherTransaction)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateVoucherTransactionResponseSchema },
    "PUT",
    `cashvouchercredit/${options.voucherId}`,
    requestBody
  )

  const voucher = convertApiVoucherWithTransactions(response)

  return voucher
}
