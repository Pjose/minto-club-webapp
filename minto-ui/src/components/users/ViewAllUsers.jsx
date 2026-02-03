import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import AllUsersGrid from "../grid/AllUsersGrid"

const ViewAllUsers = () => {
    const { isAuthenticated, getUser } = useAuth()
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false)
    let user = getUser()

    useEffect(() => {
        const isUserAdminOrStaff = () => {
            if (user !== null) {
                if ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))
                    return true
                else
                    return false
            }
        }
        setIsAdminOrStaff(isUserAdminOrStaff())
    }, [user])

    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="container my-3 px-0">
                        <AllUsersGrid defaultPageSize={10} />
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
    )
}

export default ViewAllUsers