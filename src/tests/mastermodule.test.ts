import { email, mastermoduleId, password } from "./login.js"
import { login } from "../login.js"
import { getMastermodules } from "../mastermodule.js"
import { getMastermoduleStock } from "../mastermoduleStock.js"

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

test("Get mastermodules seems to work", async () => {
  const token = await getToken()
  const mastermodules = await getMastermodules({
    token,
  })

  expect(mastermodules.length).toBeGreaterThanOrEqual(1)
  expect(mastermodules.find(mastermodule => mastermodule.id === mastermoduleId)).toBeDefined()
})

test("List mastermodules does not crash", async () => {
  const token = await getToken()

  const mastermodules = await getMastermodules({ token })

  expect(mastermodules.length).toBeGreaterThanOrEqual(0)
})

test("List mastermodule stock does not crash", async () => {
  const token = await getToken()

  const mastermodules = await getMastermodules({ token })

  const mastermoduleId = mastermodules?.[0]?.id

  expect(mastermoduleId).toBeDefined()

  const mastermoduleStock = await getMastermoduleStock({ id: mastermoduleId ?? 0, token })

  expect(mastermoduleStock.length).toBeGreaterThanOrEqual(0)
})
