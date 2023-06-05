// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import ArrowLeft from 'mdi-material-ui/ArrowLeft'

// ** Demo Components Imports
import InvitesTable from 'src/views/view-invite/InvitesTable'

const ViewInvite = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5' style={{ display: 'flex', alignItems: 'center' }}>
          <ArrowLeft style={{ marginRight: 10, cursor: 'pointer' }} onClick={() => window.history.back()} />
          <Link href='https://mui.com/components/tables/' target='_blank'>
            Invites
          </Link>
        </Typography>
        <Typography variant='body2'>List of all the pending invites.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <InvitesTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ViewInvite
