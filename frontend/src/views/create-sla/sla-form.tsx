// ** React Imports
import { useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const SLAForm = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState<boolean>(true)

  return (
    <form>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label='Username' placeholder='johnDoe' defaultValue='johnDoe' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label='Name' placeholder='John Doe' defaultValue='John Doe' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type='email'
            label='Email'
            placeholder='johnDoe@example.com'
            defaultValue='johnDoe@example.com'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select label='Role' defaultValue='admin'>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='author'>Author</MenuItem>
              <MenuItem value='editor'>Editor</MenuItem>
              <MenuItem value='maintainer'>Maintainer</MenuItem>
              <MenuItem value='subscriber'>Subscriber</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select label='Status' defaultValue='active'>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
              <MenuItem value='pending'>Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label='Company' placeholder='ABC Pvt. Ltd.' defaultValue='ABC Pvt. Ltd.' />
        </Grid>

        {openAlert ? (
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Alert
              severity='warning'
              sx={{ '& a': { fontWeight: 400 } }}
              action={
                <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                  <Close fontSize='inherit' />
                </IconButton>
              }
            >
              <AlertTitle>Your email is not confirmed. Please check your inbox.</AlertTitle>
              <Link href='/' onClick={(e: SyntheticEvent) => e.preventDefault()}>
                Resend Confirmation
              </Link>
            </Alert>
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <Button variant='contained'>Create</Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default SLAForm
