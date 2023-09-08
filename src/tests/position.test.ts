import { email, password } from "./login.js"
import { Position } from "../helpers/convertPosition.js"
import { login } from "../login.js"
import { createMachine, deleteMachine } from "../machine.js"
import { createPosition, deletePosition, getPosition, getPositions, updatePosition } from "../position.js"
import { createTray, deleteTray } from "../tray.js"

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
const trayIdsToDeleteAfterwards: Array<number> = []
const getTrayId = async () => {
  const machineId = await getMachineId()
  const slot = nextSlot
  nextSlot = nextSlot + 1
  assertSlot(slot)
  const token = await getToken()
  const tray = await createTray({
    token,
    tray: {
      machineId,
      slot,
      mountingPosition: 10,
      type: 1,
    },
  })

  trayIdsToDeleteAfterwards.push(tray.id)
  return tray.id
}

const positionsToDeleteAfterwards: Array<number> = []
async function deleteLater(position: Promise<Position>): Promise<Position>
async function deleteLater(position: number): Promise<void>
async function deleteLater(position: Promise<Position> | number): Promise<Position | void> {
  const id = typeof position === "object" ? (await position).id : position
  positionsToDeleteAfterwards.push(id)
  return typeof position === "object" ? position : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of positionsToDeleteAfterwards) {
    try {
      await deletePosition({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
  for (const id of trayIdsToDeleteAfterwards) {
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

test("Create position seems to work", async () => {
  const token = await getToken()
  const trayId = await getTrayId()
  const result = await deleteLater(
    createPosition({
      position: {
        trayId,
        number: 2,
        width: 2,
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating two positions with the same number on the same tray fails", async () => {
  const token = await getToken()
  const trayId = await getTrayId()

  await deleteLater(
    createPosition({
      position: {
        trayId,
        number: 2,
        width: 2,
      },
      token,
    })
  )

  await expect(
    deleteLater(
      createPosition({
        position: {
          trayId,
          number: 2,
          width: 2,
        },
        token,
      })
    )
  ).rejects.toThrow()
})

test("Get position seems to work", async () => {
  const token = await getToken()
  const trayId = await getTrayId()

  const createdPosition = await deleteLater(
    createPosition({
      position: {
        trayId,
        number: 2,
        width: 78,
      },
      token,
    })
  )

  const position = await getPosition({
    id: createdPosition.id,
    token,
  })

  await expect(position.width).toBe(78)
})

test("Get position throws sane error for nonexisting position", async () => {
  const token = await getToken()

  const position = getPosition({
    id: 9219329,
    token,
  })

  await expect(position).rejects.toThrow("Entry for Position not found")
})

test("Deleting a position seems to work", async () => {
  const token = await getToken()
  const trayId = await getTrayId()

  const createdPosition = await deleteLater(
    createPosition({
      position: {
        trayId,
        number: 2,
        width: 1,
      },
      token,
    })
  )

  await deletePosition({
    id: createdPosition.id,
    token,
  })

  // Verify that the position is really deleted
  await expect(
    getPosition({
      id: createdPosition.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting position throws sane error", async () => {
  const token = await getToken()

  const position = deletePosition({
    id: 9219329,
    token,
  })

  await expect(position).rejects.toThrow("Entry for Position not found")
})

test("Update position throws sane error for nonexisting position", async () => {
  const token = await getToken()

  const position = updatePosition({
    id: 9219329,
    position: {},
    token,
  })

  await expect(position).rejects.toThrow("Entry for Position not found")
})

test("Update position seems to work", async () => {
  const token = await getToken()
  const trayId = await getTrayId()

  const createdPosition = await deleteLater(
    createPosition({
      position: {
        trayId,
        number: 2,
        width: 1,
      },
      token,
    })
  )

  expect(createdPosition.width).toBe(1)

  const updatedPosition = await updatePosition({
    id: createdPosition.id,
    position: {
      width: 5,
    },
    token,
  })

  expect(updatedPosition.width).toBe(5)

  const gotPosition = await getPosition({
    id: createdPosition.id,
    token,
  })

  expect(gotPosition.width).toBe(5)
})

test("List positions seems to work", async () => {
  const token = await getToken()
  const trayId = await getTrayId()

  const positionA = await deleteLater(
    createPosition({
      position: {
        trayId,
        number: 2,
        width: 1,
      },
      token,
    })
  )

  const positionB = await deleteLater(
    createPosition({
      position: {
        trayId,
        number: 4,
        width: 1,
      },
      token,
    })
  )

  const positions = await getPositions({ token })

  expect(positions.length).toBeGreaterThanOrEqual(2)
  expect(positions.find(p => p.trayId === positionA.trayId && p.number === positionA.number)).toBeDefined()
  expect(positions.find(p => p.trayId === positionB.trayId && p.number === positionB.number)).toBeDefined()
})

test("List positions does not crash", async () => {
  const token = await getToken()

  const positions = await getPositions({ token })

  expect(positions.length).toBeGreaterThanOrEqual(0)
})
