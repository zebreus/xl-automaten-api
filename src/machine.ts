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
  /** The new machine */
  machine: NewMachine
} & AuthenticatedApiRequestOptions

/** Create a new machine
 *
 * ```typescript
 * const machine = await createMachine({
 *   machine: {
 *     name: "Name of the machine",
 *     displayName: "Displayed to the user",
 *     serialNumber: "123456",
 *     place: "Where the machine is located",
 *     testMode: true,
 *     tempStopTemp: 8,
 *     tempStopTime: 45,
 *     tempWarningTemp: 12,
 *     tempWarningTime: 30,
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
  /** ID of the machine you want to retrieve */
  id: number
} & AuthenticatedApiRequestOptions

/** Get a machine by its ID
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
  /** Updates to the machine */
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
  /** ID of the machine you want to delete */
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
