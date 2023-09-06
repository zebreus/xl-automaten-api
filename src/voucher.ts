import {
  EditableVoucher,
  NewVoucher,
  Voucher,
  VoucherTransactions,
  apiCreateVoucherResponseSchema,
  apiDeleteVoucherResponseSchema,
  apiGetVoucherResponseSchema,
  apiGetVouchersResponseSchema,
  apiUpdateVoucherResponseSchema,
  convertApiVoucher,
  convertApiVoucherWithTransactions,
  convertVoucherToRequest,
} from "helpers/convertVoucher"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

export type CreateVoucherOptions = {
  /** Data of the new voucher */
  voucher: NewVoucher
} & AuthenticatedApiRequestOptions

/** Create a new voucher code
 *
 * ```typescript
 * const voucher = await createVoucher({
 *   voucher: {
 *     trayId: 2343,
 *     number: 2, // Combination of trayId and number must be unique
 *     width: 2,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(voucher)
 * ```
 *
 * The new voucher will be returned.
 *
 * The combination of trayId and number must be unique.
 */
export const createVoucher = async (options: CreateVoucherOptions): Promise<Voucher> => {
  const requestBody = convertVoucherToRequest(options.voucher)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateVoucherResponseSchema },
    "POST",
    "cashvoucher",
    requestBody
  )

  const voucher = convertApiVoucher(response)

  return voucher
}

export type GetVoucherOptions = {
  /** id of the voucher you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a voucher by its id
 *
 * ```typescript
 * const voucher = await getVoucher({
 *   id: 2000, // ID of an existing voucher
 *   token: "your-token",
 * })
 *
 * console.log(voucher)
 * ```
 */
export const getVoucher = async (options: GetVoucherOptions): Promise<Voucher & VoucherTransactions> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetVoucherResponseSchema },
    "GET",
    `cashvoucher/${encodeURIComponent(options.id)}`
  )

  const voucher = convertApiVoucherWithTransactions(response)

  return voucher
}

export type GetVouchersOptions = AuthenticatedApiRequestOptions

/** Get all vouchers
 *
 * ```typescript
 * const voucher = await getVouchers({
 *   token: "your-token",
 * })
 *
 * vouchers.forEach(voucher => console.log(voucher))
 * ```
 */
export const getVouchers = async (options: GetVouchersOptions): Promise<Array<Voucher>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetVouchersResponseSchema }, "GET", `cashvouchers`)

  const vouchers = response.map(receivedVoucher => convertApiVoucher(receivedVoucher))

  return vouchers
}

export type UpdateVoucherOptions = {
  /** ID of the voucher */
  id: number
  /** All fields that should get updated */
  voucher: Partial<EditableVoucher>
} & AuthenticatedApiRequestOptions

/** Update an existing voucher
 *
 * You can only edit the width of a voucher.
 *
 * ```typescript
 * const voucher = await updateVoucher({
 *   id: 2000, // ID of an existing voucher
 *   voucher: {
 *     width: 2
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(voucher)
 * ```
 *
 * The updated voucher will be returned.
 */
export const updateVoucher = async (options: UpdateVoucherOptions): Promise<Voucher> => {
  const requestedChanges = options.voucher
  const voucherUpdate = { ...(await getVoucher({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertVoucherToRequest(voucherUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdateVoucherResponseSchema },
    "PUT",
    `cashvoucher/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const voucher = convertApiVoucher(response)

  return voucher
}

export type DeleteVoucherOptions = {
  /** ID of the voucher you want to delete */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a voucher
 *
 * ```typescript
 * const voucher = await deleteVoucher({
 *   id: 2000, // ID of an existing voucher
 *   token: "your-token",
 * })
 *
 * console.log(voucher)
 * ```
 *
 * The last state of the deleted voucher will be returned.
 */
export const deleteVoucher = async (options: DeleteVoucherOptions): Promise<Voucher> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeleteVoucherResponseSchema },
    "DELETE",
    `cashvoucher/${encodeURIComponent(options.id)}`
  )

  const voucher = convertApiVoucher(response)

  return voucher
}
