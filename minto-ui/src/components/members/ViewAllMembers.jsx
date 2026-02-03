import AllMembersGrid from '../grid/AllMembersGrid';

const ViewAllMembers = () => {
    return (
        <div className="container mt-3 px-0">
            <AllMembersGrid defaultPageSize={10} />
        </div>
    );
}

export default ViewAllMembers
