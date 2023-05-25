// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { useContractRead, useAccount } from 'wagmi'
import managerAbi from 'src/@core/abi/ManagerAbi.json'

interface Contract {
  name: string
  slaAddress: string
  createdAt: number
}

const ContractsTable = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS}`,
    abi: managerAbi,
    functionName: 'getConsumerSLAs',
    args: [address]
  })

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align='center'>Address</TableCell>
            <TableCell align='right'>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isError &&
            !isLoading &&
            (data as Contract[]).map(row => (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='center'>{row.slaAddress}</TableCell>
                <TableCell align='right'>{row.createdAt}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ContractsTable
