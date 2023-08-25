import { login } from "login"
import { createPickup, deletePickup, getPickup } from "pickup"
import { email, mastermoduleId, password } from "tests/login"

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

const randomString = () => Math.random().toString(36).substring(7)

beforeAll(async () => {
  getToken()
})

test("Create pickup seems to work", async () => {
  const token = await getToken()
  const code = randomString()
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
  const code = randomString()
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
  const code = randomString()
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
  const code = randomString()

  const pickup = getPickup({
    code,
    token,
  })

  await expect(pickup).rejects.toThrow("Entry for PickupCode not found")
})

test("Delete pickup seems to work", async () => {
  const token = await getToken()
  const code = randomString()
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
  const code = randomString()

  const pickup = deletePickup({
    code,
    token,
  })

  await expect(pickup).rejects.toThrow("Entry for PickupCode not found")
})
