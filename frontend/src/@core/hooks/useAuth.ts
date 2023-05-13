import { useContext } from 'react'
import { AuthContext, AuthContextValue } from 'src/@core/context/authContext'

export const useAuth = (): AuthContextValue => useContext(AuthContext)
