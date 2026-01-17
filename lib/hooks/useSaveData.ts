import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

// 🎯 Configuration interface for reusable storage
export interface StorageConfig {
  keys: Record<string, string>
  area?: "local" | "sync" | "session"
}


// 🪝 Reactive storage hook (auto-renders on changes - best for individual fields)
export function useSaveData<T>(
  key: string,
  defaultValue: T,
  area: "local" | "sync" | "session" = "local"
) {
  const [value, setValue] = useStorage<T>({
    key,
    instance: new Storage({ area })
  })

  return [
    value ?? defaultValue,
    setValue
  ] as const
}

// 📦 Reactive form storage (auto-syncs entire form)
export function useSafeFormData<T>(
  config: StorageConfig & { defaultValues: T }
) {
  const storage = new Storage({ area: config.area || "local" })

  // Create reactive state for each key
  const state = Object.keys(config.keys).reduce((acc, fieldName) => {
    const key = config.keys[fieldName]
    const [value, setValue] = useSaveData(
      key,
      (config.defaultValues as Record<string, unknown>)[fieldName]
    )
    acc[fieldName] = { value, setValue }
    return acc
  }, {} as Record<string, { value: unknown; setValue: (value: unknown) => void }>)

  return {
    state,
    // Batch save method
    saveAll: async (data: T): Promise<void> => {
      await Promise.all(
        Object.entries(data as Record<string, unknown>).map(([key, value]) =>
          storage.set(key, value)
        )
      )
    },
    // Clear all
    clearAll: async (): Promise<void> => {
      await Promise.all(
        Object.values(config.keys).map((key) => storage.set(key, null))
      )
    }
  }
}

