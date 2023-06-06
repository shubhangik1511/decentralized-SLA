// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** MUI Components
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

import { Web3Button } from '@web3modal/react'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  left: 0,
  bottom: '5rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: 0
  }
}))

const HomePage = () => {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push('/create-sla')
    }
  }, [isConnected, router])

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>Decentralized SLA Platform</Typography>
        </BoxWrapper>
        <Img height='487' alt='error-illustration' src='/images/pages/404.png' />
        <Typography variant='h5' sx={{ mb: 4, fontSize: '1.5rem !important' }}>
          Click on below button to get started!
        </Typography>
        <Web3Button />
      </Box>
      <FooterIllustrations image={<TreeIllustration alt='tree' src='/images/pages/tree.png' />} />
    </Box>
  )
}

HomePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default HomePage
