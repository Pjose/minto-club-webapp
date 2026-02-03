import AllApplicationsGrid from "../../../grid/AllApplicationsGrid"
import AllMembersGrid from "../../../grid/AllMembersGrid"
import AllPeopleGrid from "../../../grid/AllPeopleGrid"
import AllUsersGrid from "../../../grid/AllUsersGrid"

const HomePanel = () => {
    return (
        <>
            <div className="activity-panel" style={{ height: '100%' }}>
                <p className="h5 text-black"><strong>Users List</strong></p>
                <AllUsersGrid defaultPageSize={5} />
            </div>
            <div className="activity-panel" style={{ height: '100%' }}>
                <p className="h5 text-danger"><strong>Members List</strong></p>
                <AllMembersGrid defaultPageSize={5} />
            </div>
            <div className="activity-panel" style={{ height: '100%' }}>
                <p className="h5 text-primary"><strong>Applications List</strong></p>
                <AllApplicationsGrid defaultPageSize={5} />
            </div>
            <div className="activity-panel" style={{ height: '100%' }}>
                <p className="h5 text-info"><strong>People List</strong></p>
                <AllPeopleGrid defaultPageSize={5} />
            </div>
        </>
    )
}

export default HomePanel
