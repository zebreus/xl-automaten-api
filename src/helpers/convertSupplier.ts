import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiXlAutomatenDatabaseObject,
} from "helpers/convertXlAutomatenDatabaseObject"
import { z } from "zod"

/** A supplier */
export type Supplier = {
  /** Name of the supplier */
  name: string
  /** Email of the supplier */
  email: string
} & XlAutomatenDatabaseObject

/** Supplier, but only the fields that can be edited */
export type EditableSupplier = Omit<Supplier, keyof XlAutomatenDatabaseObject>

/** Data of a new supplier
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewSupplier = Required<Pick<Supplier, "name" | "email">> & Partial<EditableSupplier>
export type UpdateSupplier = Required<Pick<Supplier, "name">> & Partial<EditableSupplier>

export type ApiSupplier = {
  /** Name of the supplier */
  name: string
  /** Email of the supplier */
  email: string
}

export const apiSupplierSchema = z.object({
  name: z.string(),
  email: z.string(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiSupplierSchema> = undefined as unknown as ApiSupplier
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiSupplier = undefined as unknown as z.infer<typeof apiSupplierSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

const fieldsRequiredForCreate = ["name", "email"] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsRequiredForUpdate = ["name"] as const
type FieldsRequiredForUpdate = (typeof fieldsRequiredForUpdate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsRequiredForUpdateMap = fieldsRequiredForUpdate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForUpdate, true>
)

const fieldsThatAreReadOnly = [] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = ["name", "email"] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Supplier, at least the fields are included */
export type MinimalApiSupplierResponse = Required<Pick<ApiSupplier, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiSupplier> &
  ApiXlAutomatenDatabaseObject

export const minimalSupplierResponseSchema = apiSupplierSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .and(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreateSupplierRequest = Required<Pick<ApiSupplier, FieldsRequiredForCreate>> & Partial<ApiSupplier>
export type ApiCreateSupplierResponse = MinimalApiSupplierResponse

export const apiCreateSupplierResponseSchema = minimalSupplierResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateSupplierResponseSchema> = undefined as unknown as ApiCreateSupplierResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateSupplierResponse = undefined as unknown as z.infer<typeof apiCreateSupplierResponseSchema>
}

export type ApiUpdateSupplierRequest = Required<
  Omit<Pick<ApiSupplier, FieldsRequiredForUpdate>, FieldsThatAreReadOnly>
> &
  Partial<ApiSupplier>
export type ApiUpdateSupplierResponse = ApiSupplier & ApiXlAutomatenDatabaseObject

export const apiUpdateSupplierResponseSchema = apiSupplierSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateSupplierResponseSchema> = undefined as unknown as ApiUpdateSupplierResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateSupplierResponse = undefined as unknown as z.infer<typeof apiUpdateSupplierResponseSchema>
}

export type ApiDeleteSupplierRequest = void
export type ApiDeleteSupplierResponse = ApiSupplier & ApiXlAutomatenDatabaseObject

export const apiDeleteSupplierResponseSchema = apiSupplierSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteSupplierResponseSchema> = undefined as unknown as ApiDeleteSupplierResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteSupplierResponse = undefined as unknown as z.infer<typeof apiDeleteSupplierResponseSchema>
}

export type ApiGetSuppliersRequest = void
export type ApiGetSuppliersResponse = Array<ApiSupplier & ApiXlAutomatenDatabaseObject>

export const apiGetSuppliersResponseSchema = z.array(apiSupplierSchema.and(apiXlAutomatenDatabaseObjectSchema))

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetSuppliersResponseSchema> = undefined as unknown as ApiGetSuppliersResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetSuppliersResponse = undefined as unknown as z.infer<typeof apiGetSuppliersResponseSchema>
}

export const convertApiSupplier = (response: MinimalApiSupplierResponse): Supplier => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    name: response.name,
    email: response.email,
  } satisfies Supplier

  return result
}

export const convertSupplierToCreateRequest = (request: NewSupplier): ApiCreateSupplierRequest => {
  const result = {
    name: request.name,
    email: request.email,
  } satisfies ApiCreateSupplierRequest

  return result
}

export const convertSupplierToUpdateRequest = (request: UpdateSupplier): ApiUpdateSupplierRequest => {
  const result = {
    name: request.name,
    ...(request.email != null ? { email: request.email } : {}),
  } satisfies ApiUpdateSupplierRequest

  return result
}
