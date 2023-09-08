import { email, password } from "./login.js"
import { Tray } from "../helpers/convertTray.js"
import { login } from "../login.js"
import { createMachine, deleteMachine } from "../machine.js"
import { createTray, deleteTray, getTray, getTrays, updateTray } from "../tray.js"

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

const machineIdsToDeleteAfterwards: Array<number> = []

const getMachineId = async () => {
  if (machineIdsToDeleteAfterwards[0]) {
    return machineIdsToDeleteAfterwards[0]
  }
  const token = await getToken()
  const machine = await createMachine({
    token,
    machine: {
      name: "Test Machine 3",
      displayName: "Machine on your right",
      serialNumber: generateSerialNumber(),
      place: "Musterstadt City",
      testMode: false,
      tempStopTime: 45,
      tempStopTemp: 8,
      tempWarningTemp: 12,
      tempWarningTime: 30,
    },
  })
  machineIdsToDeleteAfterwards.push(machine.id)
  return machine.id
}
function assertSlot(slot: number): asserts slot is 1 | 2 {
  if (slot > 18) {
    throw new Error("No more slots available in the test machine")
  }
  if (slot < 1) {
    throw new Error("Invalid slot")
  }
}

let nextSlot = 1
const getNextSlot = async () => {
  const slot = nextSlot
  nextSlot = nextSlot + 1
  assertSlot(slot)
  return slot
}

const traysToDeleteAfterwards: Array<number> = []
async function deleteLater(tray: Promise<Tray>): Promise<Tray>
async function deleteLater(tray: number): Promise<void>
async function deleteLater(tray: Promise<Tray> | number): Promise<Tray | void> {
  const id = typeof tray === "object" ? (await tray).id : tray
  traysToDeleteAfterwards.push(id)
  return typeof tray === "object" ? tray : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of traysToDeleteAfterwards) {
    try {
      await deleteTray({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
  for (const id of machineIdsToDeleteAfterwards) {
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

test("Create tray seems to work", async () => {
  const token = await getToken()
  const machineId = await getMachineId()
  const slot = await getNextSlot()
  const result = await deleteLater(
    createTray({
      tray: {
        machineId,
        slot,
        mountingPosition: 50,
        type: 1,
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating two trays in the same slot on the same machine fails", async () => {
  const token = await getToken()
  const machineId = await getMachineId()
  const slot = await getNextSlot()

  await deleteLater(
    createTray({
      tray: {
        machineId,
        slot,
        mountingPosition: 50,
        type: 1,
      },
      token,
    })
  )

  await expect(
    deleteLater(
      createTray({
        tray: {
          machineId,
          slot,
          mountingPosition: 50,
          type: 1,
        },
        token,
      })
    )
  ).rejects.toThrow()
})

test("Get tray seems to work", async () => {
  const token = await getToken()
  const machineId = await getMachineId()
  const slot = await getNextSlot()

  const createdTray = await deleteLater(
    createTray({
      tray: {
        machineId,
        slot,
        mountingPosition: 55,
        type: 1,
      },
      token,
    })
  )

  const tray = await getTray({
    id: createdTray.id,
    token,
  })

  await expect(tray.mountingPosition).toBe(55)
})

test("Get tray throws sane error for nonexisting tray", async () => {
  const token = await getToken()

  const tray = getTray({
    id: 9219329,
    token,
  })

  await expect(tray).rejects.toThrow("Entry for Tray not found")
})

test("Deleting a tray seems to work", async () => {
  const token = await getToken()
  const machineId = await getMachineId()
  const slot = await getNextSlot()

  const createdTray = await deleteLater(
    createTray({
      tray: {
        machineId,
        slot,
        mountingPosition: 50,
        type: 1,
      },
      token,
    })
  )

  await deleteTray({
    id: createdTray.id,
    token,
  })

  // Verify that the tray is really deleted
  await expect(
    getTray({
      id: createdTray.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting tray throws sane error", async () => {
  const token = await getToken()

  const tray = deleteTray({
    id: 9219329,
    token,
  })

  await expect(tray).rejects.toThrow("Entry for Tray not found")
})

test("Update tray throws sane error for nonexisting tray", async () => {
  const token = await getToken()

  const tray = updateTray({
    id: 9219329,
    tray: {},
    token,
  })

  await expect(tray).rejects.toThrow("Entry for Tray not found")
})

test("Update tray seems to work", async () => {
  const token = await getToken()
  const machineId = await getMachineId()
  const slot = await getNextSlot()

  const createdTray = await deleteLater(
    createTray({
      tray: {
        machineId,
        slot,
        mountingPosition: 72,
        type: 1,
      },
      token,
    })
  )

  expect(createdTray.mountingPosition).toBe(72)

  const updatedTray = await updateTray({
    id: createdTray.id,
    tray: {
      mountingPosition: 5,
    },
    token,
  })

  expect(updatedTray.mountingPosition).toBe(5)

  const gotTray = await getTray({
    id: createdTray.id,
    token,
  })

  expect(gotTray.mountingPosition).toBe(5)
})

test("List trays seems to work", async () => {
  const token = await getToken()
  const machineId = await getMachineId()
  const slotA = await getNextSlot()
  const slotB = await getNextSlot()

  const trayA = await deleteLater(
    createTray({
      tray: {
        machineId,
        slot: slotA,
        mountingPosition: 72,
        type: 1,
      },
      token,
    })
  )

  const trayB = await deleteLater(
    createTray({
      tray: {
        machineId,
        slot: slotB,
        mountingPosition: 72,
        type: 1,
      },
      token,
    })
  )

  const trays = await getTrays({ token })

  expect(trays.length).toBeGreaterThanOrEqual(2)
  expect(trays.find(p => p.machineId === trayA.machineId && p.slot === trayA.slot)).toBeDefined()
  expect(trays.find(p => p.machineId === trayB.machineId && p.slot === trayB.slot)).toBeDefined()
})

test("List trays does not crash", async () => {
  const token = await getToken()

  const trays = await getTrays({ token })

  expect(trays.length).toBeGreaterThanOrEqual(0)
})
