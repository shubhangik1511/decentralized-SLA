// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'

// ** Demo Components Imports
import InviteForm from 'src/views/invite-consumer/invite-form'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const InviteConsumer = () => {
  return (
    <Grid container spacing={7}>
      <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
        <Card>
          {' '}
          <CardHeader title='Invite Consumer' titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ marginTop: 0, marginBottom: 5 }} />
          <CardContent>
            <InviteForm />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InviteConsumer
