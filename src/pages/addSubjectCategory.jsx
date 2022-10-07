import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addSubjectCategory, deleteSubjectCategory, getAllSubjectCategorys } from '../services/subjectCategory'
import EditSubjectCategory from '../modals/EditSubjectCategory'



const AddSubjectCategory = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [subjectCategorys, setSubjectCategorys] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
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
        setLoading(true)
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
        setLoading(false)

    }

    const handleShowEdit = (category) => {
        setSelectedCategory(category)
        setShow(true)
    }
    const handleCloseEdit = () => {
        setSelectedCategory(null)
        setShow(false)
    }

    const handleDelete = async (_id) => {
        setLoading(true)

        const data = {
            _id,
            adminId: localStorage.getItem("_id")
        }

        const res = await deleteSubjectCategory(data)
        if (res.success) {
            toast.success("Successfully deleted Subject Category")
            setSubjectCategorys((prevCategorys) => prevCategorys.filter(category => category._id !== _id))
        }
        else {
            toast.error("Failed to delete Subject Category")
        }


        setLoading(false)
    }


    return (
        <>
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

                    <Button type="submit" className='mt-5' onClick={handleSubmit} disabled={loading}>Add Subject Category</Button>

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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectCategorys.map((category, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                        <td>
                                            <Container className='p-0 d-flex gap-2'>
                                                <Button variant="warning m-0" onClick={() => handleShowEdit(category)} disabled={loading}>Edit</Button>
                                                <Button variant="danger m-0" onClick={() => handleDelete(category._id)} disabled={loading}>Delete</Button>
                                            </Container>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>


                </Container>

            </Container>
            {show && <EditSubjectCategory show={show} handleClose={handleCloseEdit} data={selectedCategory} setSubjectCategorys={setSubjectCategorys} />}
        </>

    )
}

export default AddSubjectCategory