import { parseApiDate } from "helpers/apiDates"
import {
  ApiTray,
  ApiTrayPositions,
  Tray,
  TrayPositions,
  apiTrayPositionsSchema,
  apiTraySchema,
  convertApiTrayWithPositions,
} from "helpers/convertTray"
import {
  ApiXlAutomatenDatabaseObject,
  XlAutomatenDatabaseObject,
  apiXlAutomatenDatabaseObjectSchema,
  convertApiXlAutomatenDatabaseObject,
} from "helpers/convertXlAutomatenDatabaseObject"
import { z } from "zod"

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
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  lastConnected?: number
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
  liftMeasurements?: Array<MachineLiftMeasurements>
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
  pushDoor?: boolean
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  door?: boolean
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  liftDown?: boolean
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  liftUp?: boolean
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

export type MachineTemperature = {
  /** The temperature in Celsius */
  temperature: number
  machineId: number
} & XlAutomatenDatabaseObject

export type MachineTrays = {
  /** Trays that are associated with this machine
   *
   * The trays also include their associated positions
   */
  trays: Array<Tray & TrayPositions>
}

export type MachineExtraFields = MachineTrays & {
  /** The latest temperature that was measured */
  latestTemperature?: MachineTemperature
  /** The coin changer of the machine */
  coinChanger?: MachineCoinChanger
}

export type MachineLiftMeasurements = {
  level: number
  mm: number
  /** Finished is the only confirmed status, I guessed the rest */
  status: "finished" | "error" | "running"
}

export type MachineCoinChanger = {
  /** Number of 5 cent coins */
  c5: number
  /** Number of 10 cent coins */
  c10: number
  /** Number of 20 cent coins */
  c20: number
  /** Number of 50 cent coins */
  c50: number
  /** Number of 1 euro coins */
  c100: number
  /** Number of 2 euro coins */
  c200: number
  /** ID of the associated machine */
  machineId: number
  /** Cash in the cash box
   *
   * String containing a floating point number like "0.00"
   */
  cashBox: string
  /** Bills
   *
   * String containing a floating point number like "0.00"
   */
  bills: string
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
  /** TODO: Figure out what this means
   *
   * Cannot be set
   *
   * A number
   */
  last_connected: number | null
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
   * Needs to be a floating point number in a string
   */
  lift_a: string | null
  /** TODO: Figure out what this means
   *
   * Needs to be a floating point number in a string
   */
  lift_b: string | null
  /** TODO: Figure out what this means
   *
   * Needs to be a floating point number in a string
   */
  lift_c: string | null
  /** TODO: Figure out what this means
   *
   * Is a JSON string like
   *
   * "[{\"level\":220,\"mm\":\"507\",\"status\":\"finished\"},{\"level\":430,\"mm\":\"978\",\"status\":\"finished\"},{\"level\":590,\"mm\":\"1369\",\"status\":\"finished\"}]",
   */
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
  push_door: 0 | 1 | null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  door: 0 | 1 | null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  lift_down: 0 | 1 | null
  /** TODO: Figure out what this means
   *
   * Cannot be set
   */
  lift_up: 0 | 1 | null
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

export const apiMachineSchema = z
  .object({
    name: z.string(),
    display_name: z.string(),
    serial_number: z.string(),
    place: z.string(),
    test_mode: z.literal(0).or(z.literal(1)),
    temp_stop_temp: z.number(),
    temp_stop_time: z.number(),
    temp_warning_temp: z.number(),
    temp_warning_time: z.number(),
    last_connected: z.number().nullable(),
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
    push_door: z.literal(0).or(z.literal(1)).nullable(),
    door: z.literal(0).or(z.literal(1)).nullable(),
    lift_down: z.literal(0).or(z.literal(1)).nullable(),
    lift_up: z.literal(0).or(z.literal(1)).nullable(),
    photocell: z.literal(0).or(z.literal(1)).nullable(),
    last_status_update: z.string().nullable(),
    software_version: z.number().nullable(),
    filled_items: z.number(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineSchema> = undefined as unknown as ApiMachine
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachine = undefined as unknown as z.infer<typeof apiMachineSchema>
}

export type ApiMachineLatestTemperature = {
  /** The temperature in Celsius */
  temperature: number
  machine_id: number
} & ApiXlAutomatenDatabaseObject

export const apiMachineLatestTemperatureSchema = z
  .object({
    temperature: z.number(),
    machine_id: z.number(),
  })
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineLatestTemperatureSchema> = undefined as unknown as ApiMachineLatestTemperature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachineLatestTemperature = undefined as unknown as z.infer<typeof apiMachineLatestTemperatureSchema>
}

export type ApiMachineCoinChanger = {
  /** Number of 5 cent coins */
  c5: number
  /** Number of 10 cent coins */
  c10: number
  /** Number of 20 cent coins */
  c20: number
  /** Number of 50 cent coins */
  c50: number
  /** Number of 1 euro coins */
  c100: number
  /** Number of 2 euro coins */
  c200: number
  /** ID of the associated machine */
  machine_id: number
  /** Cash in the cash box
   *
   * String containing a floating point number like "0.00"
   */
  cash_box: string
  /** Bills
   *
   * String containing a floating point number like "0.00"
   */
  bills: string
} & ApiXlAutomatenDatabaseObject

export const apiMachineCoinChangerSchema = z
  .object({
    c5: z.number(),
    c10: z.number(),
    c20: z.number(),
    c50: z.number(),
    c100: z.number(),
    c200: z.number(),
    machine_id: z.number(),
    cash_box: z.string(),
    bills: z.string(),
  })
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineCoinChangerSchema> = undefined as unknown as ApiMachineCoinChanger
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachineCoinChanger = undefined as unknown as z.infer<typeof apiMachineCoinChangerSchema>
}

export type ApiMachineExtraFields = {
  latest_temperature: ApiMachineLatestTemperature | null
  parameters: Array<never>
  coin_changer: ApiMachineCoinChanger | null
}

export const apiMachineExtraFieldsSchema = z
  .object({
    latest_temperature: apiMachineLatestTemperatureSchema.nullable(),
    parameters: z.array(z.never()),
    coin_changer: apiMachineCoinChangerSchema.nullable(),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineExtraFieldsSchema> = undefined as unknown as ApiMachineExtraFields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachineExtraFields = undefined as unknown as z.infer<typeof apiMachineExtraFieldsSchema>
}

export type ApiMachineLiftMeasurements = {
  level: number
  mm: string
  /** Finished is the only confirmed status, I guessed the rest */
  status: "finished" | "error" | "running"
}

export const apiMachineLiftMeasurementsSchema = z
  .object({
    level: z.number(),
    mm: z.string(),
    status: z.enum(["finished", "error", "running"]),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineLiftMeasurementsSchema> = undefined as unknown as ApiMachineLiftMeasurements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachineLiftMeasurements = undefined as unknown as z.infer<typeof apiMachineLiftMeasurementsSchema>
}

export type ApiMachineTrays = {
  /** Trays that are associated with this machine */
  trays: Array<ApiTray & ApiTrayPositions & ApiXlAutomatenDatabaseObject>
}

export const apiMachineTraysSchema = z
  .object({
    trays: z.array(apiTraySchema.merge(apiTrayPositionsSchema).merge(apiXlAutomatenDatabaseObjectSchema).strict()),
  })
  .strict()

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiMachineExtraFieldsSchema> = undefined as unknown as ApiMachineExtraFields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiMachineExtraFields = undefined as unknown as z.infer<typeof apiMachineExtraFieldsSchema>
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
  .merge(apiXlAutomatenDatabaseObjectSchema)

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

export const apiUpdateMachineResponseSchema = apiMachineSchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiUpdateMachineResponseSchema> = undefined as unknown as ApiUpdateMachineResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiUpdateMachineResponse = undefined as unknown as z.infer<typeof apiUpdateMachineResponseSchema>
}

export type ApiGetMachineRequest = void
export type ApiGetMachineResponse = ApiMachine & ApiXlAutomatenDatabaseObject

export const apiGetMachineResponseSchema = apiMachineSchema.merge(apiXlAutomatenDatabaseObjectSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMachineResponseSchema> = undefined as unknown as ApiGetMachineResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMachineResponse = undefined as unknown as z.infer<typeof apiGetMachineResponseSchema>
}

export type ApiDeleteMachineRequest = void
export type ApiDeleteMachineResponse = ApiMachine & ApiXlAutomatenDatabaseObject & ApiMachineTrays

export const apiDeleteMachineResponseSchema = apiMachineSchema
  .merge(apiXlAutomatenDatabaseObjectSchema)
  .merge(apiMachineTraysSchema)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiDeleteMachineResponseSchema> = undefined as unknown as ApiDeleteMachineResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiDeleteMachineResponse = undefined as unknown as z.infer<typeof apiDeleteMachineResponseSchema>
}

export type ApiGetMachinesRequest = void
export type ApiGetMachinesResponse = Array<
  ApiMachine & ApiXlAutomatenDatabaseObject & ApiMachineExtraFields & ApiMachineTrays
>

export const apiGetMachinesResponseSchema = z.array(
  apiMachineSchema
    .merge(apiXlAutomatenDatabaseObjectSchema)
    .merge(apiMachineExtraFieldsSchema)
    .merge(apiMachineTraysSchema)
)

{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const x: z.infer<typeof apiGetMachinesResponseSchema> = undefined as unknown as ApiGetMachinesResponse
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const y: ApiGetMachinesResponse = undefined as unknown as z.infer<typeof apiGetMachinesResponseSchema>
}

export const convertApiMachine = (response: MinimalApiMachineResponse): Machine => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    name: response.name,
    displayName: response.display_name,
    serialNumber: response.serial_number,
    place: response.place,
    testMode: response.test_mode === 1,
    tempStopTemp: response.temp_stop_temp,
    tempStopTime: response.temp_stop_time,
    tempWarningTemp: response.temp_warning_temp,
    tempWarningTime: response.temp_warning_time,
    ...(response.last_connected != null ? { lastConnected: response.last_connected } : {}),
    ...(response.mastermodule_id != null ? { mastermoduleId: response.mastermodule_id } : {}),
    active: response.active === 1,
    lift: response.lift === 1,
    ...(response.lift_max != null ? { liftMax: response.lift_max } : {}),
    ...(response.lift_a != null ? { liftA: response.lift_a } : {}),
    ...(response.lift_b != null ? { liftB: response.lift_b } : {}),
    ...(response.lift_c != null ? { liftC: response.lift_c } : {}),
    ...(response.lift_measurements != null
      ? { liftMeasurements: parseApiMachineLiftMeasurements(response.lift_measurements) }
      : {}),
    liftRoll: response.lift_roll ?? 0,
    ...(response.lift_difference_back_front != null
      ? { liftDifferenceBackFront: response.lift_difference_back_front }
      : {}),
    ...(response.last_filled != null ? { lastFilled: parseApiDate(response.last_filled) } : {}),
    ...(response.push_door != null ? { pushDoor: response.push_door === 1 } : {}),
    ...(response.door != null ? { door: response.door === 1 } : {}),
    ...(response.lift_down != null ? { liftDown: response.lift_down === 1 } : {}),
    ...(response.lift_up != null ? { liftUp: response.lift_up === 1 } : {}),
    ...(response.photocell != null ? { photocell: response.photocell === 1 } : {}),
    ...(response.last_status_update != null ? { lastStatusUpdate: parseApiDate(response.last_status_update) } : {}),
    ...(response.software_version != null ? { softwareVersion: response.software_version } : {}),
    filledItems: response.filled_items ?? 0,
  } satisfies Machine

  return result
}

export const parseApiMachineLiftMeasurements = (response: string): Array<MachineLiftMeasurements> => {
  const parsedString = JSON.parse(response)
  const machineLiftMeasurements = z.array(apiMachineLiftMeasurementsSchema.strict()).parse(parsedString)
  const result = machineLiftMeasurements.map(measurement => ({
    ...measurement,
    mm: parseFloat(measurement.mm),
  }))
  return result
}

export const stringifyApiMachineLiftMeasurements = (response: Array<MachineLiftMeasurements>): string => {
  const stringifiedMeasurements = JSON.stringify(response)
  return stringifiedMeasurements
}

export const convertApiMachineWithTrays = (
  response: ApiMachineTrays & MinimalApiMachineResponse
): Machine & MachineTrays => {
  const machine = convertApiMachine(response)
  const result = {
    ...machine,
    trays: response.trays.map(tray => convertApiTrayWithPositions(tray)),
  }
  return result
}

export const convertApiMachineWithExtraFields = (
  response: ApiMachineExtraFields & ApiMachineTrays & MinimalApiMachineResponse
): Machine & MachineTrays & MachineExtraFields => {
  const machine = convertApiMachineWithTrays(response)
  const result = {
    ...machine,
    trays: response.trays.map(tray => convertApiTrayWithPositions(tray)),
    ...(response.latest_temperature
      ? { latestTemperature: convertApiMachineLatestTemperature(response.latest_temperature) }
      : {}),
    ...(response.coin_changer ? { coinChanger: convertApiMachineCoinChanger(response.coin_changer) } : {}),
  }
  return result
}

export const convertApiMachineLatestTemperature = (response: ApiMachineLatestTemperature): MachineTemperature => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    temperature: response.temperature,
    machineId: response.machine_id,
  } satisfies MachineTemperature

  return result
}

export const convertApiMachineCoinChanger = (response: ApiMachineCoinChanger): MachineCoinChanger => {
  const result = {
    ...convertApiXlAutomatenDatabaseObject(response),
    c5: response.c5,
    c10: response.c10,
    c20: response.c20,
    c50: response.c50,
    c100: response.c100,
    c200: response.c200,
    machineId: response.machine_id,
    cashBox: response.cash_box,
    bills: response.bills,
  } satisfies MachineCoinChanger

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
    ...("liftMeasurements" in request
      ? {
          lift_measurements: request.liftMeasurements
            ? stringifyApiMachineLiftMeasurements(request.liftMeasurements)
            : null,
        }
      : {}),
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
