import AllPeopleGrid from "../grid/AllPeopleGrid"

const ViewAllPeople = () => {
    return (
        <div className="container mt-3 px-0">
            <AllPeopleGrid defaultPageSize={10} />
        </div>
    )
}

export default ViewAllPeople;