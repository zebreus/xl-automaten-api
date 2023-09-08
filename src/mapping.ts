import {
  EditableMapping,
  Mapping,
  MappingArticle,
  MappingPosition,
  NewMapping,
  apiCreateMappingResponseSchema,
  apiDeleteMappingResponseSchema,
  apiGetMappingResponseSchema,
  apiGetMappingsResponseSchema,
  apiUpdateMappingResponseSchema,
  convertApiMappingWithArticle,
  convertApiMappingWithPosition,
  convertMappingToRequest,
} from "./helpers/convertMapping.js"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "./helpers/makeApiRequest.js"

export type CreateMappingOptions = {
  /** Data of the new mapping */
  mapping: NewMapping
} & AuthenticatedApiRequestOptions

/** Create a new mapping code
 *
 * If the same combination of articleId and positionId already exists, the old mapping will be removed.
 *
 * ```typescript
 * const mapping = await createMapping({
 *   mapping: {
 *     articleId: 2343,
 *     positionId: 5545,
 *     inventory: 2, // Optional
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(mapping)
 * ```
 *
 * The new mapping will be returned.
 *
 * The combination of trayId and number must be unique.
 */
export const createMapping = async (options: CreateMappingOptions): Promise<Mapping & MappingPosition> => {
  const requestBody = convertMappingToRequest(options.mapping)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateMappingResponseSchema },
    "POST",
    "mapping",
    requestBody
  )

  const createdMapping = response.find(
    mapping => mapping.article_id === options.mapping.articleId && mapping.position_id === options.mapping.positionId
  )
  if (!createdMapping) {
    throw new Error("Failed to create a new mapping: The API did not return the new mapping.")
  }

  const mapping = convertApiMappingWithPosition(createdMapping)

  return mapping
}

export type GetMappingOptions = {
  /** id of the mapping you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a mapping by its id
 *
 * ```typescript
 * const mapping = await getMapping({
 *   id: 2000, // ID of an existing mapping
 *   token: "your-token",
 * })
 *
 * console.log(mapping)
 * ```
 */
export const getMapping = async (options: GetMappingOptions): Promise<Mapping & MappingPosition> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetMappingResponseSchema },
    "GET",
    `mapping/${encodeURIComponent(options.id)}`
  )

  const mapping = convertApiMappingWithPosition(response)

  return mapping
}

export type GetMappingsOptions = AuthenticatedApiRequestOptions

/** Get all mappings
 *
 * ```typescript
 * const mapping = await getMappings({
 *   token: "your-token",
 * })
 *
 * mappings.forEach(mapping => console.log(mapping))
 * ```
 */
export const getMappings = async (options: GetMappingsOptions): Promise<Array<Mapping & MappingPosition>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetMappingsResponseSchema }, "GET", `mappings`)

  const mappings = response.map(receivedMapping => convertApiMappingWithPosition(receivedMapping))

  return mappings
}

export type UpdateMappingOptions = {
  /** ID of the mapping */
  id: number
  /** All fields that should get updated */
  mapping: Partial<EditableMapping>
} & AuthenticatedApiRequestOptions

/** Update an existing mapping
 *
 * You can only edit the width of a mapping.
 *
 * ```typescript
 * const mapping = await updateMapping({
 *   id: 2000, // ID of an existing mapping
 *   mapping: {
 *     inventory: 6,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(mapping)
 * ```
 *
 * The updated mapping will be returned.
 */
export const updateMapping = async (options: UpdateMappingOptions): Promise<Mapping & MappingArticle> => {
  const requestedChanges = options.mapping
  const mappingUpdate = { ...(await getMapping({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertMappingToRequest(mappingUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdateMappingResponseSchema },
    "PUT",
    `mapping/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const mapping = convertApiMappingWithArticle(response)

  return mapping
}

export type DeleteMappingOptions = {
  /** ID of the mapping you want to delete */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a mapping
 *
 * ```typescript
 * const remainingMappings = await deleteMapping({
 *   id: 2000, // ID of an existing mapping
 *   token: "your-token",
 * })
 *
 * console.log(remainingMappings)
 * ```
 *
 * The remaining mappings will be returned.
 */
export const deleteMapping = async (options: DeleteMappingOptions): Promise<Array<Mapping & MappingPosition>> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeleteMappingResponseSchema },
    "DELETE",
    `mapping/${encodeURIComponent(options.id)}`
  )

  const remainingMappings = response.map(receivedMapping => convertApiMappingWithPosition(receivedMapping))

  return remainingMappings
}
