import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify'
import { editSubjectCategory } from '../services/subjectCategory'

const EditSubjectCategory = ({ show, handleClose, data, setSubjectCategorys }) => {
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
        const res = await editSubjectCategory(data)
        if (res.success) {
            toast.success('Subject Category has been updated')
            setSubjectCategorys(prevCategorys => {
                const index = prevCategorys.findIndex(category => category._id === _id)
                prevCategorys[index].name = name
                prevCategorys[index].description = description
                return [...prevCategorys]
            })
            handleClose()
        }
        else
            toast.error('Subject Category could not be updated')
        setLoading(false)

    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Subject Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Container className="bg-white mt-4">
                    <Form className='w-50' onSubmit={handleSubmit}>

                        <Form.Label>Subject Category Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Ex: Science"
                            value={name}
                            className="me-2 mb-4"
                            aria-label="name"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Form.Label>Level Description</Form.Label>
                        <Form.Control
                            type="name"
                            className="me-2 mb-4"
                            value={description}
                            aria-label="name"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <Button type="submit" className='mt-3' onClick={handleSubmit} disabled={loading}>Edit Subject Category</Button>

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

export default EditSubjectCategory