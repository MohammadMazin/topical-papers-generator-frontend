import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { editBoard } from '../services/boards'
import { toast } from 'react-toastify'
import { editQuestionType } from '../services/questionTypes'

const EditQuestionType = ({ show, handleClose, data, setQuestionTypes }) => {
    const { _id } = data
    const [name, setName] = useState(data.name)
    const [description, setDescription] = useState(data.description)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            name,
            description,
            _id,
            adminId: localStorage.getItem("_id")
        }
        const res = await editQuestionType(data)
        if (res.success) {
            toast.success('Question Type has been updated')
            setQuestionTypes(prevQuestionType => {
                const index = prevQuestionType.findIndex(qType => qType._id === _id)
                prevQuestionType[index].name = name
                prevQuestionType[index].description = description
                return [...prevQuestionType]
            })
            handleClose()
        }
        else
            toast.error('Question Type could not be updated')
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

                        <Form.Label>Question Type Name</Form.Label>
                        <Form.Control
                            type="title"
                            placeholder="Ex: Multiple Choice Questions"
                            value={name}
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Form.Label>Question Type Description</Form.Label>
                        <Form.Control
                            type="title"
                            value={description}
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button type="submit" disabled={loading}>Edit Question Type</Button>

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

export default EditQuestionType