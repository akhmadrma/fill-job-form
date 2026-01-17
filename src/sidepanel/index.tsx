import { DataForm } from "@/components/data-form"

import "../../style.css"

function IndexSidePanel() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <DataForm />
    </div>
  )
}

export default IndexSidePanel
