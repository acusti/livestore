import { makePersistedAdapter } from '@livestore/adapter-web'
import sharedWorker from '@livestore/adapter-web/shared-worker?sharedworker'
import { defineStore } from '@livestore/livestore'
import { useStore } from '@livestore/react'
import { workspaceSchema } from './schema.ts'
import worker from './worker.ts?worker'

const resetPersistence = import.meta.env.DEV && new URLSearchParams(window.location.search).get('reset') !== null

if (resetPersistence) {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.delete('reset')
  window.history.replaceState(null, '', `${window.location.pathname}?${searchParams.toString()}`)
}

const adapter = makePersistedAdapter({
  storage: { type: 'opfs' },
  worker,
  sharedWorker,
  resetPersistence,
})

export const workspaceStoreDef = defineStore({
  name: 'workspace',
  schema: workspaceSchema,
  adapter,
})

export function useWorkspaceStore() {
  return useStore({ storeDef: workspaceStoreDef, storeId: 'workspace-root' })
}
