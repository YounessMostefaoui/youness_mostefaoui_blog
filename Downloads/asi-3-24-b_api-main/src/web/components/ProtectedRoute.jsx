import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"
import LoadingSpinner from "@/web/components/LoadingSpinner"

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSession()
  const router = useRouter()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!session) {
    router.push("/sign-in")
    
    return null
  }

  return children
}

export default ProtectedRoute
