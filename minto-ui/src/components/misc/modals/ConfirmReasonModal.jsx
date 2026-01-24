import PropTypes from 'prop-types'
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ConfirmReasonModal = (props) => {
    const { showReason, onConfirmReason, onCancelReason } = props
    const MAX_LIMIT = 1000;
    const [comment, setComment] = useState('');

    const handleConfirm = () => {
        onConfirmReason(comment); // Send comment to parent
        setComment(''); // Clear input
    };

    return (
        <Modal show={showReason} onHide={onCancelReason}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure? Please add a summary reason:</p>
                <Form.Control
                    as="textarea"
                    rows={5}
                    maxLength={MAX_LIMIT}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter reason..."
                />
                <Form.Text muted>
                    {`${comment.length} / ${MAX_LIMIT} characters`}
                </Form.Text>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancelReason}>Cancel</Button>
                <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}

ConfirmReasonModal.propTypes = {
    showReason: PropTypes.bool,
    message: PropTypes.string,
    onConfirmReason: PropTypes.func,
    onCancelReason: PropTypes.func,
}

export default ConfirmReasonModal;