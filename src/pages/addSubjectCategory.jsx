import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addSubjectCategory } from '../services/subjectCategory'



const AddSubjectCategory = () => {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            name,
            description,
            adminId: localStorage.getItem("_id")
        }

        const res = await addSubjectCategory(data)
        if (res.success) {
            toast.success(`Subject Category ${name} has been successfully added`)
            navigate('/')
        }
        else {
            toast.error("Failed to Add Subject Category")
        }

    }


    return (
        <Container className='my-4'>
            <h3>Add Subject Category</h3>
            <hr />

            <Form className='w-50' onSubmit={handleSubmit}>

                <Form.Label>Subject Category Name</Form.Label>
                <Form.Control
                    type="title"
                    placeholder="Ex: Science"
                    className="me-2 mb-4"
                    aria-label="title"
                    onChange={(e) => setName(e.target.value)}
                />

                <Form.Label>Level Description</Form.Label>
                <Form.Control
                    type="title"
                    className="me-2 mb-4"
                    aria-label="title"
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Button type="submit" className='mt-5' onClick={handleSubmit}>Add Subject Category</Button>

            </Form>

        </Container>
    )
}

export default AddSubjectCategory