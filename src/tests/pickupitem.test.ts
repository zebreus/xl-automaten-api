import { createArticle, getArticles } from "article"
import { PickupItem } from "helpers/convertPickupItem"
import { login } from "login"
import { createPickup, deletePickup } from "pickup"
import { createPickupItem, deletePickupItem, updatePickupItem } from "pickupItem"
import { createSupplier, deleteSupplier } from "supplier"
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

const generatePickupCode = () => {
  const id = Math.random().toString(36).substring(7)
  return id
}

const supplierIdsToDeleteAfterwards: Array<number> = []

const getSupplierId = async () => {
  if (supplierIdsToDeleteAfterwards[0]) {
    return supplierIdsToDeleteAfterwards[0]
  }
  const token = await getToken()
  const supplier = await createSupplier({
    token,
    supplier: {
      name: "Test Supplier",
      email: "test@example.com",
    },
  })

  supplierIdsToDeleteAfterwards.push(supplier.id)
  return supplier.id
}

const pickupCodesToDeleteAfterwards: Array<[string, number]> = []

const getPickupId = async () => {
  if (pickupCodesToDeleteAfterwards[0]) {
    return pickupCodesToDeleteAfterwards[0][1]
  }
  const token = await getToken()
  const pickupCode = generatePickupCode()
  const pickup = await createPickup({
    token,
    pickup: {
      code: pickupCode,
      mastermoduleId: mastermoduleId,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  })

  pickupCodesToDeleteAfterwards.push([pickup.code, pickup.internalId])
  return pickup.internalId
}

let testArticle: number
const getArticleId = async () => {
  if (testArticle) {
    return testArticle
  }
  const token = await getToken()
  const articles = await getArticles({ token })
  const supplierId = await getSupplierId()
  const firstArticle = articles[0]
  if (firstArticle) {
    testArticle = firstArticle.id
    return firstArticle.id
  }

  const article = await createArticle({
    token,
    article: {
      description: "Created for getArticle test",
      name: "test-article",
      number: "123456",
      price: 4,
      supplierId: supplierId,
    },
  })

  return article.id
}

const pickupItemsToDeleteAfterwards: Array<number> = []
async function deleteLater(pickupItem: Promise<PickupItem>): Promise<PickupItem>
async function deleteLater(pickupItem: number): Promise<void>
async function deleteLater(pickupItem: Promise<PickupItem> | number): Promise<PickupItem | void> {
  const id = typeof pickupItem === "object" ? (await pickupItem).id : pickupItem
  pickupItemsToDeleteAfterwards.push(id)
  return typeof pickupItem === "object" ? pickupItem : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of pickupItemsToDeleteAfterwards) {
    try {
      await deletePickupItem({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
  for (const code of pickupCodesToDeleteAfterwards) {
    try {
      await deletePickup({
        code: code[0],
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
  for (const id of supplierIdsToDeleteAfterwards) {
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

test("Create pickupItem seems to work", async () => {
  const token = await getToken()
  const pickupId = await getPickupId()
  const articleId = await getArticleId()
  const result = await deleteLater(
    createPickupItem({
      pickupItem: {
        pickupId,
        articleId,
        overrideArticlePrice: 3,
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating two pickupItems with the same article works", async () => {
  const token = await getToken()
  const pickupId = await getPickupId()
  const articleId = await getArticleId()

  await deleteLater(
    createPickupItem({
      pickupItem: {
        pickupId,
        articleId,
        overrideArticlePrice: 3,
      },
      token,
    })
  )

  await expect(
    deleteLater(
      createPickupItem({
        pickupItem: {
          pickupId,
          articleId,
          overrideArticlePrice: 3,
        },
        token,
      })
    )
  ).resolves.toBeDefined()
})

test("Deleting a pickupItem seems to work", async () => {
  const token = await getToken()
  const pickupId = await getPickupId()
  const articleId = await getArticleId()

  const createdPickupItem = await deleteLater(
    createPickupItem({
      pickupItem: {
        pickupId,
        articleId,
        overrideArticlePrice: 3,
      },
      token,
    })
  )

  await deletePickupItem({
    id: createdPickupItem.id,
    token,
  })

  // Verify that the pickupItem is really deleted
  await expect(
    deletePickupItem({
      id: createdPickupItem.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting pickupItem throws sane error", async () => {
  const token = await getToken()

  const pickupItem = deletePickupItem({
    id: 9219329,
    token,
  })

  await expect(pickupItem).rejects.toThrow("Entry for PickupCodeArticle not found")
})

test("Update pickupItem throws sane error for nonexisting pickupItem", async () => {
  const token = await getToken()
  const articleId = await getArticleId()

  const pickupItem = updatePickupItem({
    id: 9219329,
    pickupItem: {
      articleId,
      overrideArticlePrice: 3,
    },
    token,
  })

  await expect(pickupItem).rejects.toThrow("Entry for PickupCodeArticle not found")
})

test("Update pickupItem seems to work", async () => {
  const token = await getToken()
  const pickupId = await getPickupId()
  const articleId = await getArticleId()

  const createdPickupItem = await deleteLater(
    createPickupItem({
      pickupItem: {
        pickupId,
        articleId,
        overrideArticlePrice: 1,
      },
      token,
    })
  )

  expect(createdPickupItem.overrideArticlePrice).toBe(1)

  const updatedPickupItem = await updatePickupItem({
    id: createdPickupItem.id,
    pickupItem: {
      articleId,
      overrideArticlePrice: 5,
    },
    token,
  })

  expect(updatedPickupItem.overrideArticlePrice).toBe(5)
})

test("Update overrideArticlePrice seems to work", async () => {
  const token = await getToken()
  const pickupId = await getPickupId()
  const articleId = await getArticleId()

  const createdPickupItem = await deleteLater(
    createPickupItem({
      pickupItem: {
        pickupId,
        articleId,
        overrideArticlePrice: 1,
      },
      token,
    })
  )

  expect(createdPickupItem.overrideArticlePrice).toBe(1)

  const updatedPickupItem = await updatePickupItem({
    id: createdPickupItem.id,
    pickupItem: {
      articleId,
      overrideArticlePrice: undefined,
    },
    token,
  })

  expect(updatedPickupItem.overrideArticlePrice).toBe(undefined)

  const updatedPickupItemB = await updatePickupItem({
    id: createdPickupItem.id,
    pickupItem: {
      articleId,
      overrideArticlePrice: 3,
    },
    token,
  })

  expect(updatedPickupItemB.overrideArticlePrice).toBe(3)
})
