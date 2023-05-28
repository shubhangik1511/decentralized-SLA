import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

import Close from 'mdi-material-ui/Close'

import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import managerAbi from 'src/@core/abi/ManagerAbi.json'

const periods = [
  { id: '5min', name: '5 mins', value: 5 * 60 },
  { id: '1day', name: '1 Day', value: 24 * 60 * 60 },
  { id: '1month', name: '1 Month', value: 30 * 24 * 60 * 60 },
  { id: '3months', name: '3 Months', value: 3 * 30 * 24 * 60 * 60 },
  { id: '6months', name: '6 Months', value: 6 * 30 * 24 * 60 * 60 },
  { id: '1year', name: '1 Year', value: 12 * 30 * 24 * 60 * 60 }
]

const SLAForm = () => {
  const [name, setName] = useState<string>('Sample Contract')
  const [period, setPeriod] = useState<number>(30 * 24 * 60 * 60)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS as `0x${string}`,
    abi: managerAbi,
    functionName: 'createSLAContract',
    args: [name, period]
  })
  const { data, write } = useContractWrite(config)

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    error,
    isError
  } = useWaitForTransaction({
    hash: data?.hash
  })

  useEffect(() => {
    if (isPrepareError || isError) {
      setShowError(true)
    } else {
      setShowError(false)
    }
  }, [isPrepareError, isError])

  useEffect(() => {
    if (isTxLoading) {
      setIsLoading(true)
    }
    if (isTxSuccess) {
      setIsLoading(false)
    }
  }, [isTxSuccess, isTxLoading])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    write!()
  }

  return (
    <>
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
            <AlertTitle>{JSON.stringify(prepareError || error)}</AlertTitle>
          </Alert>
        </Grid>
      ) : null}
      <form onSubmit={submitHandler}>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Name'
              onChange={e => setName(e.target.value)}
              placeholder='Name of the contract for reference'
              defaultValue='Sample Contract'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select label='Period' defaultValue={30 * 24 * 60 * 60} onChange={e => setPeriod(Number(e.target.value))}>
                {periods.map(period => (
                  <MenuItem key={period.id} value={period.value}>
                    {period.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button variant='contained' type='submit' disabled={!write}>
                Create
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default SLAForm
