import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

const Page = () => {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard')
    }
    router.push('/home')
  }, [isConnected, router])

  return <></>
}

export default Page
