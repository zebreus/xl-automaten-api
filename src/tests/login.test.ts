import { email, password } from "./login.js"
import { login } from "../login.js"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getToken = async () => {
  const result = await login({
    email,
    password,
  })
  return result.token
}

test("Login obtains a token", async () => {
  const result = await login({
    email,
    password,
  })
  await expect(result.token.length).toBeGreaterThan(10)
})

test("Login obtains a token that expires in 1 hout", async () => {
  const result = await login({
    email,
    password,
  })
  await expect(result.expires_in).toBe(3600)
})
