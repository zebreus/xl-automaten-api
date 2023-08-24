# xl-automaten-api

An unofficial TypeScript client library for the [XL Automaten](https://xl-automaten.de/) API.

You can use this library to access the API in an easy and type-safe way.

## Install

Just install it with your favorite package manager:

```bash
yarn add xl-automaten-api
pnpm add xl-automaten-api
npm install xl-automaten-api
```

The package should work in the browser and Node.js [versions 18 and up](#older-node-versions).

## Examples

## Obtain an auth token

You need an API token for nearly all operations. You can get one by calling the `login` function:

```typescript
const { token } = await login({
  email,
  password,
})
console.log("Your token is", token)
```

The token is typically valid for 1 hour.

### Create a pickup

You can create a new pickup code that can be used to pick up an order:

```typescript
const pickup = await createPickup({
  pickup: {
    code: "code-that-will-be-used-to-pickup-the-order",
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24),
    mastermoduleId: 99,
  },
  token: "your-token",
})

console.log(pickup)
```

### Get information about an existing pickup

To get information about an existing pickup, use the `getPickup` function:

```typescript
const pickup = await getPickup({
  code: "code-of-an-existing-pickup",
  token: "your-token",
})

console.log(pickup)

// With getPickup, you can also get the items included in the pickup:
console.log(pickup.items)
```

### Delete an existing pickup

To delete an existing pickup, use the `deletePickup` function:

```typescript
const pickup = await createPickup({
  pickup: {
    code: "any-string-you-want",
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24),
    mastermoduleId: 99,
  },
  token: "your-token",
})

console.log(pickup)
```

## API Documentation

The API documentation is available at https://xl-automaten.github.io/xl-automaten-api/.

## Older node versions\

This package uses the `fetch` API, which is only supported in Node.js 18 and up. If you need to use an older version of
Node.js, you can use `node-fetch`. It will be detected and used automatically if your node does not provide a native
fetch. The Options object supports passing a custom fetch function. You can also try to pass `node-fetch` there.

## Building and testing this package

To run the tests for this package, you need to have credentials for XL Automaten. Put these credentials into the
`src/tests/login.ts` file. Now you can run `yarn test` to run the tests.
