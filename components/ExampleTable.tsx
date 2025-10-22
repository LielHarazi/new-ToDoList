'use client'

import { useState } from 'react'
import Table, { ConfigT } from 'zvijude/table'

export default function ExampleTable({ data = [] }: any) {
  const [columns, setColumns] = useState(headers)
  const [state, setState] = useState(data)

  const config = {
    tblId: 'someTable',
    columns,
    setColumns,
    data,
    state,
    setState,
  } as unknown as ConfigT

  return (
    <div>
      <Table config={config} tblCls='mb-0 rounded-b-none' />
    </div>
  )
}

const headers = [
  { key: 'offrDt', label: 'תאריך שליחת הצעה', format: 'formatDate' },
  { key: 'clientData', label: 'לקוח' },
]
