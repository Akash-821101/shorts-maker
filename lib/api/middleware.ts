import { auth } from '@clerk/nextjs/server'
import { apiError } from './respond'

type AuthSuccess = { userId: string }
type AuthFailure = Response

export async function requireAuth(): Promise<AuthSuccess | AuthFailure> {
  const { userId } = await auth()
  if (!userId) return apiError('Unauthorized', 401)
  return { userId }
}
