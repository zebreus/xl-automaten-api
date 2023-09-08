import { email, password } from "./login.js"
import { login } from "../login.js"
import { createVoucher, deleteVoucher } from "../voucher.js"
import { createVoucherTransaction } from "../voucherTransaction.js"

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

const voucherIdsToDeleteAfterwards: Array<number> = []
const getVoucherId = async () => {
  const token = await getToken()
  const voucher = await createVoucher({
    token,
    voucher: {
      initialAmount: 50,
    },
  })
  voucherIdsToDeleteAfterwards.push(voucher.id)
  return voucher.id
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of voucherIdsToDeleteAfterwards) {
    try {
      await deleteVoucher({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
})

test("Create voucherTransaction seems to work", async () => {
  const token = await getToken()
  const voucherId = await getVoucherId()
  const voucher = await createVoucherTransaction({
    voucherId: voucherId,
    voucherTransaction: {
      amount: -20,
      comment: "foo",
    },
    token,
  })

  expect(voucher.initialAmount).toBe(50)
  expect(voucher.usedAmount).toBe(20)
  expect(voucher.transactions.length).toBe(1)
  expect(voucher.transactions.find(t => t.comment === "foo")).toBeDefined()
})

test("Multiple voucher transactions are added up", async () => {
  const token = await getToken()
  const voucherId = await getVoucherId()
  await createVoucherTransaction({
    voucherId: voucherId,
    voucherTransaction: {
      amount: -20,
      comment: "foo",
    },
    token,
  })

  const voucher = await createVoucherTransaction({
    voucherId: voucherId,
    voucherTransaction: {
      amount: -25,
      comment: "bar",
    },
    token,
  })

  expect(voucher.initialAmount).toBe(50)
  expect(voucher.usedAmount).toBe(45)
  expect(voucher.transactions.length).toBe(2)
  expect(voucher.transactions.find(t => t.comment === "foo")).toBeDefined()
  expect(voucher.transactions.find(t => t.comment === "bar")).toBeDefined()
})

test("Voucher transactions work in both directions", async () => {
  const token = await getToken()
  const voucherId = await getVoucherId()
  await createVoucherTransaction({
    voucherId: voucherId,
    voucherTransaction: {
      amount: -20,
      comment: "foo",
    },
    token,
  })

  const voucher = await createVoucherTransaction({
    voucherId: voucherId,
    voucherTransaction: {
      amount: 25,
      comment: "bar",
    },
    token,
  })

  expect(voucher.initialAmount).toBe(50)
  expect(voucher.usedAmount).toBe(-5)
  expect(voucher.transactions.length).toBe(2)
})
