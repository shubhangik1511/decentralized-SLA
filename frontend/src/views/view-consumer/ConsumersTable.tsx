import { useState, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

// ** Next Import
import { useRouter } from 'next/router'

import { useContractRead } from 'wagmi'
import slaAbi from 'src/@core/abi/SlaAbi.json'

interface Consumer {
  consumerAddress: string
  ref: string
  contractValidity: number
}

const ConsumersTable = () => {
  const [sla, setSla] = useState<string>('')
  const router = useRouter()
  const { data, isError, isLoading } = useContractRead({
    address: sla as `0x${string}`,
    abi: slaAbi,
    functionName: 'getConsumers'
  })

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      const sla = router.query['sla']
      if (sla) setSla((sla as string).trim())
    } else {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='left'>Consumer Address</TableCell>
            <TableCell align='left'>Ref</TableCell>
            <TableCell align='center'>Validity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            (!isError && !isLoading && (data as Consumer[]).length === 0 ? (
              <TableCell align='center' colSpan={3}>
                No data found.
              </TableCell>
            ) : (
              (data as Consumer[]).map(row => (
                <TableRow
                  key={row.consumerAddress}
                  sx={{
                    '&:last-of-type td, &:last-of-type th': {
                      border: 0
                    }
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {row.consumerAddress}
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {row.ref}
                  </TableCell>
                  <TableCell align='center'>{new Date(Number(row.contractValidity) * 1000).toDateString()}</TableCell>
                </TableRow>
              ))
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ConsumersTable
