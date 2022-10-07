import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addQuestionType, getQuestionTypes } from '../services/questionTypes'



const AddQuestionType = () => {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [questionTypes, setQuestionTypes] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {
            const res = await getQuestionTypes()
            if (res.success)
                setQuestionTypes(res.data)
            else
                toast.error('Failed to fetch Question types')
        }

        fetchData()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            name,
            description,
            adminId: localStorage.getItem("_id")
        }


        const res = await addQuestionType(data)
        if (res.success) {
            toast.success(`QuestipnType ${name} has been successfully added`)
            navigate('/')
        }
        else {
            toast.error("Failed to Add Question Type")
        }
    }

    const handleDelete = async (_id) => {
    }


    return (
        <Container className='my-4'>
            <h3>Add Question Type</h3>
            <hr />

            <Form className='w-50' onSubmit={handleSubmit}>

                <Form.Label>Question Type Name</Form.Label>
                <Form.Control
                    type="title"
                    placeholder="Ex: Multiple Choice Questions"
                    className="me-2 mb-4"
                    aria-label="title"
                    onChange={(e) => setName(e.target.value)}
                />

                <Form.Label>Question Type Description</Form.Label>
                <Form.Control
                    type="title"
                    className="me-2 mb-4"
                    aria-label="title"
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Button type="submit">Add Question Type</Button>

            </Form>


            <hr />

            <h3>All Subjects</h3>
            <Container className='bg-white p-0  mt-4'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionTypes.map((qType, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{qType.name}</td>
                                    <td>{qType.description}</td>
                                    <td>
                                        <Container className='p-0 d-flex gap-2'>
                                            <Button variant="warning m-0" onClick={() => handleDelete(qType._id)} disabled={loading}>Edit</Button>
                                            <Button variant="danger m-0" onClick={() => handleDelete(qType._id)} disabled={loading}>Delete</Button>
                                        </Container>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>

        </Container>
    )
}

export default AddQuestionType