export function getSaveEnv(key: string, defaultValue?: string) {
  const result = process.env[key]

  if (result != null) {
    return result
  } else if (defaultValue !== undefined) {
    return defaultValue
  } else {
    throw new Error(`Env variable "${key}" is required`)
  }
}