import { writable } from 'svelte/store'

function createUser(user) {
  const { subscribe, set, update } = writable(user)

  return {
    reset: () => set(null),
    subscribe,
    update,
  }
}

export const user = u => createUser(u)
