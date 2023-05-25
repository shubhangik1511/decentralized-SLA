// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import OpenInNew from 'mdi-material-ui/OpenInNew'
import { useContractRead, useAccount } from 'wagmi'
import managerAbi from 'src/@core/abi/ManagerAbi.json'

interface SLA {
  name: string
  slaAddress: string
  createdAt: number
}

const SLAsTable = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS}`,
    abi: managerAbi,
    functionName: 'getProviderSLAs',
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
          {!isError && !isLoading && data && (data as SLA[]).length === 0 ? (
            <TableCell align='center' colSpan={3}>
              No data found.
            </TableCell>
          ) : (
            (data as SLA[]).map(row => (
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
                <TableCell align='center'>
                  <>
                    {row.slaAddress}
                    <OpenInNew
                      sx={{ marginLeft: 1, fontSize: 16 }}
                      cursor='pointer'
                      onClick={() =>
                        window.open(`${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${row.slaAddress}`, '_blank')
                      }
                    />
                  </>
                </TableCell>
                <TableCell align='left'>{row.createdAt}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SLAsTable
