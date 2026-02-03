import AllApplicationsGrid from "../grid/AllApplicationsGrid";

const ViewAllApplications = () => {
    return (
        <div className="container mt-3 px-0">
            <AllApplicationsGrid defaultPageSize={10} />
        </div>
    );
}

export default ViewAllApplications
