// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import SLAsTable from 'src/views/view-sla/SLAsTable'

const ViewSLA = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            SLAs
          </Link>
        </Typography>
        <Typography variant='body2'>List of all the SLAs. You can invite consumers.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <SLAsTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ViewSLA
