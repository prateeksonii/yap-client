import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler) // Clear timeout on change
  }, [value, delay])

  return debouncedValue
}
