import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addSubjectCategory, getAllSubjectCategorys } from '../services/subjectCategory'



const AddSubjectCategory = () => {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [subjectCategorys, setSubjectCategorys] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllSubjectCategorys()
            if (res.success)
                setSubjectCategorys(res.data)
            else
                toast.error("Failed To Load Subject Categorys")
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

            <hr />

            <h3>All Levels</h3>
            <Container className='bg-white p-0  mt-4'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjectCategorys.map((category, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>


            </Container>

        </Container>
    )
}

export default AddSubjectCategory