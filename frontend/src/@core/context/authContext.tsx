// ** React Imports
import { createContext, useState, ReactNode } from 'react'
import { Amplify, Auth } from 'aws-amplify'

export type User = {
  id: string
  email: string
}

export type AuthContextValue = {
  user: User | undefined
  signup: (email: string, password: string) => void
  confirmSignup: (email: string, code: string) => void
  resendSignup: (email: string) => void
  signin: (email: string, password: string) => void
  confirmSignin: (email: string, code: string) => void
  signout: () => void
}

Amplify.configure({
  aws_cognito_region: 'eu-north-1',
  aws_user_pools_id: 'eu-north-1_ly0GEJjCY',
  aws_user_pools_web_client_id: '396um5l5vd6no97e4p3cjg36q7'
})

// ** Create Context
export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  signup: () => null,
  confirmSignup: () => null,
  resendSignup: () => null,
  signin: () => null,
  confirmSignin: () => null,
  signout: () => null
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ** State
  const [user, setUser] = useState<User>()

  const signup = async (email: string, password: string) => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email
        }
      })
    } catch (error) {
      console.log('error signing up:', error)
    }
  }

  const confirmSignup = async (email: string, code: string) => {
    try {
      await Auth.confirmSignUp(email, code)
    } catch (error) {
      console.log('error confirming sign up:', error)
    }
  }

  const resendSignup = async (email: string) => {
    try {
      await Auth.resendSignUp(email)
    } catch (error) {
      console.log('error resending sign up:', error)
    }
  }

  const signin = async (email: string, password: string) => {
    try {
      const result = await Auth.signIn(email, password)
      console.log(result)
    } catch (error) {
      console.log('error signing in:', error)
    }
  }

  const confirmSignin = async (email: string, code: string) => {
    try {
      const result = await Auth.confirmSignIn(email, code)
      console.log(result)
    } catch (error) {
      console.log('error confirming sign in:', error)
    }
  }

  const signout = async () => {
    try {
      await Auth.signOut()
    } catch (error) {
      console.log('error signout:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signup, confirmSignup, resendSignup, signin, confirmSignin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
