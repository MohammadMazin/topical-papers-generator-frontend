import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify'
import { editLevel } from '../services/levels'

const EditLevel = ({ show, handleClose, data, setLevels, boards }) => {
    const { _id } = data
    const startData = data
    const [name, setName] = useState(data.name)
    const [description, setDescription] = useState(data.description)
    const [boardId, setBoardId] = useState(data.boardId)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {

        if (name === startData.name && description === startData.description && boardId === startData.boardId) {
            handleClose()
            return
        }

        e.preventDefault()
        setLoading(true)
        const data = {
            name,
            description,
            boardId,
            _id,
            adminId: localStorage.getItem("_id")
        }
        const res = await editLevel(data)
        if (res.success) {
            toast.success('Level has been updated')
            setLevels(prevLevels => {
                const index = prevLevels.findIndex(level => level._id === _id)
                prevLevels[index].name = name
                prevLevels[index].description = description
                const boardIndex = boards.findIndex(board => board._id === boardId)
                prevLevels[index].boardId._id = boardId
                prevLevels[index].boardId.name = boards[boardIndex].name
                return [...prevLevels]
            })
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

                        <Form.Label>Level Name</Form.Label>
                        <Form.Control
                            type="title"
                            placeholder="Ex: A levels"
                            value={name}
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Form.Label>Level Description</Form.Label>
                        <Form.Control
                            type="title"
                            value={description}
                            className="me-2 mb-4"
                            aria-label="title"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <Form.Label>Select Board</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(e) => setBoardId(e.target.value)}>
                            {boards.map((board, index) => {
                                const { _id, name } = board
                                return <option selected={_id === data.boardId._id} key={_id} value={_id}>{name}</option>
                            })
                            }
                        </Form.Select>

                        <Button type="submit" className='mt-5' onClick={handleSubmit} disabled={loading}>Edit Level</Button>

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

export default EditLevel