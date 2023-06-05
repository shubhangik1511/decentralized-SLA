// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import ContractsTable from 'src/views/view-contracts/ContractsTable'

const Contracts = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            Contracts
          </Link>
        </Typography>
        <Typography variant='body2'>List of all the contracts.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ContractsTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Contracts
