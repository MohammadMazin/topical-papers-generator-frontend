import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getAllSubjects } from '../services/subjects';
import { addTopic, deleteTopic, getAllTopics } from '../services/topics';
import EditTopic from '../modals/EditTopic';



const AddTopic = () => {

    const [name, setName] = useState('')
    const [subjectId, setSubjectId] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [topics, setTopics] = useState([])
    const [show, setShow] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllTopics()
            if (res.success)
                setTopics(res.data)
            else
                toast.error("Failed To Load Boards")
        }

        const fetchSubjects = async () => {
            const res = await getAllSubjects()
            if (res.success)
                setSubjects(res.data)
            else
                toast.error("Failed To Load Boards")
        }

        fetchData()
        fetchSubjects()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            name,
            subjectId,
            adminId: localStorage.getItem("_id")
        }

        const res = await addTopic(data)
        if (res.success) {
            toast.success(`Topic ${name} has been successfully added`)
            navigate('/')
        }
        else {
            toast.error("Failed to Add Topic")
        }

    }

    const handleShowEdit = (topic) => {
        setSelectedTopic(topic)
        setShow(true)
    }
    const handleCloseEdit = () => {
        setSelectedTopic(null)
        setShow(false)
    }

    const handleDelete = async (_id) => {
        setLoading(true)

        const data = {
            _id,
            adminId: localStorage.getItem("_id")
        }

        const res = await deleteTopic(data)
        if (res.success) {
            toast.success("Deleted Topic Successfully")
            setTopics((prevTopics) => prevTopics.filter(topic => topic._id !== _id))

        }

        setLoading(false)
    }

    return (
        <>
            <Container className='my-4'>
                <h3>Add Topic</h3>
                <hr />

                <Form className='w-50' onSubmit={handleSubmit} style={{ minWidth: '300px' }}>

                    <Form.Label>Topic Name</Form.Label>
                    <Form.Control
                        type="title"
                        placeholder="Ex: A levels"
                        className="me-2 mb-4"
                        aria-label="title"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Form.Label>Select Subject</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={(e) => setSubjectId(e.target.value)}>
                        <option value="" disabled selected>Select your Subject</option>
                        {subjects.map((subject, index) => {
                            const { _id, name } = subject
                            return <option key={_id} value={_id}>{name}</option>
                        })
                        }
                    </Form.Select>

                    <Button type="submit" className='mt-5' onClick={handleSubmit}>Add Topic</Button>

                </Form>

                <hr />

                <h3>All Topics</h3>
                <Container className='bg-white p-0  mt-4'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((topic, index) => {
                                const { name, subjectId, _id } = topic
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{name}</td>
                                        <td>{subjectId?.name}</td>
                                        <td>
                                            <Container className='p-0 d-flex gap-2'>
                                                <Button variant="warning m-0" onClick={() => handleShowEdit(topic)} disabled={loading}>Edit</Button>
                                                <Button variant="danger m-0" onClick={() => handleDelete(_id)} disabled={loading}>Delete</Button>
                                            </Container>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>


                </Container>

            </Container>
            {show && <EditTopic show={show} handleClose={handleCloseEdit} data={selectedTopic} setTopics={setTopics} subjects={subjects} />}
        </>

    )
}

export default AddTopic