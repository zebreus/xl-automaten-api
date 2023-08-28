import {
  EditableSupplier,
  NewSupplier,
  Supplier,
  apiCreateSupplierResponseSchema,
  apiDeleteSupplierResponseSchema,
  apiGetSuppliersResponseSchema,
  apiUpdateSupplierResponseSchema,
  convertApiSupplier,
  convertSupplierToCreateRequest,
  convertSupplierToUpdateRequest,
} from "helpers/convertSupplier"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

export type CreateSupplierOptions = {
  /** Data of the new supplier */
  supplier: NewSupplier
} & AuthenticatedApiRequestOptions

/** Create a new supplier code
 *
 * ```typescript
 * const supplier = await createSupplier({
 *   supplier: {
 *     name: "Name of the supplier",
 *     email: "email-of-the-supplier@test.com",
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(supplier)
 * ```
 *
 * The new supplier will be returned.
 */
export const createSupplier = async (options: CreateSupplierOptions): Promise<Supplier> => {
  const requestBody = convertSupplierToCreateRequest(options.supplier)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateSupplierResponseSchema },
    "POST",
    "supplier",
    requestBody
  )

  const supplier = convertApiSupplier(response)

  return supplier
}

export type GetSuppliersOptions = AuthenticatedApiRequestOptions

/** Get all suppliers
 *
 * ```typescript
 * const supplier = await getSuppliers({
 *   token: "your-token",
 * })
 *
 * suppliers.forEach(supplier => console.log(supplier))
 * ```
 */
export const getSuppliers = async (options: GetSuppliersOptions): Promise<Array<Supplier>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetSuppliersResponseSchema }, "GET", `suppliers`)

  const suppliers = response.map(receivedSupplier => convertApiSupplier(receivedSupplier))

  return suppliers
}

export type GetSupplierOptions = {
  /** id of the supplier you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a supplier by its id
 *
 * ```typescript
 * const supplier = await getSupplier({
 *   id: 2000, // ID of an existing supplier
 *   token: "your-token",
 * })
 *
 * console.log(supplier)
 * ```
 *
 * There is no GET endpoint for individual suppliers, so this wraps `getSuppliers` and filters the result.
 */
export const getSupplier = async (options: GetSupplierOptions): Promise<Supplier> => {
  const suppliers = getSuppliers(options)

  const supplier = (await suppliers).find(supplier => supplier.id === options.id)

  if (!supplier) {
    throw new Error(`Entry for Supplier not found`)
  }

  return supplier
}

export type UpdateSupplierOptions = {
  /** ID of the supplier */
  id: number
  /** New data */
  supplier: Partial<EditableSupplier>
} & AuthenticatedApiRequestOptions

/** Update an existing supplier
 *
 * ```typescript
 * const supplier = await updateSupplier({
 *   id: 2000, // ID of an existing supplier
 *   supplier: {
 *     name: "New name of the supplier",
 *     email: "new-email-of-the-supplier@test.com"
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(supplier)
 * ```
 *
 * The updated supplier will be returned.
 */
export const updateSupplier = async (options: UpdateSupplierOptions): Promise<Supplier> => {
  const requestedChanges = options.supplier
  const supplierUpdate =
    requestedChanges.name != null
      ? {
          ...requestedChanges,
          name: requestedChanges.name,
        }
      : { ...(await getSupplier({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertSupplierToUpdateRequest(supplierUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdateSupplierResponseSchema },
    "PUT",
    `supplier/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const supplier = convertApiSupplier(response)

  return supplier
}

export type DeleteSupplierOptions = {
  /** ID of the supplier you want to delete */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a supplier
 *
 * ```typescript
 * const supplier = await deleteSupplier({
 *   id: 2000, // ID of an existing supplier
 *   token: "your-token",
 * })
 *
 * console.log(supplier)
 * ```
 *
 * The last state of the deleted supplier will be returned.
 */
export const deleteSupplier = async (options: DeleteSupplierOptions): Promise<Supplier> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeleteSupplierResponseSchema },
    "DELETE",
    `supplier/${encodeURIComponent(options.id)}`
  )

  const supplier = convertApiSupplier(response)

  return supplier
}
