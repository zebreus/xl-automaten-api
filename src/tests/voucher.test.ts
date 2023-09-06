import { Voucher } from "helpers/convertVoucher"
import { login } from "login"
import { email, password } from "tests/login"
import { createVoucher, deleteVoucher, getVoucher, getVouchers, updateVoucher } from "voucher"

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

const vouchersToDeleteAfterwards: Array<number> = []
async function deleteLater(voucher: Promise<Voucher>): Promise<Voucher>
async function deleteLater(voucher: number): Promise<void>
async function deleteLater(voucher: Promise<Voucher> | number): Promise<Voucher | void> {
  const id = typeof voucher === "object" ? (await voucher).id : voucher
  vouchersToDeleteAfterwards.push(id)
  return typeof voucher === "object" ? voucher : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of vouchersToDeleteAfterwards) {
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

test("Create voucher seems to work", async () => {
  const token = await getToken()
  const voucher = await deleteLater(
    createVoucher({
      voucher: {
        initialAmount: 20.56,
      },
      token,
    })
  )

  await expect(voucher.initialAmount).toBe(20.56)
})

test("Create voucher with a comment seems to work", async () => {
  const token = await getToken()
  const voucherWithComment = await deleteLater(
    createVoucher({
      voucher: {
        initialAmount: 10,
        comment: "creating a voucher with a comment works",
      },
      token,
    })
  )

  await expect(voucherWithComment.comment).toBe("creating a voucher with a comment works")
})

test("Get voucher seems to work", async () => {
  const token = await getToken()

  const createdVoucher = await deleteLater(
    createVoucher({
      voucher: {
        initialAmount: 78,
      },
      token,
    })
  )

  const voucher = await getVoucher({
    id: createdVoucher.id,
    token,
  })

  await expect(voucher.initialAmount).toBe(78)
})

test("Get voucher throws sane error for nonexisting voucher", async () => {
  const token = await getToken()

  const voucher = getVoucher({
    id: 9219329,
    token,
  })

  await expect(voucher).rejects.toThrow("Entry for CashVoucher not found")
})

test("Deleting a voucher seems to work", async () => {
  const token = await getToken()

  const createdVoucher = await deleteLater(
    createVoucher({
      voucher: {
        initialAmount: 78,
      },
      token,
    })
  )

  await deleteVoucher({
    id: createdVoucher.id,
    token,
  })

  // Verify that the voucher is really deleted
  await expect(
    getVoucher({
      id: createdVoucher.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting voucher throws sane error", async () => {
  const token = await getToken()

  const voucher = deleteVoucher({
    id: 9219329,
    token,
  })

  await expect(voucher).rejects.toThrow("Entry for CashVoucher not found")
})

test("Update voucher throws sane error for nonexisting voucher", async () => {
  const token = await getToken()

  const voucher = updateVoucher({
    id: 9219329,
    voucher: {},
    token,
  })

  await expect(voucher).rejects.toThrow("Entry for CashVoucher not found")
})

test("Update voucher seems to work", async () => {
  const token = await getToken()

  const createdVoucher = await deleteLater(
    createVoucher({
      voucher: {
        initialAmount: 78,
        comment: "foo",
      },
      token,
    })
  )

  expect(createdVoucher.comment).toBe("foo")

  const updatedVoucher = await updateVoucher({
    id: createdVoucher.id,
    voucher: {
      comment: "bar",
    },
    token,
  })

  expect(updatedVoucher.comment).toBe("bar")

  const gotVoucher = await getVoucher({
    id: createdVoucher.id,
    token,
  })
  expect(gotVoucher.comment).toBe("bar")
})

test("List vouchers seems to work", async () => {
  const token = await getToken()

  const voucherA = await deleteLater(
    createVoucher({
      voucher: {
        initialAmount: 45,
      },
      token,
    })
  )

  const voucherB = await deleteLater(
    createVoucher({
      voucher: {
        initialAmount: 99,
      },
      token,
    })
  )

  const vouchers = await getVouchers({ token })

  expect(vouchers.length).toBeGreaterThanOrEqual(2)
  expect(vouchers.find(p => p.id === voucherA.id && p.initialAmount === voucherA.initialAmount)).toBeDefined()
  expect(vouchers.find(p => p.id === voucherB.id && p.initialAmount === voucherB.initialAmount)).toBeDefined()
})

test("List vouchers does not crash", async () => {
  const token = await getToken()

  const vouchers = await getVouchers({ token })

  expect(vouchers.length).toBeGreaterThanOrEqual(0)
})
