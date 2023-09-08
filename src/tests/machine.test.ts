import { email, password } from "./login.js"
import { Machine } from "../helpers/convertMachine.js"
import { login } from "../login.js"
import { createMachine, deleteMachine, getMachine, getMachines, updateMachine } from "../machine.js"

let token = ""

const getToken = async () => {
  if (token) {
    return token
  }
  const result = await login({
    email,
    password,
  })
  token = result.token
  return result.token
}

const generateSerialNumber = () => {
  const id = Math.floor(Math.random() * 899999 + 100000)
  return "" + id
}

const machinesToDeleteAfterwards: Array<number> = []
async function deleteLater(machine: Promise<Machine>): Promise<Machine>
async function deleteLater(machine: number): Promise<void>
async function deleteLater(machine: Promise<Machine> | number): Promise<Machine | void> {
  const id = typeof machine === "object" ? (await machine).id : machine
  machinesToDeleteAfterwards.push(id)
  return typeof machine === "object" ? machine : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of machinesToDeleteAfterwards) {
    try {
      await deleteMachine({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
})

test("Create machine seems to work", async () => {
  const token = await getToken()
  const result = await deleteLater(
    createMachine({
      machine: {
        name: "Test Machine 3",
        displayName: "Machine on your right",
        serialNumber: generateSerialNumber(),
        place: "Musterstadt City",
        testMode: true,
        tempStopTemp: 8,
        tempStopTime: 45,
        tempWarningTemp: 12,
        tempWarningTime: 30,
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating two machines with the same name works", async () => {
  const token = await getToken()

  await deleteLater(
    createMachine({
      machine: {
        name: "Test Machine 3",
        displayName: "Machine on your right",
        serialNumber: generateSerialNumber(),
        place: "Musterstadt City",
        testMode: true,
        tempStopTemp: 8,
        tempStopTime: 45,
        tempWarningTemp: 12,
        tempWarningTime: 30,
      },
      token,
    })
  )

  await expect(
    deleteLater(
      createMachine({
        machine: {
          name: "Test Machine 3",
          displayName: "Machine on your right",
          serialNumber: generateSerialNumber(),
          place: "Musterstadt City",
          testMode: true,
          tempStopTemp: 8,
          tempStopTime: 45,
          tempWarningTemp: 12,
          tempWarningTime: 30,
        },
        token,
      })
    )
  ).resolves.toBeDefined()
})

test("Get machine seems to work", async () => {
  const token = await getToken()
  const createdMachine = await deleteLater(
    createMachine({
      machine: {
        name: "Test Machine 3",
        displayName: "Created for getMachine test",
        serialNumber: generateSerialNumber(),
        place: "Musterstadt City",
        testMode: true,
        tempStopTemp: 8,
        tempStopTime: 45,
        tempWarningTemp: 12,
        tempWarningTime: 30,
      },
      token,
    })
  )

  const machine = await getMachine({
    id: createdMachine.id,
    token,
  })

  await expect(machine.displayName).toBe("Created for getMachine test")
})

test("Get machine throws sane error for nonexisting machine", async () => {
  const token = await getToken()

  const machine = getMachine({
    id: 9219329,
    token,
  })

  await expect(machine).rejects.toThrow("Entry for Machine not found")
})

test("Archiving an machine seems to work", async () => {
  const token = await getToken()
  const createdMachine = await deleteLater(
    createMachine({
      machine: {
        name: "Test Machine 3",
        displayName: "Machine on your right",
        serialNumber: generateSerialNumber(),
        place: "Musterstadt City",
        testMode: true,
        tempStopTemp: 8,
        tempStopTime: 45,
        tempWarningTemp: 12,
        tempWarningTime: 30,
      },
      token,
    })
  )

  await deleteMachine({
    id: createdMachine.id,
    token,
  })

  // Verify that the machine is really archived
  await expect(
    getMachine({
      id: createdMachine.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting machine throws sane error", async () => {
  const token = await getToken()

  const machine = deleteMachine({
    id: 9219329,
    token,
  })

  await expect(machine).rejects.toThrow("Entry for Machine not found")
})

test("Update machine throws sane error for nonexisting machine", async () => {
  const token = await getToken()

  const machine = updateMachine({
    id: 9219329,
    machine: {},
    token,
  })

  await expect(machine).rejects.toThrow("Entry for Machine not found")
})

test("Update machine seems to work", async () => {
  const token = await getToken()
  const createdMachine = await deleteLater(
    createMachine({
      machine: {
        name: "Test Machine 3",
        displayName: "old displayname",
        serialNumber: generateSerialNumber(),
        place: "Musterstadt City",
        testMode: true,
        tempStopTemp: 8,
        tempStopTime: 45,
        tempWarningTemp: 12,
        tempWarningTime: 30,
      },
      token,
    })
  )

  expect(createdMachine.displayName).toBe("old displayname")

  const updatedMachine = await updateMachine({
    id: createdMachine.id,
    machine: {
      displayName: "new displayname",
    },
    token,
  })

  expect(updatedMachine.displayName).toBe("new displayname")

  const gotMachine = await getMachine({
    id: createdMachine.id,
    token,
  })

  expect(gotMachine.displayName).toBe("new displayname")
})

test("List machines seems to work", async () => {
  const token = await getToken()

  const machineA = await deleteLater(
    createMachine({
      machine: {
        name: "Test Machine alpha",
        displayName: "Machine on your right",
        serialNumber: generateSerialNumber(),
        place: "Musterstadt City",
        testMode: true,
        tempStopTemp: 8,
        tempStopTime: 45,
        tempWarningTemp: 12,
        tempWarningTime: 30,
      },
      token,
    })
  )

  const machineB = await deleteLater(
    createMachine({
      machine: {
        name: "Test Machine beta",
        displayName: "Machine on your right",
        serialNumber: generateSerialNumber(),
        place: "Musterstadt City",
        testMode: true,
        tempStopTemp: 8,
        tempStopTime: 45,
        tempWarningTemp: 12,
        tempWarningTime: 30,
      },
      token,
    })
  )

  const machines = await getMachines({ token })

  expect(machines.length).toBeGreaterThanOrEqual(2)
  expect(machines.find(p => p.serialNumber === machineA.serialNumber)).toBeDefined()
  expect(machines.find(p => p.serialNumber === machineB.serialNumber)).toBeDefined()
})

test("List machines does not crash", async () => {
  const token = await getToken()

  const machines = await getMachines({ token })

  expect(machines.length).toBeGreaterThanOrEqual(0)
})
