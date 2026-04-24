import CreateMember from "../../members/CreateMember"

const CreateMemberPage = () => {
    return (
        <>
            <div className="container mt-5 pt-2">
                <CreateMember />
                {/*
                    <CreateMembership title={'Create Member Application'} headerBgColor={'bg-danger'} cardBorderColor={'border-danger'} />
                */}
            </div>
        </>
    )
}

export default CreateMemberPage
