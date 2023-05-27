// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import InvitesTable from 'src/views/view-invite/InvitesTable'

const ViewInvite = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            Invites
          </Link>
        </Typography>
        <Typography variant='body2'>List of all the pending invites.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Basic Table' titleTypographyProps={{ variant: 'h6' }} />
          <InvitesTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ViewInvite
