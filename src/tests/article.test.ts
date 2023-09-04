import { archiveArticle, createArticle, getArticle, getArticles, updateArticle } from "article"
import { Article } from "helpers/convertArticle"
import { login } from "login"
import { createSupplier, deleteSupplier } from "supplier"
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

const articlesToDeleteAfterwards: Array<number> = []
async function deleteLater(article: Promise<Article>): Promise<Article>
async function deleteLater(article: number): Promise<void>
async function deleteLater(article: Promise<Article> | number): Promise<Article | void> {
  const id = typeof article === "object" ? (await article).id : article
  articlesToDeleteAfterwards.push(id)
  return typeof article === "object" ? article : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of articlesToDeleteAfterwards) {
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
})

test("Create article seems to work", async () => {
  const token = await getToken()
  const result = await deleteLater(
    createArticle({
      article: {
        name: "test-article",
        number: "123456",
        price: 4,
        supplierId: await getSupplierId(),
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating two articles with the same name works", async () => {
  const token = await getToken()

  await deleteLater(
    createArticle({
      article: {
        name: "test-article",
        number: "123456",
        price: 4,
        supplierId: await getSupplierId(),
      },
      token,
    })
  )

  await expect(
    deleteLater(
      createArticle({
        article: {
          name: "test-article",
          number: "123456",
          price: 4,
          supplierId: await getSupplierId(),
        },
        token,
      })
    )
  ).resolves.toBeDefined()
})

test("Get article seems to work", async () => {
  const token = await getToken()
  const createdArticle = await deleteLater(
    createArticle({
      article: {
        description: "Created for getArticle test",
        name: "test-article",
        number: "123456",
        price: 4,
        supplierId: await getSupplierId(),
      },
      token,
    })
  )

  const article = await getArticle({
    id: createdArticle.id,
    token,
  })

  await expect(article.description).toBe("Created for getArticle test")
})

test("Get article throws sane error for nonexisting article", async () => {
  const token = await getToken()

  const article = getArticle({
    id: 9219329,
    token,
  })

  await expect(article).rejects.toThrow("Entry for Article not found")
})

test("Archiving an article seems to work", async () => {
  const token = await getToken()
  const createdArticle = await deleteLater(
    createArticle({
      article: {
        name: "test-article",
        number: "123456",
        price: 4,
        supplierId: await getSupplierId(),
      },
      token,
    })
  )

  const archivedArticle = await archiveArticle({
    id: createdArticle.id,
    token,
  })

  expect(archivedArticle.archived).toBe(true)

  // Verify that the article is really archived
  const gotArticle = await getArticle({
    id: createdArticle.id,
    token,
  })

  expect(gotArticle.archived).toBe(true)
})

test("Deleting nonexisting article throws sane error", async () => {
  const token = await getToken()

  const article = archiveArticle({
    id: 9219329,
    token,
  })

  await expect(article).rejects.toThrow("Entry for Article not found")
})

test("Update article throws sane error for nonexisting article", async () => {
  const token = await getToken()

  const article = updateArticle({
    id: 9219329,
    article: {},
    token,
  })

  await expect(article).rejects.toThrow("Entry for Article not found")
})

test("Update article seems to work", async () => {
  const token = await getToken()
  const createdArticle = await deleteLater(
    createArticle({
      article: {
        name: "test-article",
        number: "123456",
        price: 4,
        supplierId: await getSupplierId(),
        description: "old description",
      },
      token,
    })
  )

  expect(createdArticle.description).toBe("old description")

  const updatedArticle = await updateArticle({
    id: createdArticle.id,
    article: {
      description: "new description",
    },
    token,
  })

  expect(updatedArticle.description).toBe("new description")

  const gotArticle = await getArticle({
    id: createdArticle.id,
    token,
  })

  expect(gotArticle.description).toBe("new description")
})

test("List articles seems to work", async () => {
  const token = await getToken()

  const articleA = await deleteLater(
    createArticle({
      article: {
        name: "list test alpha",
        number: "123456",
        price: 4,
        supplierId: await getSupplierId(),
      },
      token,
    })
  )

  const articleB = await deleteLater(
    createArticle({
      article: {
        name: "list test beta",
        number: "123456",
        price: 4,
        supplierId: await getSupplierId(),
      },
      token,
    })
  )

  const articles = await getArticles({ token })

  expect(articles.length).toBeGreaterThanOrEqual(2)
  expect(articles.find(p => p.name === articleA.name)).toBeDefined()
  expect(articles.find(p => p.name === articleB.name)).toBeDefined()
})

test("List articles does not crash", async () => {
  const token = await getToken()

  const articles = await getArticles({ token })

  expect(articles.length).toBeGreaterThanOrEqual(1)
})

// eslint-disable-next-line jest/no-commented-out-tests
// test("Archiving an article hides it from the list", async () => {
//   const token = await getToken()
//   const id = Math.random().toString(36).substring(7)
//   const createdArticle = await deleteLater(
//     createArticle({
//       article: {
//         name: "archive-test-" + id,
//         number: "123456",
//         price: 4,
//         supplierId: await getSupplierId(),
//       },
//       token,
//     })
//   )

//   const archivedArticle = await archiveArticle({
//     id: createdArticle.id,
//     token,
//   })

//   expect(archivedArticle.archived).toBe(true)

//   // Verify that the article is really archived
//   const articles = await getArticles({
//     token,
//   })

//   expect(articles.find(a => a.id === createdArticle.id)).toBeUndefined()
// })
