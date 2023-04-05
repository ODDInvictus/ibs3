type RowData = {
  id: number
  person: number
  product: number
  amount: number
}

type UpdateDataFn = (row: number, rowData: RowData) => void
