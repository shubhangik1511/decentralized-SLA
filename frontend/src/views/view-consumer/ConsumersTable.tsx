import { useState, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

import Close from 'mdi-material-ui/Close'

// ** Next Import
import { useRouter } from 'next/router'

import { useContractRead, usePrepareContractWrite, useAccount, useWaitForTransaction, useContractWrite } from 'wagmi'
import slaAbi from 'src/@core/abi/SlaAbi.json'

interface Consumer {
  consumerAddress: string
  ref: string
  validity: number
}

const ConsumersTable = () => {
  const [sla, setSla] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const { address } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      const sla = router.query['sla']
      if (sla) setSla((sla as string).trim())
    } else {
      router.push('/')
    }
  }, [router])

  const {
    data,
    isError: isTxError,
    error: txError,
    isLoading: isTxLoading
  } = useContractRead({
    address: sla as `0x${string}`,
    abi: slaAbi,
    functionName: 'getConsumers'
  })

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: sla as `0x${string}`,
    abi: slaAbi,
    functionName: 'claimFees',
    args: [address]
  })

  const { data: claimData, write } = useContractWrite(config)

  const {
    isLoading: isClaimLoading,
    isSuccess: isClaimSuccess,
    error: claimError,
    isError: isClaimError
  } = useWaitForTransaction({
    hash: claimData?.hash
  })

  useEffect(() => {
    if (isPrepareError || isClaimError) {
      setShowError(true)
    } else {
      setShowError(false)
    }
  }, [isPrepareError, isClaimError])

  useEffect(() => {
    if (isClaimLoading) {
      setIsLoading(true)
    }
    if (isClaimSuccess) {
      setIsLoading(false)
    }
  }, [isClaimSuccess, isClaimLoading, router])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <TableContainer component={Paper}>
      {showError ? (
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Alert
            severity='warning'
            sx={{ '& a': { fontWeight: 400 } }}
            action={
              <IconButton size='small' color='inherit' aria-label='close' onClick={() => setShowError(false)}>
                <Close fontSize='inherit' />
              </IconButton>
            }
          >
            <AlertTitle>{JSON.stringify(prepareError || txError || claimError)}</AlertTitle>
          </Alert>
        </Grid>
      ) : null}
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='left'>Ref</TableCell>
            <TableCell align='center'>Consumer Address</TableCell>
            <TableCell align='center'>Validity</TableCell>
            <TableCell align='center'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            (!isTxError && !isTxLoading && (data as Consumer[]).length === 0 ? (
              <TableCell align='center' colSpan={4}>
                No data found.
              </TableCell>
            ) : (
              (data as Consumer[])
                .sort((a, b) => Number(b.validity) - Number(a.validity))
                .map(row => (
                  <TableRow
                    key={row.consumerAddress}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.ref}
                    </TableCell>
                    <TableCell align='center' component='th' scope='row'>
                      {row.consumerAddress}
                    </TableCell>
                    <TableCell align='center'>{new Date(Number(row.validity) * 1000).toUTCString()}</TableCell>
                    <TableCell align='center' sx={{ maxWidth: '140px' }}>
                      <Button variant='outlined' size='small' sx={{ width: '100%' }} disabled={!write} onClick={write}>
                        Claim
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

export default ConsumersTable
