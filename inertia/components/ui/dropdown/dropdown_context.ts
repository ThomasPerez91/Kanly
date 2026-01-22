import { createContext, useContext } from 'react'

export type DropdownContextValue = {
  close: () => void
}

export const DropdownContext = createContext<DropdownContextValue | null>(null)

export const useDropdown = (): DropdownContextValue | null => {
  return useContext(DropdownContext)
}
