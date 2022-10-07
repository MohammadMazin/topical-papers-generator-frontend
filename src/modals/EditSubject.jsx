import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify'
import { editSubject } from '../services/subjects'

const EditSubject = ({ show, handleClose, data, boards, categorys, fetchData }) => {
    const { _id } = data
    const startData = data
    const [name, setName] = useState(data.name)
    const [boardId, setBoardId] = useState(data.boardId)
    const [subjectCategoryId, setSubjectCategoryId] = useState(data.subjectCategoryId)
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e) => {

        if (name === startData.name && boardId === startData.boardId && subjectCategoryId === startData.subjectCategoryId) {
            handleClose()
            return
        }

        e.preventDefault()
        setLoading(true)
        const data = {
            name,
            boardId,
            subjectCategoryId,
            _id,
            adminId: localStorage.getItem("_id")
        }
        const res = await editSubject(data)
        if (res.success) {
            toast.success('Level has been updated')
            fetchData()
            handleClose()
        }
        else
            toast.error('Level could not be updated')
        setLoading(false)

    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Level</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="bg-white mt-4">
                    <Form className='w-50' onSubmit={handleSubmit}>
                        <Form.Label>Subject Name</Form.Label>
                        <Form.Control
                            type="title"
                            placeholder="Ex: Biology"
                            value={name}
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Form.Label>Select Board</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(e) => setBoardId(e.target.value)}>
                            {boards.map((board, index) => {
                                const { _id, name } = board
                                return <option key={_id} selected={_id === data.boardId._id} value={_id}>{name}</option>
                            })
                            }
                        </Form.Select>

                        <Form.Label className='mt-4'>Select Subject Category</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(e) => setSubjectCategoryId(e.target.value)}>
                            {categorys.map((category, index) => {
                                const { _id, name } = category
                                return <option key={_id} selected={_id === data.subjectCategoryId._id} value={_id}>{name}</option>
                            })
                            }
                        </Form.Select>

                        <Button type="submit" className='mt-5' onClick={handleSubmit} disabled={loading}>Edit Subject</Button>

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

export default EditSubject