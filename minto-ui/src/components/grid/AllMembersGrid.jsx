import PropTypes from 'prop-types'
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import { toast } from "sonner";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";

const AllMembersGrid = (props) => {
    const { defaultPageSize } = props
    const { fetchWithAuth } = useFetch()
    const { getUser, isAuthenticated } = useAuth()
    const [rowData, setRowData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    let user = getUser()

    useEffect(() => {
        const loadMembers = async () => {
            setIsLoading(true);
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/members/dto", {
                        method: 'GET',
                        credentials: 'include',
                    })
                    
                    if (!response.ok) {
                        console.log("[MemberGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok')
                    }

                    const membersData = await response.json()
                    //console.log(membersData)
                    setRowData(membersData)
                    toast.success('Members loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
                        
            } catch(error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        loadMembers()
    }, [user, fetchWithAuth])

    

    const columnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: ' Member Id', filter: true, floatingFilter: true },
            { field: 'membershipNumber', headerName: ' Membership No.', filter: true, floatingFilter: true },
            { field: 'application.person.firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'application.person.middleName', headerName: 'Middle Name', filter: true, floatingFilter: true },
            { field: 'application.person.lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'application.person.dob', headerName: 'DOB', filter: true, floatingFilter: true },
            { field: 'status', headerName: 'Status', filter: true, floatingFilter: true },
            { field: 'memberCreatedAt', headerName: 'Created At', filter: true, floatingFilter: true },
            { field: 'memberUpdatedAt', headerName: 'Updated At', filter: true, floatingFilter: true },
        ]
    }, [])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 100,
        columnLimits: [
            {
                colId: 'membershipNumber',
                minWidth: 170
            },
            {
                colId: 'memberCreatedAt',
                minWidth: 160
            },
            {
                colId: 'memberUpdatedAt',
                minWidth: 160
            },
        ]
    }

    return (
        <div className="container mt-3 px-0">
            {
                isLoading ? (
                    <LoadingSpinner caption={'Members List'} clsTextColor={"text-danger"} />
                ) : (
                    isAuthenticated ? (
                        <div className='card mx-auto my-2 border shadow' style={{height: '100%'}} >
                            <div className='card-header text-white bg-danger'>
                                <h3>List of All Members</h3>
                            </div> 
                            <div className='card-body'>
                                <h5 className='text-center'>Member Details</h5>
                                <div className="ag-theme-quartz" style={{ width: '100%' }} >
                                    <AgGridReact
                                        domLayout='autoHeight'
                                        autoSizeStrategy={autoSizeStrategy}
                                        rowData={rowData}
                                        columnDefs={columnDefs}
                                        pagination={true}
                                        paginationPageSize={defaultPageSize}
                                        paginationPageSizeSelector={[defaultPageSize, 20, 50]}
                                    />
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
        </div>
    );
}

AllMembersGrid.propTypes = {
    defaultPageSize: PropTypes.number,
}

export default AllMembersGrid