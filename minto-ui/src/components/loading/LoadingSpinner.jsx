import { Spinner } from "react-bootstrap"
import PropTypes from 'prop-types'

const LoadingSpinner = (props) => {
    const { caption, clsTextColor } = props

    return (
        <>
            <div className="container mt-5 pt-4">
                <div className={`${clsTextColor}`} style={s.loadingScreen}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <h6 className={clsTextColor}>Loading {caption}...</h6>
                </div>
            </div>
        </>
    )
}

LoadingSpinner.propTypes = {
    caption: PropTypes.string,
    clsTextColor: PropTypes.string,
}

const s = {
    loadingScreen: { minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', color:'#6b7280' },
    spinner: { width:'40px', height:'40px', border:'4px solid #e5e7eb', borderTop:'4px solid #667eea', borderRadius:'50%', animation:'spin 1s linear infinite' },
}

export default LoadingSpinner
