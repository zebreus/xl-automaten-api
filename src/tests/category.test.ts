import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "category"
import { Category } from "helpers/convertCategory"
import { login } from "login"
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

const categoriesToDeleteAfterwards: Array<number> = []
async function deleteLater(category: Promise<Category>): Promise<Category>
async function deleteLater(category: number): Promise<void>
async function deleteLater(category: Promise<Category> | number): Promise<Category | void> {
  const id = typeof category === "object" ? (await category).id : category
  categoriesToDeleteAfterwards.push(id)
  return typeof category === "object" ? category : undefined
}

beforeAll(async () => {
  getToken()
})

afterAll(async () => {
  const token = await getToken()
  for (const id of categoriesToDeleteAfterwards) {
    try {
      await deleteCategory({
        id,
        token,
      })
    } catch (e) {
      // Ignore errors
    }
  }
})

test("Create category seems to work", async () => {
  const token = await getToken()
  const result = await deleteLater(
    createCategory({
      category: {
        name: "test-category",
      },
      token,
    })
  )

  await expect(result.createdAt.getTime()).toBeGreaterThan(Date.now() - 1000 * 60)
})

test("Creating two categories with the same name works", async () => {
  const token = await getToken()

  await deleteLater(
    createCategory({
      category: {
        name: "test-category",
      },
      token,
    })
  )

  await expect(
    deleteLater(
      createCategory({
        category: {
          name: "test-category",
        },
        token,
      })
    )
  ).resolves.toBeDefined()
})

test("Get category seems to work", async () => {
  const token = await getToken()
  const createdCategory = await deleteLater(
    createCategory({
      category: {
        name: "test-category",
        description: "Created for getCategory test",
      },
      token,
    })
  )

  const category = await getCategory({
    id: createdCategory.id,
    token,
  })

  await expect(category.description).toBe("Created for getCategory test")
})

test("Get category throws sane error for nonexisting category", async () => {
  const token = await getToken()

  const category = getCategory({
    id: 9219329,
    token,
  })

  await expect(category).rejects.toThrow("Entry for Category not found")
})

test("Delete category seems to work", async () => {
  const token = await getToken()
  const createdCategory = await deleteLater(
    createCategory({
      category: {
        name: "test-category",
      },
      token,
    })
  )

  await deleteCategory({
    id: createdCategory.id,
    token,
  })

  // Verify that the category is deleted
  await expect(
    getCategory({
      id: createdCategory.id,
      token,
    })
  ).rejects.toThrow()
})

test("Deleting nonexisting category throws sane error", async () => {
  const token = await getToken()

  const category = deleteCategory({
    id: 9219329,
    token,
  })

  await expect(category).rejects.toThrow("Entry for Category not found")
})

test("Update category throws sane error for nonexisting category", async () => {
  const token = await getToken()

  const category = updateCategory({
    id: 9219329,
    category: {},
    token,
  })

  await expect(category).rejects.toThrow("Entry for Category not found")
})

test("Update category seems to work", async () => {
  const token = await getToken()
  const createdCategory = await deleteLater(
    createCategory({
      category: {
        name: "test-category",
        description: "old description",
      },
      token,
    })
  )

  expect(createdCategory.description).toBe("old description")

  const updatedCategory = await updateCategory({
    id: createdCategory.id,
    category: {
      description: "new description",
    },
    token,
  })

  expect(updatedCategory.description).toBe("new description")

  const gotCategory = await getCategory({
    id: createdCategory.id,
    token,
  })

  expect(gotCategory.description).toBe("new description")
})

test("List categories seems to work", async () => {
  const token = await getToken()

  const categoryA = await deleteLater(
    createCategory({
      category: {
        name: "list test alpha",
      },
      token,
    })
  )

  const categoryB = await deleteLater(
    createCategory({
      category: {
        name: "list test beta",
      },
      token,
    })
  )

  const categories = await getCategories({ token })

  expect(categories.length).toBeGreaterThanOrEqual(2)
  expect(categories.find(p => p.name === categoryA.name)).toBeDefined()
  expect(categories.find(p => p.name === categoryB.name)).toBeDefined()
})
