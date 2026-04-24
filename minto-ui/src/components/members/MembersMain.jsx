import { Suspense, useState } from "react"
import LoadingSpinner from "../loading/LoadingSpinner"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import EditMember from "./EditMember"
import ProcessMembers from "./ProcessMembers"
import CreateMember from "./CreateMember"

const MembersMain = () => {
    const [radioValue, setRadioValue] = useState('1')
            
    const memberRadios = [
        { name: 'Search/ Edit', value: '1' },
        { name: 'Create Member', value: '2' },
        { name: 'Process Members', value: '3'},
    ]

    const renderComponent = () => {
        switch(radioValue) {
            case '1':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Search/Edit Member'} clsTextColor={"text-danger"} />}>
                        <EditMember />
                    </Suspense>
                )
            case '2':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Create Member'} clsTextColor={"text-danger"} />}>
                        <CreateMember />
                    </Suspense>
                )
            case '3':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Process Members'} clsTextColor={"text-danger"} />}>
                        <ProcessMembers />
                    </Suspense>
                )
            default:
                return <div className="mt-5 text-center text-danger"><h2>Not Found</h2></div>
        }
    }

    return (
        <div className="mb-3">
            <Suspense fallback={<LoadingSpinner caption={'Members'} clsTextColor={"text-danger"} />}>
                <div className="">
                    <h2 className="text-center text-danger mb-2">MEMBERS</h2>
                    <ButtonGroup className='border shadow'>
                        {memberRadios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-mbr-${idx}`}
                                type="radio"
                                variant={'outline-danger'}
                                name={`radio-mbr-${idx}`}
                                value={radio.value}
                                checked={radioValue === radio.value}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                    {renderComponent()}
                </div>
            </Suspense>
        </div>
    )
}

export default MembersMain
