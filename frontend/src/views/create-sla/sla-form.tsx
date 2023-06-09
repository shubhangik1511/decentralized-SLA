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

// ** Next Import
import { useRouter } from 'next/router'

import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import managerAbi from 'src/@core/abi/ManagerAbi.json'

const periods = [
  { id: '1month', name: '1 Month', value: 30 },
  { id: '3months', name: '3 Months', value: 3 * 30 },
  { id: '6months', name: '6 Months', value: 6 * 30 },
  { id: '1year', name: '1 Year', value: 12 * 30 }
]

const SLAForm = () => {
  const [name, setName] = useState<string>('Sample Contract')
  const [period, setPeriod] = useState<number>(30)
  const [fee, setFee] = useState<bigint>(BigInt(0))
  const [chargePerViolation, setChargePerViolation] = useState<bigint>(BigInt(0))
  const [apiToCheck, setApiToCheck] = useState<string>('')
  const [method, setMethod] = useState<string>('')
  const [path, setPath] = useState<string>('')
  const [expectedValue, setExpectedValue] = useState<string>('')
  const [zendeskSecret, setZendeskSecret] = useState<string>('')
  const [zendeskMaxFirstResponseTime, setZendeskMaxFirstResponseTime] = useState<number>(24)
  const [zendeskSubdomain, setZendeskSubdomain] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const router = useRouter()

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS as `0x${string}`,
    abi: managerAbi,
    functionName: 'createSLAContract',
    args: [
      name,
      period,
      fee,
      chargePerViolation,
      [apiToCheck, method, path, expectedValue],
      ['', String(zendeskMaxFirstResponseTime), zendeskSubdomain],
      zendeskSecret
    ]
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
      router.push('/view-sla')
    }
  }, [isTxSuccess, isTxLoading, router])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    write!()
  }

  const convertToBigNumber = (value: string) => BigInt(Number(value) * 10 ** 18)

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
              <Select label='Period of contract' defaultValue={30} onChange={e => setPeriod(Number(e.target.value))}>
                {periods.map(period => (
                  <MenuItem key={period.id} value={period.value}>
                    {period.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Fee'
              onChange={e => setFee(convertToBigNumber(e.target.value))}
              placeholder='Fee for the contract'
              defaultValue='0'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Charge Per Violation'
              onChange={e => setChargePerViolation(convertToBigNumber(e.target.value))}
              placeholder='Amount to charge per violation'
              defaultValue='0'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='API to check (eg: https://www.githubstatus.com/api/v2/status.json)'
              onChange={e => setApiToCheck(e.target.value)}
              placeholder='API to check'
              defaultValue=''
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Method (GET/POST)'
              onChange={e => setMethod(e.target.value)}
              placeholder='Method'
              defaultValue=''
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='JSON Path (eg: status.description)'
              onChange={e => setPath(e.target.value)}
              placeholder='Path'
              defaultValue=''
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Expected Value at the path (eg: All Systems Operational)'
              onChange={e => setExpectedValue(e.target.value)}
              placeholder='Expected Value'
              defaultValue=''
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Zendesk Secret (encrypted github gist URL)'
              onChange={e => setZendeskSecret(e.target.value)}
              placeholder='Zendesk Secret'
              defaultValue=''
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Zendesk Max First Response Time (Hours)'
              onChange={e => setZendeskMaxFirstResponseTime(Number(e.target.value))}
              placeholder='Zendesk Max First Response Time (in hours)'
              defaultValue={24}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Zendesk Subdomain (eg: https://wagmi.zendesk.com -> wagmi)'
              onChange={e => setZendeskSubdomain(e.target.value)}
              placeholder='Zendesk Subdomain'
              defaultValue=''
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
