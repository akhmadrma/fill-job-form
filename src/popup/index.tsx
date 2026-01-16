import { useReducer } from "react"

import "../../style.css"


import { DataForm } from "@/components/data-form"

function IndexPopup() {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <DataForm />
  )
}

export default IndexPopup
