import { parseApiDate } from "helpers/apiDates"
import { z } from "zod"

export type XlAutomatenDatabaseObject = {
  /** When the data was last changed
   *
   * Precision finer than seconds is not supported and is ignored
   */
  updatedAt: Date
  /** When the data was created
   *
   * Precision finer than seconds is not supported and is ignored
   */
  createdAt: Date
  /** Internal id */
  id: number
}

/** A machine */
export type Machine = {
  /** Name of the machine */
  name: string
  /** Displayname of the machine */
  displayName: string
  /** Serialnumber of the physical machine
   *
   * Needs to be unique
   */
  serialNumber: string
  /** A string indicating where the machine is placed */
  place: string
  /** Whether the machine is in test mode? */
  testMode: boolean
  /** TODO: Figure out what this means */
  tempStopTemp: number
  /** TODO: Figure out what this means */
  tempStopTime: number
  /** TODO: Figure out what this means */
  tempWarningTemp: number
  /** TODO: Figure out what this means */
  tempWarningTime: number
  /** When the machine was last connected
   *
   * Cannot be set
   */
  lastConnected?: Date
  /** ID of the associated Mastermodule */
  mastermoduleId?: number
  /** Whether the machine is active
   *
   * Default: 1
   */
  active: boolean
  /** Do you even lift bro?
   *
   * TODO: Figure out what this means
   *
   * Default: 1
   */
  lift: boolean
  /** TODO: Figure out what this means */
  liftMax?: number
  /** TODO: Figure out what this means
   *
   * Needs to be a number in a string
   */
  liftA?: string
  /** TODO: Figure out what this means
   *
   * Needs to be a number in a string
   */
  liftB?: string
  /** TODO: Figure out what this means
   *
   * Needs to be a number in a string
   */
  liftC?: string
  /** TODO: Figure out what this means */
  liftMeasurements?: string
  /** TODO: Figure out what this means
   *
   * Default: 0
   */
  liftRoll: number
  /** TODO: Figure out what this means */
  liftDifferenceBackFront?: number
  /** When the machine was last filled
   *
   * Cannot be set
   */
  lastFilled?: Date
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  photocell?: boolean
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  lastStatusUpdate?: Date
  /** TODO: Figure out what this means
   */
  softwareVersion?: number
  /** TODO: Figure out what this means
   *
   * Default: 0
   */
  filledItems: number
} & XlAutomatenDatabaseObject

/** Machine, but only the fields that can be edited */
export type EditableMachine = Omit<
  Machine,
  | keyof XlAutomatenDatabaseObject
  | "lastConnected"
  | "lastFilled"
  | "pushDoor"
  | "door"
  | "liftDown"
  | "liftUp"
  | "photocell"
  | "lastStatusUpdate"
>

/** Data of a new machine
 *
 * All fields that are not required for creating are set to optional.
 */
export type NewMachine = Required<
  Pick<
    Machine,
    | "name"
    | "displayName"
    | "serialNumber"
    | "place"
    | "testMode"
    | "tempStopTemp"
    | "tempStopTime"
    | "tempWarningTemp"
    | "tempWarningTime"
  >
> &
  Partial<EditableMachine>

export type ApiXlAutomatenDatabaseObject = {
  /** With seconds */
  updated_at: string
  /** With seconds */
  created_at: string
  /** Internal id */
  id: number
}

export const apiXlAutomatenDatabaseObjectSchema = z.object({
  updated_at: z.string(),
  created_at: z.string(),
  id: z.number(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiXlAutomatenDatabaseObjectSchema> = undefined as unknown as ApiXlAutomatenDatabaseObject
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiXlAutomatenDatabaseObject = undefined as unknown as z.infer<typeof apiXlAutomatenDatabaseObjectSchema>
}

export type ApiMachine = {
  /** Name of the machine */
  name: string
  /** Displayname of the machine */
  display_name: string
  /** Serialnumber of the physical machine
   *
   * Needs to be unique
   */
  serial_number: string
  /** A string indicating where the machine is placed */
  place: string
  /** Whether the machine is in test mode? */
  test_mode: 0 | 1
  /** TODO: Figure out what this means */
  temp_stop_temp: number
  /** TODO: Figure out what this means */
  temp_stop_time: number
  /** TODO: Figure out what this means */
  temp_warning_temp: number
  /** TODO: Figure out what this means */
  temp_warning_time: number
  /** When the machine was last connected
   *
   * Cannot be set
   */
  last_connected: string | null
  /** ID of the associated Mastermodule */
  mastermodule_id: number | null
  /** Whether the machine is active
   *
   * Default: 1
   */
  active: 0 | 1
  /** Do you even lift bro?
   *
   * TODO: Figure out what this means
   *
   * Default: 1
   */
  lift: 0 | 1
  /** TODO: Figure out what this means */
  lift_max: number | null
  /** TODO: Figure out what this means
   *
   * Needs to be a number in a string
   */
  lift_a: string | null
  /** TODO: Figure out what this means
   *
   * Needs to be a number in a string
   */
  lift_b: string | null
  /** TODO: Figure out what this means
   *
   * Needs to be a number in a string
   */
  lift_c: string | null
  /** TODO: Figure out what this means */
  lift_measurements: string | null
  /** TODO: Figure out what this means
   *
   * Default: 0
   */
  lift_roll: number
  /** TODO: Figure out what this means */
  lift_difference_back_front: number | null
  /** When the machine was last filled
   *
   * Cannot be set
   */
  last_filled: string | null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  push_door: null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  door: null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  lift_down: null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  lift_up: null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  photocell: 0 | 1 | null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  last_status_update: string | null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  software_version: number | null
  /** TODO: Figure out what this means
   *
   * Default: 0
   */
  filled_items: number
}

export const apiMachineSchema = z.object({
  name: z.string(),
  display_name: z.string(),
  serial_number: z.string(),
  place: z.string(),
  test_mode: z.literal(0).or(z.literal(1)),
  temp_stop_temp: z.number(),
  temp_stop_time: z.number(),
  temp_warning_temp: z.number(),
  temp_warning_time: z.number(),
  last_connected: z.string().nullable(),
  mastermodule_id: z.number().nullable(),
  active: z.literal(0).or(z.literal(1)),
  lift: z.literal(0).or(z.literal(1)),
  lift_max: z.number().nullable(),
  lift_a: z.string().nullable(),
  lift_b: z.string().nullable(),
  lift_c: z.string().nullable(),
  lift_measurements: z.string().nullable(),
  lift_roll: z.number(),
  lift_difference_back_front: z.number().nullable(),
  last_filled: z.string().nullable(),
  push_door: z.null(),
  door: z.null(),
  lift_down: z.null(),
  lift_up: z.null(),
  photocell: z.literal(0).or(z.literal(1)).nullable(),
  last_status_update: z.string().nullable(),
  software_version: z.number().nullable(),
  filled_items: z.number(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineSchema> = undefined as unknown as ApiMachine
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachine = undefined as unknown as z.infer<typeof apiMachineSchema>
}

export type ApiMachineListExtraFields = {
  latest_temperature: number | null
  parameters: Array<never>
  /** Categories that are associated with this machine */
  trays: Array<unknown>
  coin_changer: null
}

export const apiMachineListExtraFieldsSchema = z.object({
  latest_temperature: z.number().nullable(),
  parameters: z.array(z.never()),
  trays: z.array(z.unknown()),
  coin_changer: z.null(),
})

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineListExtraFieldsSchema> = undefined as unknown as ApiMachineListExtraFields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachineListExtraFields = undefined as unknown as z.infer<typeof apiMachineListExtraFieldsSchema>
}

type PartialOrUndefined<T> = {
  [P in keyof T]?: T[P] | undefined
}

// requiredFields need to be explicitly set when created
// constFields can only be set at creation
// lockedFields cannot be changed by us

const fieldsRequiredForCreate = [
  "name",
  "display_name",
  "serial_number",
  "place",
  "test_mode",
  "temp_stop_temp",
  "temp_stop_time",
  "temp_warning_temp",
  "temp_warning_time",
] as const
type FieldsRequiredForCreate = (typeof fieldsRequiredForCreate)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsWithoutDefaultMap = fieldsRequiredForCreate.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsRequiredForCreate, true>
)

const fieldsThatAreReadOnly = [
  "last_connected",
  "last_filled",
  "push_door",
  "door",
  "lift_down",
  "lift_up",
  "photocell",
  "last_status_update",
] as const
type FieldsThatAreReadOnly = (typeof fieldsThatAreReadOnly)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsThatAreReadOnlyMap = fieldsThatAreReadOnly.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatAreReadOnly, true>
)

const fieldsThatWillAlwaysGetReturned = [
  "name",
  "display_name",
  "serial_number",
  "place",
  "test_mode",
  "temp_stop_temp",
  "temp_stop_time",
  "temp_warning_temp",
  "temp_warning_time",
] as const
type FieldsThatWillAlwaysGetReturned = (typeof fieldsThatWillAlwaysGetReturned)[number]
const fieldsThatWillAlwaysGetReturnedMap = fieldsThatWillAlwaysGetReturned.reduce(
  (acc, cur) => ({ ...acc, [cur]: true as const }),
  {} as Record<FieldsThatWillAlwaysGetReturned, true>
)

/** If the server responds with a Machine, at least the fields are included */
export type MinimalApiMachineResponse = Required<Pick<ApiMachine, FieldsThatWillAlwaysGetReturned>> &
  PartialOrUndefined<ApiMachine> &
  ApiXlAutomatenDatabaseObject

export const minimalMachineResponseSchema = apiMachineSchema
  .partial()
  .required(fieldsThatWillAlwaysGetReturnedMap)
  .and(apiXlAutomatenDatabaseObjectSchema)

export type ApiCreateMachineRequest = Required<Pick<Omit<ApiMachine, FieldsThatAreReadOnly>, FieldsRequiredForCreate>> &
  Partial<ApiMachine>
export type ApiCreateMachineResponse = MinimalApiMachineResponse

export const apiCreateMachineResponseSchema = minimalMachineResponseSchema

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiCreateMachineResponseSchema> = undefined as unknown as ApiCreateMachineResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiCreateMachineResponse = undefined as unknown as z.infer<typeof apiCreateMachineResponseSchema>
}

export type ApiUpdateMachineRequest = ApiCreateMachineRequest
export type ApiUpdateMachineResponse = ApiMachine & ApiXlAutomatenDatabaseObject

export const apiUpdateMachineResponseSchema = apiMachineSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateMachineResponseSchema> = undefined as unknown as ApiUpdateMachineResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateMachineResponse = undefined as unknown as z.infer<typeof apiUpdateMachineResponseSchema>
}

export type ApiGetMachineRequest = void
export type ApiGetMachineResponse = ApiMachine & ApiXlAutomatenDatabaseObject

export const apiGetMachineResponseSchema = apiMachineSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMachineResponseSchema> = undefined as unknown as ApiGetMachineResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMachineResponse = undefined as unknown as z.infer<typeof apiGetMachineResponseSchema>
}

export type ApiDeleteMachineRequest = void
export type ApiDeleteMachineResponse = ApiMachine & ApiXlAutomatenDatabaseObject

export const apiDeleteMachineResponseSchema = apiMachineSchema.and(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteMachineResponseSchema> = undefined as unknown as ApiGetMachineResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteMachineResponse = undefined as unknown as z.infer<typeof apiDeleteMachineResponseSchema>
}

export type ApiGetMachinesRequest = void
export type ApiGetMachinesResponse = Array<ApiMachine & ApiXlAutomatenDatabaseObject & ApiMachineListExtraFields>

export const apiGetMachinesResponseSchema = z.array(
  apiMachineSchema.and(apiXlAutomatenDatabaseObjectSchema).and(apiMachineListExtraFieldsSchema)
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMachinesResponseSchema> = undefined as unknown as ApiGetMachinesResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMachinesResponse = undefined as unknown as z.infer<typeof apiGetMachinesResponseSchema>
}

export const convertApiMachine = (response: MinimalApiMachineResponse): Machine => {
  const result = {
    updatedAt: parseApiDate(response.updated_at),
    createdAt: parseApiDate(response.created_at),
    id: response.id,
    name: response.name,
    displayName: response.display_name,
    serialNumber: response.serial_number,
    place: response.place,
    testMode: response.test_mode === 1,
    tempStopTemp: response.temp_stop_temp,
    tempStopTime: response.temp_stop_time,
    tempWarningTemp: response.temp_warning_temp,
    tempWarningTime: response.temp_warning_time,
    ...(response.last_connected != null ? { lastConnected: parseApiDate(response.last_connected) } : {}),
    ...(response.mastermodule_id != null ? { mastermoduleId: response.mastermodule_id } : {}),
    active: response.active === 1,
    lift: response.lift === 1,
    ...(response.lift_max != null ? { liftMax: response.lift_max } : {}),
    ...(response.lift_a != null ? { liftA: response.lift_a } : {}),
    ...(response.lift_b != null ? { liftB: response.lift_b } : {}),
    ...(response.lift_c != null ? { liftC: response.lift_c } : {}),
    ...(response.lift_measurements != null ? { liftMeasurements: response.lift_measurements } : {}),
    liftRoll: response.lift_roll ?? 0,
    ...(response.lift_difference_back_front != null
      ? { liftDifferenceBackFront: response.lift_difference_back_front }
      : {}),
    ...(response.last_filled != null ? { lastFilled: parseApiDate(response.last_filled) } : {}),
    ...(response.photocell != null ? { photocell: response.photocell === 1 } : {}),
    ...(response.last_status_update != null ? { lastStatusUpdate: parseApiDate(response.last_status_update) } : {}),
    ...(response.software_version != null ? { softwareVersion: response.software_version } : {}),
    filledItems: response.filled_items ?? 0,
  } satisfies Machine

  return result
}

export const convertMachineToRequest = (request: NewMachine): ApiCreateMachineRequest => {
  const result = {
    name: request.name,
    display_name: request.displayName,
    serial_number: request.serialNumber,
    place: request.place,
    test_mode: request.testMode ? 1 : 0,
    temp_stop_temp: request.tempStopTemp,
    temp_stop_time: request.tempStopTime,
    temp_warning_temp: request.tempWarningTemp,
    temp_warning_time: request.tempWarningTime,
    ...("mastermoduleId" in request ? { mastermodule_id: request.mastermoduleId ?? null } : {}),
    ...("active" in request ? { active: request.active ? 1 : 0 } : {}),
    ...("lift" in request ? { lift: request.lift ? 1 : 0 } : {}),
    ...("liftMax" in request ? { lift_max: request.liftMax ?? null } : {}),
    ...("liftA" in request ? { lift_a: request.liftA ?? null } : {}),
    ...("liftB" in request ? { lift_b: request.liftB ?? null } : {}),
    ...("liftC" in request ? { lift_c: request.liftC ?? null } : {}),
    ...("liftMeasurements" in request ? { lift_measurements: request.liftMeasurements ?? null } : {}),
    ...("liftRoll" in request ? { lift_roll: request.liftRoll } : {}),
    ...("liftDifferenceBackFront" in request
      ? { lift_difference_back_front: request.liftDifferenceBackFront ?? null }
      : {}),
    ...("photocell" in request ? { photocell: request.photocell ? 1 : 0 } : {}),
    ...("softwareVersion" in request ? { software_version: request.softwareVersion ?? null } : {}),
    ...("filledItems" in request ? { filled_items: request.filledItems ?? null } : {}),
  } satisfies ApiCreateMachineRequest

  return result
}
