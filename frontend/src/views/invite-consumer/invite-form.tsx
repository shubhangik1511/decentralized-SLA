import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

// ** Next Imports
import { useRouter } from 'next/router'

import Close from 'mdi-material-ui/Close'

import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import slaAbi from 'src/@core/abi/SlaAbi.json'

const InviteForm = () => {
  const [email, setEmail] = useState<string>('')
  const [ref, setRef] = useState<string>('')
  const [sla, setSla] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const router = useRouter()

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: sla as `0x${string}`,
    abi: slaAbi,
    functionName: 'inviteConsumer',
    args: [
      ref,
      [email, `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invite?sla=${sla}`, Math.floor(Date.now() / 1000).toString()],
      BigInt(300000)
    ],
    gas: BigInt(1_500_000)
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
    if (Object.keys(router.query).length > 0) {
      const sla = router.query['sla']
      if (sla) setSla((sla as string).trim())
    } else {
      router.push('/dashboard')
    }
  }, [router])

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
      router.push(`/view-sla`)
    }
  }, [isTxSuccess, isTxLoading, router])

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
              label='Email'
              onChange={e => setEmail(e.target.value)}
              placeholder='Email of the consumer'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Ref'
              onChange={e => setRef(e.target.value)}
              placeholder='Reference (can be name)'
            />
          </Grid>

          <Grid item xs={12}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button variant='contained' type='submit' disabled={!write}>
                Invite
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default InviteForm
