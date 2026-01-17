import { NavButton } from "@/components/nav-button"

import { SidePanelProvider } from "../context/SidePanelContext"

import "../../style.css"

function IndexPopup() {
  return (
    <SidePanelProvider>
      <div>
        <NavButton target="newtab" />
        <NavButton target="sidepanel" />
      </div>
    </SidePanelProvider>
  )
}

export default IndexPopup
