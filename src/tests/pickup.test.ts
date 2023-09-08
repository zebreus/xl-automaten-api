import { email, mastermoduleId, password } from "./login.js"
import { login } from "../login.js"
import { createPickup, deletePickup, getPickup, getPickups, updatePickup } from "../pickup.js"

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

const pickupsToDeleteAfterwards: Array<string> = []
const generateTestPickupId = () => {
  const id = Math.random().toString(36).substring(7)
  pickupsToDeleteAfterwards.push(id)
  return id
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const code of pickupsToDeleteAfterwards) {
    try {
      await deletePickup({
        code,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
})

test("Create pickup seems to work", async () => {
  const token = await getToken()
  const code = generateTestPickupId()
  const result = await createPickup({
    pickup: {
      code,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
    },
    token,
  })

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating pickup twice with same code fails", async () => {
  const token = await getToken()
  const code = generateTestPickupId()
  const firstAttempt = createPickup({
    pickup: {
      code,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
    },
    token,
  })

  await expect(firstAttempt).resolves.toBeDefined()

  const secondAttempt = createPickup({
    pickup: {
      code,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
    },
    token,
  })

  await expect(secondAttempt).rejects.toThrow("Duplicate entry")
})

test("Get pickup seems to work", async () => {
  const token = await getToken()
  const code = generateTestPickupId()
  const now = new Date()
  await createPickup({
    pickup: {
      code,
      validFrom: now,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
    },
    token,
  })

  const pickup = await getPickup({
    code,
    token,
  })

  await expect(Math.floor(pickup.validFrom.getTime() / 1000)).toBe(Math.floor(now.getTime() / 1000))
})

test("Get pickup throws sane error for nonexisting pickup", async () => {
  const token = await getToken()
  const code = generateTestPickupId()

  const pickup = getPickup({
    code,
    token,
  })

  await expect(pickup).rejects.toThrow("Entry for PickupCode not found")
})

test("Delete pickup seems to work", async () => {
  const token = await getToken()
  const code = generateTestPickupId()
  const now = new Date()
  await createPickup({
    pickup: {
      code,
      validFrom: now,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
    },
    token,
  })

  await deletePickup({
    code,
    token,
  })

  // Verify that the pickup is deleted
  await expect(
    getPickup({
      code,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting pickup throws sane error", async () => {
  const token = await getToken()
  const code = generateTestPickupId()

  const pickup = deletePickup({
    code,
    token,
  })

  await expect(pickup).rejects.toThrow("Entry for PickupCode not found")
})

test("Update pickup throws sane error for nonexisting pickup", async () => {
  const token = await getToken()
  const code = generateTestPickupId()

  const pickup = updatePickup({
    code,
    pickup: {},
    token,
  })

  await expect(pickup).rejects.toThrow("Entry for PickupCode not found")
})

test("Update pickup seems to work", async () => {
  const token = await getToken()
  const code = generateTestPickupId()
  const now = new Date()
  const createdPickup = await createPickup({
    pickup: {
      code,
      validFrom: now,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
      externalId: "old_id",
    },
    token,
  })

  expect(createdPickup.externalId).toBe("old_id")

  const updatedPickup = await updatePickup({
    code,
    pickup: {
      externalId: "new_id",
    },
    token,
  })

  expect(updatedPickup.externalId).toBe("new_id")

  // Verify that the pickup is deleted

  const gotPickup = await getPickup({
    code,
    token,
  })

  expect(gotPickup.externalId).toBe("new_id")
})

test("List pickups seems to work", async () => {
  const token = await getToken()
  const now = new Date()
  const codeA = generateTestPickupId()
  const codeB = generateTestPickupId()
  await createPickup({
    pickup: {
      code: codeA,
      validFrom: now,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
    },
    token,
  })

  await createPickup({
    pickup: {
      code: codeB,
      validFrom: now,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      mastermoduleId,
    },
    token,
  })

  const pickups = await getPickups({ token })

  expect(pickups.length).toBeGreaterThanOrEqual(2)
  expect(pickups.find(p => p.code === codeA)).toBeDefined()
  expect(pickups.find(p => p.code === codeB)).toBeDefined()
})

test("List pickups does not crash", async () => {
  const token = await getToken()

  const pickups = await getPickups({ token })

  expect(pickups.length).toBeGreaterThanOrEqual(0)
})
