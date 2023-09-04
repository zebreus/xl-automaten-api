import { Supplier } from "helpers/convertSupplier"
import { login } from "login"
import { createSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from "supplier"
import { email, password } from "tests/login"

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

const suppliersToDeleteAfterwards: Array<number> = []
async function deleteLater(supplier: Promise<Supplier>): Promise<Supplier>
async function deleteLater(supplier: number): Promise<void>
async function deleteLater(supplier: Promise<Supplier> | number): Promise<Supplier | void> {
  const id = typeof supplier === "object" ? (await supplier).id : supplier
  suppliersToDeleteAfterwards.push(id)
  return typeof supplier === "object" ? supplier : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of suppliersToDeleteAfterwards) {
    try {
      await deleteSupplier({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
})

test("Create supplier seems to work", async () => {
  const token = await getToken()

  const result = await deleteLater(
    createSupplier({
      supplier: {
        name: "Test supplier",
        email: "test@example.com",
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating two suppliers with the same name and email is possible", async () => {
  const token = await getToken()

  await deleteLater(
    createSupplier({
      supplier: {
        name: "Test supplier",
        email: "test@example.com",
      },
      token,
    })
  )

  await expect(
    deleteLater(
      createSupplier({
        supplier: {
          name: "Test supplier",
          email: "test@example.com",
        },
        token,
      })
    )
  ).resolves.toBeDefined()
})

test("Get supplier seems to work", async () => {
  const token = await getToken()

  const createdSupplier = await deleteLater(
    createSupplier({
      supplier: {
        name: "Test get supplier",
        email: "test@example.com",
      },
      token,
    })
  )

  const supplier = await getSupplier({
    id: createdSupplier.id,
    token,
  })

  await expect(supplier.name).toBe("Test get supplier")
})

test("Get supplier throws sane error for nonexisting supplier", async () => {
  const token = await getToken()

  const supplier = getSupplier({
    id: 9219329,
    token,
  })

  await expect(supplier).rejects.toThrow("Entry for Supplier not found")
})

test("Deleting a supplier seems to work", async () => {
  const token = await getToken()

  const createdSupplier = await deleteLater(
    createSupplier({
      supplier: {
        name: "Test get supplier",
        email: "test@example.com",
      },
      token,
    })
  )

  await deleteSupplier({
    id: createdSupplier.id,
    token,
  })

  // Verify that the supplier is really deleted
  await expect(
    getSupplier({
      id: createdSupplier.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting supplier throws sane error", async () => {
  const token = await getToken()

  const supplier = deleteSupplier({
    id: 9219329,
    token,
  })

  await expect(supplier).rejects.toThrow("Entry for Supplier not found")
})

test("Update supplier throws sane error for nonexisting supplier", async () => {
  const token = await getToken()

  const supplier = updateSupplier({
    id: 9219329,
    supplier: {},
    token,
  })

  await expect(supplier).rejects.toThrow("Entry for Supplier not found")
})

test("Update supplier seems to work", async () => {
  const token = await getToken()

  const createdSupplier = await deleteLater(
    createSupplier({
      supplier: {
        name: "Supplier alpha",
        email: "test@example.com",
      },
      token,
    })
  )

  expect(createdSupplier.name).toBe("Supplier alpha")

  const updatedSupplier = await updateSupplier({
    id: createdSupplier.id,
    supplier: {
      name: "Supplier beta",
    },
    token,
  })

  expect(updatedSupplier.name).toBe("Supplier beta")

  const gotSupplier = await getSupplier({
    id: createdSupplier.id,
    token,
  })

  expect(gotSupplier.name).toBe("Supplier beta")
})

test("List suppliers seems to work", async () => {
  const token = await getToken()

  const supplierA = await deleteLater(
    createSupplier({
      supplier: {
        name: "Supplier list alpha",
        email: "test@example.com",
      },
      token,
    })
  )

  const supplierB = await deleteLater(
    createSupplier({
      supplier: {
        name: "Supplier list beta",
        email: "test@example.com",
      },
      token,
    })
  )

  const suppliers = await getSuppliers({ token })

  expect(suppliers.length).toBeGreaterThanOrEqual(2)
  expect(suppliers.find(p => p.name === supplierA.name)).toBeDefined()
  expect(suppliers.find(p => p.name === supplierB.name)).toBeDefined()
})

test("List suppliers does not crash", async () => {
  const token = await getToken()

  const suppliers = await getSuppliers({ token })

  expect(suppliers.length).toBeGreaterThanOrEqual(0)
})
