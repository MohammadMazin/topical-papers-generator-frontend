import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify'
import { editTopic } from '../services/topics'

const EditTopic = ({ show, handleClose, data, setTopics, subjects }) => {
    console.log(data)
    const { _id } = data
    const startData = data
    const [name, setName] = useState(data.name)
    const [subjectId, setSubjectId] = useState(data.subjectId._id)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (name === startData.name && subjectId === startData.subjectId) {
            handleClose()
            return
        }

        setLoading(true)
        const data = {
            name,
            subjectId,
            _id,
            adminId: localStorage.getItem("_id")
        }

        const res = await editTopic(data)
        if (res.success) {
            toast.success('Subject has been updated')
            setTopics(prevTopics => {
                const index = prevTopics.findIndex(level => level._id === _id)
                prevTopics[index].name = name
                const subjectIndex = subjects.findIndex(subject => subject._id === subjectId)
                prevTopics[index].subjectId._id = subjectId
                prevTopics[index].subjectId.name = subjects[subjectIndex].name
                return [...prevTopics]
            })
            handleClose()
        }
        else
            toast.error('Subject could not be updated')
        setLoading(false)

    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Subject</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Container className="bg-white mt-4">
                    <Form className='w-50' onSubmit={handleSubmit}>

                        <Form.Label>Topic Name</Form.Label>
                        <Form.Control
                            type="title"
                            value={name}
                            placeholder="Ex: A levels"
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Form.Label>Select Subject</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(e) => setSubjectId(e.target.value)}>
                            {subjects.map((subject, index) => {
                                const { _id, name } = subject
                                return <option key={_id} selected={_id === startData.subjectId._id} value={_id}>{name}</option>
                            })
                            }
                        </Form.Select>

                        <Button type="submit" className='mt-5' onClick={handleSubmit} disabled={loading}>Edit Topic</Button>

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

export default EditTopic