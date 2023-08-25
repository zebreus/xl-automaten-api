import { login } from "login"
import { getMastermodules } from "mastermodule"
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

test("Get mastermodules seems to work", async () => {
  const token = await getToken()
  const mastermodules = await getMastermodules({
    token,
  })

  expect(mastermodules.length).toBeGreaterThanOrEqual(1)
  expect(mastermodules.find(mastermodule => mastermodule.id === mastermoduleId)).toBeDefined()
})
