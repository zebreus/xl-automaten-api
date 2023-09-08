import { z } from "zod"
import { ApiVoucher, ApiVoucherTransactions, apiVoucherSchema, apiVoucherTransactionsSchema } from "./convertVoucher.js"
import { ApiXlAutomatenDatabaseObject, apiXlAutomatenDatabaseObjectSchema } from "./convertXlAutomatenDatabaseObject.js"

export type ApiCreateVoucherTransactionResponse = ApiVoucher & ApiXlAutomatenDatabaseObject & ApiVoucherTransactions

export const apiCreateVoucherTransactionResponseSchema = apiVoucherSchema
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .merge(apiVoucherTransactionsSchema)
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateVoucherTransactionResponseSchema> =
    undefined as unknown as ApiCreateVoucherTransactionResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateVoucherTransactionResponse = undefined as unknown as z.infer<
    typeof apiCreateVoucherTransactionResponseSchema
  >
}
