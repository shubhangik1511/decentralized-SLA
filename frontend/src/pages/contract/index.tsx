import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import Button from '@mui/material/Button'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import { useContractReads, useAccount } from 'wagmi'
import slaAbi from 'src/@core/abi/SlaAbi.json'
import { useRouter } from 'next/router'

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const SLA = () => {
  const [sla, setSla] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [executionStart, setExecutionStart] = useState<string>('')
  const [totalFees, setTotalFees] = useState<string>('')
  const [claimableAmount, setClaimableAmount] = useState<string>('')
  const [chargePerViolation, setChargePerViolation] = useState<string>('')
  const [uptimeViolations, setUptimeViolations] = useState<string>('')
  const [firstResponseTimeViolations, setFirstResponseTimeViolations] = useState<string>('')

  const router = useRouter()
  const { address } = useAccount()

  useEffect(() => {
    if (Object.keys(router.query).length >= 1) {
      const sla = router.query['sla']
      if (sla) setSla((sla as string).trim())
    }
  }, [router])

  const { data, isError, error, isLoading } = useContractReads({
    contracts: [
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'name'
      },
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'periodInDays'
      },
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'consumersMap',
        args: [address]
      },
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'getTotalFees'
      },
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'getClaimableFees',
        args: [address, address]
      },
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'chargePerViolation'
      },
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'uptimeViolationsCountMap',
        args: [address]
      },
      {
        address: sla as `0x${string}`,
        abi: slaAbi,
        functionName: 'firstResponseTimeViolationsCountMap',
        args: [address]
      }
    ]
  })

  useEffect(() => {
    if (data && !isLoading && !isError) {
      console.log(data)
      setName(data[0]?.result as string)
      setDuration(data[1]?.result as string)
      setExecutionStart(data[2]?.result[6] as string)
      setTotalFees(data[3]?.result as string)
      setClaimableAmount(data[4]?.result as string)
      setChargePerViolation(data[5]?.result as string)
      setUptimeViolations(data[6]?.result as string)
      setFirstResponseTimeViolations(data[7]?.result as string)
    }
  }, [data, executionStart, isError, isLoading])

  if (isLoading) return <CircularProgress />

  return (
    <Grid container spacing={7}>
      <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
        <Card>
          {data && isError && JSON.stringify(error)}
          {data && !isError && !isLoading && (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
                  <Typography variant='h6' style={{ display: 'flex', alignItems: 'center', marginBottom: 2.5 }}>
                    <ArrowLeft
                      style={{ marginRight: 10, cursor: 'pointer' }}
                      onClick={() => {
                        window.history.back()
                      }}
                    />
                    {name}
                    <Button variant='outlined' size='medium' style={{ marginLeft: 'auto' }}>
                      Claim
                    </Button>
                  </Typography>
                  <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <StyledBox>
                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='body2' sx={{ marginRight: 2.75 }}>
                            Execution Start Date:
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'primary.main' }}>
                            {new Date(Number(executionStart) * 1000).toUTCString()}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='body2' sx={{ marginRight: 2.75 }}>
                            Duration:
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'primary.main' }}>
                            {Number(duration)} days
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='body2' sx={{ marginRight: 2.75 }}>
                            Total Fees:
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'primary.main' }}>
                            {Number(totalFees) / 10 ** 18} MATIC
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='body2' sx={{ marginRight: 2.75 }}>
                            Claimable Amount:
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'primary.main' }}>
                            {Number(claimableAmount)} MATIC
                          </Typography>
                        </Box>
                      </StyledBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledBox>
                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='body2' sx={{ marginRight: 2.75 }}>
                            Charge Per Violation:
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'primary.main' }}>
                            {Number(chargePerViolation) / 10 ** 18} MATIC
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='body2' sx={{ marginRight: 2.75 }}>
                            Uptime violations Count:
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'primary.main' }}>
                            {Number(uptimeViolations)}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='body2' sx={{ marginRight: 2.75 }}>
                            First Response Time violations Count:
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'primary.main' }}>
                            {Number(firstResponseTimeViolations)}
                          </Typography>
                        </Box>
                      </StyledBox>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>
            </Grid>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default SLA
