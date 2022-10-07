import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { editBoard } from '../services/boards'
import { toast } from 'react-toastify'

const EditBoard = ({ show, handleClose, data, setBoards }) => {
    const { _id } = data
    const [name, setName] = useState(data.name)
    const [location, setLocation] = useState(data.location)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            name,
            location,
            _id,
            adminId: localStorage.getItem("_id")
        }
        const res = await editBoard(data)
        if (res.success) {
            toast.success('Board has been updated')
            setBoards(prevBoards => {
                const index = prevBoards.findIndex(board => board._id === _id)
                prevBoards[index].name = name
                prevBoards[index].location = location
                return [...prevBoards]
            })
            handleClose()
        }
        else
            toast.error('Board could not be updated')
        setLoading(false)

    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Board</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Container className="bg-white mt-4">
                    <Form className='w-50' onSubmit={handleSubmit}>
                        <Form.Label>Board Name</Form.Label>
                        <Form.Control
                            type="title"
                            value={name}
                            placeholder="Ex: CIE"
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Form.Label>Board Location</Form.Label>
                        <Form.Control
                            type="title"
                            value={location}
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setLocation(e.target.value)}
                        />

                        <Button type="submit" disabled={loading}>Edit Board</Button>

                    </Form>
                </Container>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditBoard