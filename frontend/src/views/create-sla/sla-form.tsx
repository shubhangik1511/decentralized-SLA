import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

import Close from 'mdi-material-ui/Close'

import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import managerAbi from 'src/@core/abi/ManagerAbi.json'

const SLAForm = () => {
  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS}`,
    abi: managerAbi,
    functionName: 'createSLAContract',
    args: [name]
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
            <AlertTitle>{prepareError || error}</AlertTitle>
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
