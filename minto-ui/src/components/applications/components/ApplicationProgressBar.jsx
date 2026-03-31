import { ProgressBar } from "react-bootstrap";
import PropTypes from 'prop-types';

const ApplicationProgressBar = (props) => {
    const { steps, currentStep } = props

    return (
        <>
            <div className="container pt-2 mb-8 position-sticky bg-white"  style={{ top: '129px', zIndex: 100, borderBottom: '1px solid #dee2e6' }}>
                <div className="row mb-2">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <>
                                {/* Highlight current and completed steps with a different background color and border */}
                                <div key={index} className={`col d-flex px-0 px-md-2 justify-content-center
                                    ${(currentStep) >= step.number
                                        ? 'fw-bold border border-3 border-primary rounded'
                                        : ''
                                    }
                                    `}
                                    style={{ 
                                        backgroundColor: (currentStep) >= step.number ? '#d5f3ff' : '',
                                        transition: 'background-color 0.3s, border-color 0.3s', 
                                        }}
                                >
                                    <div className="d-flex flex-column mb-1">
                                        <div className="d-flex justify-content-center">
                                            <div className={`rounded-circle mt-1 p-2
                                                ${(currentStep) >= step.number
                                                    ? 'shadow-lg bg-primary text-white'
                                                    : 'bg-secondary text-white'
                                                }
                                                `}>
                                                <IconComponent size={20}/>
                                            </div>
                                        </div>
                                        <div className="d-none d-md-flex text-center">
                                            <p className="small mb-0">{step.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
                <div className="row mb-0">
                    <ProgressBar
                        now={`${((currentStep) / steps.length) * 100}`} 
                        label={`Step ${currentStep}`} 
                        className='bg-white p-0' />
                </div>
                <div className="row mb-4">
                    <div className="col text-center">
                        <span className="small mb-0 fw-bold">Step {currentStep} of {steps.length}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

ApplicationProgressBar.propTypes = {
    steps: PropTypes.array,
    currentStep: PropTypes.number,
}

export default ApplicationProgressBar;