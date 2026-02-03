import PropTypes from 'prop-types'
import { AgGridReact } from "ag-grid-react"
import { useEffect, useMemo, useState } from "react"
import useFetch from "../hooks/useFetch"
import { useAuth } from "../hooks/useAuth"
import { toast } from "sonner"
import LoadingSpinner from "../loading/LoadingSpinner"

const AllUsersGrid = (props) => {
    const { defaultPageSize } = props
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const [rowData, setRowData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const token = user.accessToken
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/users", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewAllUsers] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
            
                    const usersData = await response.json()
                    setRowData(usersData)
                    toast.success('Users loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch (error) {
                console.log('[ERROR]:- '+ error)
                toast.error('Error loading users. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }
        
        loadUsers()
    }, [user, fetchWithAuth])

    // Filter out admin users
    // const nonAdminUsers = rowData.filter(user => user.role !== 'ADMIN')
    // Filter out admin and staff users
    const nonAdminUsers = rowData.filter(user => (user.role !== 'ADMIN' && user.role !== 'STAFF'))

    const columnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: 'Id', filter: true, floatingFilter: true },
            { field: 'firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'email', headerName: 'Email', filter: true, floatingFilter: true },
            { field: 'role', headerName: 'Role', filter: true, floatingFilter: true },
            { field: 'source', headerName: 'Reg Source', filter: true, floatingFilter: true },
            { field: 'createdAt', headerName: 'Created At', filter: true, floatingFilter: true },
            { field: 'updatedAt', headerName: 'Updated At', filter: true, floatingFilter: true },
        ]
    }, [])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 105,
        columnLimits: [
            {
                colId: 'email',
                minWidth: 220
            },
            {
                colId: 'createdAt',
                minWidth: 170
            },
            {
                colId: 'updatedAt',
                minWidth: 170
            },
        ]
    }

  return (
    <>
        {
            isLoading ? (
                <LoadingSpinner caption={'View all users'} clsTextColor={"text-black"} />
            ) : (
                isAuthenticated ? (
                    <div className='card mx-auto my-3 border border-dark shadow' style={{height: '100%'}} >
                        <div className='card-header text-white bg-dark'>
                            <h3>List of Users</h3>
                        </div>
                        <div className='card-body'>
                            <h5 className='text-center'>User Details</h5>
                            <div className="ag-theme-quartz" style={{ width: '100%' }} >
                                { 
                                    user && (user.decoded.role === 'Admin') ? (
                                        <AgGridReact 
                                            domLayout='autoHeight'
                                            autoSizeStrategy={autoSizeStrategy}
                                            rowData={rowData}
                                            columnDefs={columnDefs}
                                            pagination={true}
                                            paginationPageSize={defaultPageSize}
                                            paginationPageSizeSelector={[defaultPageSize, 20, 50]}
                                        />
                                    ) : (
                                        <AgGridReact 
                                            autoSizeStrategy={autoSizeStrategy}
                                            rowData={nonAdminUsers}
                                            columnDefs={columnDefs}
                                            pagination={true}
                                            paginationPageSize={defaultPageSize}
                                            paginationPageSizeSelector={[defaultPageSize, 20, 50]}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-center text-primary">Unauthorized</h3>
                    </div>
                )
            ) 
        }
    </>
  )
}

AllUsersGrid.propTypes = {
    defaultPageSize: PropTypes.number,
}

export default AllUsersGrid