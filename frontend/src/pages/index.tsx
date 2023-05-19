import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

const Page = () => {
  const { address } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (address) {
      router.push('/dashboard')
    }
    router.push('/home')
  }, [address, router])

  return <></>
}

export default Page
