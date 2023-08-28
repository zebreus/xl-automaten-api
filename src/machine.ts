import {
  EditableMachine,
  Machine,
  MachineExtraFields,
  MachineTrays,
  NewMachine,
  apiCreateMachineResponseSchema,
  apiDeleteMachineResponseSchema,
  apiGetMachineResponseSchema,
  apiGetMachinesResponseSchema,
  apiUpdateMachineResponseSchema,
  convertApiMachine,
  convertApiMachineWithExtraFields,
  convertApiMachineWithTrays,
  convertMachineToRequest,
} from "helpers/convertMachine"
import { AuthenticatedApiRequestOptions, makeApiRequest } from "helpers/makeApiRequest"

type CreateMachineOptions = {
  /** Data of the new machine */
  machine: NewMachine
} & AuthenticatedApiRequestOptions

/** Create a new machine code
 *
 * ```typescript
 * const machine = await createMachine({
 *   machine: {
 *     name: "name-of-the-new-machine"
 *     number: "123456",
 *     price: 4,
 *     supplierId: supplierId,
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(machine)
 * ```
 *
 * The new machine will be returned.
 */
export const createMachine = async (options: CreateMachineOptions): Promise<Machine> => {
  const requestBody = convertMachineToRequest(options.machine)
  const response = await makeApiRequest(
    { ...options, schema: apiCreateMachineResponseSchema },
    "POST",
    "machine",
    requestBody
  )

  const machine = convertApiMachine(response)

  return machine
}

type GetMachineOptions = {
  /** id of the machine you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a machine by its id
 *
 * ```typescript
 * const machine = await getMachine({
 *   id: 2000, // ID of an existing machine
 *   token: "your-token",
 * })
 *
 * console.log(machine)
 * ```
 */
export const getMachine = async (options: GetMachineOptions): Promise<Machine> => {
  const response = await makeApiRequest(
    { ...options, schema: apiGetMachineResponseSchema },
    "GET",
    `machine/${encodeURIComponent(options.id)}`
  )

  const machine = convertApiMachine(response)

  return machine
}

type GetMachinesOptions = AuthenticatedApiRequestOptions

/** Get all machines
 *
 * ```typescript
 * const machine = await getMachines({
 *   token: "your-token",
 * })
 *
 * machines.forEach(machine => console.log(machine))
 * ```
 */
export const getMachines = async (
  options: GetMachinesOptions
): Promise<Array<Machine & MachineTrays & MachineExtraFields>> => {
  const response = await makeApiRequest({ ...options, schema: apiGetMachinesResponseSchema }, "GET", `machines`)

  const machines = response.map(receivedMachine => convertApiMachineWithExtraFields(receivedMachine))

  return machines
}

type UpdateMachineOptions = {
  /** ID of the machine */
  id: number
  /** New data
   *
   * Needs to include all fields that are required when creating a new machine.
   */
  machine: Partial<EditableMachine>
} & AuthenticatedApiRequestOptions

/** Update an existing machine
 *
 * ```typescript
 * const machine = await updateMachine({
 *   id: 2000, // ID of an existing machine
 *   machine: {
 *     name: "New name of the machine"
 *   },
 *   token: "your-token",
 * })
 *
 * console.log(machine)
 * ```
 *
 * The updated machine will be returned.
 */
export const updateMachine = async (options: UpdateMachineOptions): Promise<Machine> => {
  const requestedChanges = options.machine
  const machineUpdate =
    requestedChanges.name != null &&
    requestedChanges.displayName != null &&
    requestedChanges.serialNumber != null &&
    requestedChanges.place != null &&
    requestedChanges.testMode != null &&
    requestedChanges.tempStopTemp != null &&
    requestedChanges.tempStopTime != null &&
    requestedChanges.tempWarningTemp != null &&
    requestedChanges.tempWarningTime != null
      ? {
          ...requestedChanges,
          name: requestedChanges.name,
          displayName: requestedChanges.displayName,
          serialNumber: requestedChanges.serialNumber,
          place: requestedChanges.place,
          testMode: requestedChanges.testMode,
          tempStopTemp: requestedChanges.tempStopTemp,
          tempStopTime: requestedChanges.tempStopTime,
          tempWarningTemp: requestedChanges.tempWarningTemp,
          tempWarningTime: requestedChanges.tempWarningTime,
        }
      : { ...(await getMachine({ id: options.id, token: options.token })), ...requestedChanges }

  const requestBody = convertMachineToRequest(machineUpdate)
  const response = await makeApiRequest(
    { ...options, schema: apiUpdateMachineResponseSchema },
    "PUT",
    `machine/${encodeURIComponent(options.id)}`,
    requestBody
  )

  const machine = convertApiMachine(response)

  return machine
}

type DeleteMachineOptions = {
  /** id of the machine you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Delete a machine
 *
 * ```typescript
 * const machine = await deleteMachine({
 *   id: 2000, // ID of an existing machine
 *   token: "your-token",
 * })
 *
 * console.log(machine)
 * ```
 *
 * The last state of the deleted machine will be returned.
 */
export const deleteMachine = async (options: DeleteMachineOptions): Promise<Machine & MachineTrays> => {
  const response = await makeApiRequest(
    { ...options, schema: apiDeleteMachineResponseSchema },
    "DELETE",
    `machine/${encodeURIComponent(options.id)}`
  )

  const machine = convertApiMachineWithTrays(response)

  return machine
}
