// Custom storage adapter for redux-persist that avoids the
// Vite/ESM interop issue with `redux-persist/lib/storage`.
// Implements the WebStorage interface (getItem / setItem / removeItem).

interface WebStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

const createNoopStorage = (): WebStorage => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
})

const createWebStorage = (): WebStorage => ({
  getItem: (key) => {
    try {
      return Promise.resolve(window.localStorage.getItem(key))
    } catch (err) {
      return Promise.reject(err)
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
})

export const storage: WebStorage =
  typeof window !== "undefined" ? createWebStorage() : createNoopStorage()
