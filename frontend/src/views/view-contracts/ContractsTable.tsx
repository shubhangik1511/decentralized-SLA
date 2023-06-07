// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import OpenInNew from 'mdi-material-ui/OpenInNew'
import Button from '@mui/material/Button'
import EyeSettingsOutline from 'mdi-material-ui/EyeSettingsOutline'

import { useContractRead, useAccount } from 'wagmi'
import managerAbi from 'src/@core/abi/ManagerAbi.json'

import { useRouter } from 'next/router'

interface Contract {
  name: string
  slaAddress: string
  createdAt: number
}

const ContractsTable = () => {
  const { address } = useAccount()
  const router = useRouter()
  const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS as `0x${string}`,
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
            <TableCell align='center'>Created At</TableCell>
            <TableCell align='center'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            (!isError && !isLoading && (data as Contract[]).length === 0 ? (
              <TableCell align='center' colSpan={4}>
                No data found.
              </TableCell>
            ) : (
              (data as Contract[])
                .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                .map(row => (
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
                    <TableCell align='center'>{new Date(Number(row.createdAt) * 1000).toUTCString()}</TableCell>
                    <TableCell align='center' sx={{ maxWidth: '140px' }}>
                      <Button
                        variant='outlined'
                        size='small'
                        sx={{ width: '100%' }}
                        onClick={() => router.push(`/contract?sla=${row.slaAddress}`)}
                      >
                        <EyeSettingsOutline fontSize='small' sx={{ marginRight: 1 }} />
                        View More
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ContractsTable
