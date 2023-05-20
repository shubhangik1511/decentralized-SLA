import { useState, useEffect } from 'react'

interface SLA {
  name: string
  calories: number
  fat: number
  carbs: number
  protein: number
}

const createData = (name: string, calories: number, fat: number, carbs: number, protein: number): SLA => {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

export const useSLAs = () => {
  const [SLAs, setSLAs] = useState<SLA[]>([])

  useEffect(() => {
    setSLAs(rows)
  }, [])

  return { SLAs }
}

export default useSLAs