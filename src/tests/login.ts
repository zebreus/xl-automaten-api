export const email = ""
export const password = ""
export const mastermoduleId = 0

if (!email || !password || !mastermoduleId) {
  throw new Error("You need to add your email and password to src/tests/login.ts to run the tests.")
}
