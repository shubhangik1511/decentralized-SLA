// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'

// ** Demo Components Imports
import SLAForm from 'src/views/create-sla/sla-form'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const CreateSLA = () => {
  return (
    <Grid container spacing={7}>
      <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
        <Card>
          {' '}
          <CardHeader title='Create New SLA' titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ marginTop: 0, marginBottom: 5 }} />
          <CardContent>
            <SLAForm />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CreateSLA
