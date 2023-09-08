import { email, password } from "./login.js"
import { archiveArticle, createArticle, getArticles } from "../article.js"
import { Mapping } from "../helpers/convertMapping.js"
import { login } from "../login.js"
import { createMachine, deleteMachine } from "../machine.js"
import { createMapping, deleteMapping, getMapping, getMappings, updateMapping } from "../mapping.js"
import { createPosition, deletePosition } from "../position.js"
import { createSupplier, deleteSupplier } from "../supplier.js"
import { createTray, deleteTray } from "../tray.js"

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

const generateSerialNumber = () => {
  const id = Math.floor(Math.random() * 899999 + 100000)
  return "" + id
}

const machineIdsToDeleteAfterwards: Array<number> = []

const getMachineId = async () => {
  if (machineIdsToDeleteAfterwards[0]) {
    return machineIdsToDeleteAfterwards[0]
  }
  const token = await getToken()
  const machine = await createMachine({
    token,
    machine: {
      name: "Test Machine 3",
      displayName: "Machine on your right",
      serialNumber: generateSerialNumber(),
      place: "Musterstadt City",
      testMode: false,
      tempStopTime: 45,
      tempStopTemp: 8,
      tempWarningTemp: 12,
      tempWarningTime: 30,
    },
  })
  machineIdsToDeleteAfterwards.push(machine.id)
  return machine.id
}
function assertSlot(slot: number): asserts slot is 1 | 2 {
  if (slot > 18) {
    throw new Error("No more slots available in the test machine")
  }
  if (slot < 1) {
    throw new Error("Invalid slot")
  }
}

let nextSlot = 1
const trayIdsToDeleteAfterwards: Array<number> = []
const getTrayId = async () => {
  const machineId = await getMachineId()
  const slot = nextSlot
  nextSlot = nextSlot + 1
  assertSlot(slot)
  const token = await getToken()
  const tray = await createTray({
    token,
    tray: {
      machineId,
      slot,
      mountingPosition: 10,
      type: 1,
    },
  })

  trayIdsToDeleteAfterwards.push(tray.id)
  return tray.id
}

const positionIdsToDeleteAfterwards: Array<number> = []
const getPositionId = async () => {
  const trayId = await getTrayId()
  const token = await getToken()
  const position = await createPosition({
    token,
    position: {
      trayId,
      number: 1,
      width: 2,
    },
  })

  positionIdsToDeleteAfterwards.push(position.id)
  return position.id
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

let testArticle: number
const articleIdsToDeleteAfterwards: Array<number> = []
const getArticleId = async () => {
  if (testArticle) {
    return testArticle
  }
  const token = await getToken()
  const articles = await getArticles({ token })
  const firstArticle = articles[0]
  if (firstArticle) {
    testArticle = firstArticle.id
    return firstArticle.id
  }

  const supplierId = await getSupplierId()
  const article = await createArticle({
    token,
    article: {
      description: "Created for mapping test",
      name: "test-article",
      number: "123456-mapping",
      price: 4,
      supplierId: supplierId,
    },
  })

  testArticle = article.id
  articleIdsToDeleteAfterwards.push(article.id)
  return testArticle
}

const mappingsToDeleteAfterwards: Array<number> = []
async function deleteLater(mapping: Promise<Mapping>): Promise<Mapping>
async function deleteLater(mapping: number): Promise<void>
async function deleteLater(mapping: Promise<Mapping> | number): Promise<Mapping | void> {
  const id = typeof mapping === "object" ? (await mapping).id : mapping
  mappingsToDeleteAfterwards.push(id)
  return typeof mapping === "object" ? mapping : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of mappingsToDeleteAfterwards) {
    try {
      await deleteMapping({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
  for (const id of articleIdsToDeleteAfterwards) {
    try {
      await archiveArticle({
        id,
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
  for (const id of positionIdsToDeleteAfterwards) {
    try {
      await deletePosition({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
  for (const id of trayIdsToDeleteAfterwards) {
    try {
      await deleteTray({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
  for (const id of machineIdsToDeleteAfterwards) {
    try {
      await deleteMachine({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
})

test("Create mapping seems to work", async () => {
  const token = await getToken()
  const positionId = await getPositionId()
  const articleId = await getArticleId()
  const result = await deleteLater(
    createMapping({
      mapping: {
        positionId,
        articleId,
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Create mapping seems to work with all fields", async () => {
  const token = await getToken()
  const positionId = await getPositionId()
  const articleId = await getArticleId()
  const result = await deleteLater(
    createMapping({
      mapping: {
        positionId,
        articleId,
        inventory: 6,
        empty: true,
      },
      token,
    })
  )

  expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
  expect(result.inventory).toBe(6)
  expect(result.empty).toBe(true)
})

test("Creating two mappings with the same article and position overwrites the first one", async () => {
  const token = await getToken()
  const positionId = await getPositionId()
  const articleId = await getArticleId()

  const firstMapping = await deleteLater(
    createMapping({
      mapping: {
        positionId,
        articleId,
        inventory: 2,
      },
      token,
    })
  )

  expect(firstMapping.inventory).toBe(2)
  await expect(getMapping({ id: firstMapping.id, token })).resolves.toBeDefined()

  const secondMapping = await deleteLater(
    createMapping({
      mapping: {
        positionId,
        articleId,
        inventory: 6,
      },
      token,
    })
  )

  expect(secondMapping.inventory).toBe(6)
  await expect(getMapping({ id: secondMapping.id, token })).resolves.toBeDefined()
  await expect(getMapping({ id: firstMapping.id, token })).rejects.toThrow()

  const gotSecondMapping = await getMapping({ id: secondMapping.id, token })
  expect(gotSecondMapping.inventory).toBe(6)
})

test("Get mapping seems to work", async () => {
  const token = await getToken()
  const positionId = await getPositionId()
  const articleId = await getArticleId()

  const createdMapping = await deleteLater(
    createMapping({
      mapping: {
        positionId,
        articleId,
        inventory: 9,
      },
      token,
    })
  )

  const mapping = await getMapping({
    id: createdMapping.id,
    token,
  })

  await expect(mapping.inventory).toBe(9)
})

test("Get mapping throws sane error for nonexisting mapping", async () => {
  const token = await getToken()

  const mapping = getMapping({
    id: 9219329,
    token,
  })

  await expect(mapping).rejects.toThrow("Entry for Mapping not found")
})

test("Deleting a mapping seems to work", async () => {
  const token = await getToken()
  const positionId = await getPositionId()
  const articleId = await getArticleId()

  const createdMapping = await deleteLater(
    createMapping({
      mapping: {
        positionId,
        articleId,
        inventory: 7,
      },
      token,
    })
  )

  await deleteMapping({
    id: createdMapping.id,
    token,
  })

  // Verify that the mapping is really deleted
  await expect(
    getMapping({
      id: createdMapping.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting mapping throws sane error", async () => {
  const token = await getToken()

  const mapping = deleteMapping({
    id: 9219329,
    token,
  })

  await expect(mapping).rejects.toThrow("Entry for Mapping not found")
})

test("Update mapping throws sane error for nonexisting mapping", async () => {
  const token = await getToken()

  const mapping = updateMapping({
    id: 9219329,
    mapping: {},
    token,
  })

  await expect(mapping).rejects.toThrow("Entry for Mapping not found")
})

test("Update mapping seems to work", async () => {
  const token = await getToken()
  const positionId = await getPositionId()
  const articleId = await getArticleId()

  const createdMapping = await deleteLater(
    createMapping({
      mapping: {
        positionId,
        articleId,
        inventory: 4,
      },
      token,
    })
  )

  expect(createdMapping.inventory).toBe(4)

  const updatedMapping = await updateMapping({
    id: createdMapping.id,
    mapping: {
      inventory: 6,
    },
    token,
  })

  expect(updatedMapping.inventory).toBe(6)

  const gotMapping = await getMapping({
    id: createdMapping.id,
    token,
  })

  expect(gotMapping.inventory).toBe(6)
})

test("List mappings seems to work", async () => {
  const token = await getToken()
  const articleId = await getArticleId()

  const mappingA = await deleteLater(
    createMapping({
      mapping: {
        positionId: await getPositionId(),
        articleId,
        inventory: 5,
      },
      token,
    })
  )

  const mappingB = await deleteLater(
    createMapping({
      mapping: {
        positionId: await getPositionId(),
        articleId,
        inventory: 5,
      },
      token,
    })
  )

  const mappings = await getMappings({ token })

  expect(mappings.length).toBeGreaterThanOrEqual(2)
  expect(mappings.find(p => p.positionId === mappingA.positionId && p.articleId === mappingA.articleId)).toBeDefined()
  expect(mappings.find(p => p.positionId === mappingB.positionId && p.articleId === mappingB.articleId)).toBeDefined()
})

test("List mappings does not crash", async () => {
  const token = await getToken()

  const mappings = await getMappings({ token })

  expect(mappings.length).toBeGreaterThanOrEqual(0)
})
