import { useMemo } from 'react'
import { selectCurrentUser, selectToken } from '../redux'
import { useTypedSelector } from '.'

export const useAuth = () => {
  const user = useTypedSelector(selectCurrentUser)
  return useMemo(() => ({ user }), [user])
}

export const useToken = () => {
  const token = useTypedSelector(selectToken)
  return useMemo(() => ({ token }), [token])
}
