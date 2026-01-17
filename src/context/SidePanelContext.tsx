import { createContext, useCallback, useContext, useEffect, useState } from "react"

interface SidePanelContextValue {
  isOpen: boolean
  toggle: () => Promise<void>
}

export const SidePanelContext = createContext<SidePanelContextValue | null>(null)

export function SidePanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)


  const toggle = useCallback(async () => {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    const windowId = tabs[0]?.windowId
    if (!windowId) return

    const currentState = await chrome.storage.local.get("sidePanelOpen")
    const newState = !currentState.sidePanelOpen

    await chrome.storage.local.set({ sidePanelOpen: newState })

    if (newState === true) {
      await chrome.sidePanel.open({ windowId })
    } else {
      // only available in chrome 141+
      // @ts-ignore
      await chrome.sidePanel.close({ windowId })
    }

    setIsOpen(newState)
  }, [])

  return (
    <SidePanelContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidePanelContext.Provider>
  )
}

export const useSidePanel = () => {
  const context = useContext(SidePanelContext)
  if (!context)
    throw new Error("useSidePanel must be used within SidePanelProvider")
  return context
}
