// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

// ** Next Import
import { useRouter } from 'next/router'

// ** Icons Imports
import AccountPlus from 'mdi-material-ui/AccountPlus'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import AccountCheck from 'mdi-material-ui/AccountCheck'
import OpenInNew from 'mdi-material-ui/OpenInNew'

import { useContractRead, useAccount } from 'wagmi'
import managerAbi from 'src/@core/abi/ManagerAbi.json'

interface SLA {
  name: string
  slaAddress: string
  createdAt: string
}

const SLAsTable = () => {
  const { address } = useAccount()
  const router = useRouter()
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
            <TableCell align='center'>Created At</TableCell>
            <TableCell align='center'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            (!isError && !isLoading && (data as SLA[]).length === 0 ? (
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
                  <TableCell align='left'>{new Date(Number(row.createdAt) * 1000).toDateString()}</TableCell>
                  <TableCell align='center' sx={{ maxWidth: '140px' }}>
                    <Button
                      variant='outlined'
                      size='small'
                      sx={{ width: '100%' }}
                      onClick={() => router.push('/invite-consumer')}
                    >
                      <AccountPlus fontSize='small' sx={{ marginRight: 1 }} />
                      Invite Consumer
                    </Button>
                    <br />
                    <hr style={{ marginTop: 14, marginBottom: 14 }} />
                    <Button
                      variant='outlined'
                      size='small'
                      sx={{ marginBottom: 2, width: '100%' }}
                      onClick={() => router.push('/view-invitations')}
                    >
                      <AccountCheck fontSize='small' sx={{ marginRight: 1 }} />
                      View Invitations
                    </Button>
                    <br />
                    <Button
                      variant='outlined'
                      size='small'
                      sx={{ width: '100%' }}
                      onClick={() => router.push('/view-consumers')}
                    >
                      <AccountGroup fontSize='small' sx={{ marginRight: 1 }} />
                      View Consumers
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

export default SLAsTable
