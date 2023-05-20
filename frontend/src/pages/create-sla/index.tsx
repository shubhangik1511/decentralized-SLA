// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import SLAForm from 'src/views/create-sla/sla-form'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const CreateSLA = () => {
  return (
    <Grid container spacing={7}>
      <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
        <SLAForm />
      </Grid>
    </Grid>
  )
}

export default CreateSLA
