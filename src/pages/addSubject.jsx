import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addLevel } from '../services/levels'
import { getAllSubjectCategorys } from '../services/subjectCategory'
import { addSubject, deleteSubject, getAllSubjects } from '../services/subjects'
import EditSubject from '../modals/EditSubject'



const AddSubject = () => {

    const [name, setName] = useState('')
    const [boards, setBoards] = useState([])
    const [categorys, setCategorys] = useState([])
    const [boardId, setBoardId] = useState(null)
    const [subjectCategoryId, setSubjectCategoryId] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [show, setShow] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

        fetchData()
    }, [])

    const fetchData = async () => {
        const resBoards = await getAllBoards()
        if (resBoards.success)
            setBoards(resBoards.data)
        else
            toast.error("Failed To Load Boards")

        const resCategorys = await getAllSubjectCategorys()
        if (resCategorys.success)
            setCategorys(resCategorys.data)
        else
            toast.error("Failed To Load Subject Categorys")

        const resSubjects = await getAllSubjects()
        if (resSubjects.success)
            setSubjects(resSubjects.data)
        else
            toast.error("Failed To Load Subjects")
    }


    const handleSubmit = async e => {
        e.preventDefault()

        setLoading(true)
        const data = {
            name,
            boardId,
            subjectCategoryId,
            adminId: localStorage.getItem("_id")
        }

        const res = await addSubject(data)
        if (res.success) {
            toast.success(`Subject ${name} has been successfully added`)
            navigate('/')
        }
        else {
            toast.error("Failed to Add Level")
        }

        setLoading(false)
    }

    const handleDelete = async (_id) => {
        setLoading(true)
        const data = {
            _id,
            adminId: localStorage.getItem("_id")
        }
        const res = await deleteSubject(data)
        if (res.success) {
            toast.success("Subject Deleted")
            setSubjects((prevSubjects) => prevSubjects.filter(subject => subject._id !== _id))
        }
        else
            toast.error("Failed to deletes subject")
        setLoading(false)
    }

    const handleShowEdit = (subject) => {
        setShow(true)
        setSelectedSubject(subject)
    }
    const handleCloseEdit = () => {
        setShow(false)
        setSelectedSubject(null)
    }


    return (
        <>
            <Container className='my-4'>
                <h3>Add Subject</h3>
                <hr />

                <Form className='w-50' onSubmit={handleSubmit}>
                    <Form.Label>Subject Name</Form.Label>
                    <Form.Control
                        type="title"
                        placeholder="Ex: Biology"
                        className="me-2 mb-4"
                        aria-label="title"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Form.Label>Select Board</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={(e) => setBoardId(e.target.value)}>
                        <option value="" disabled selected>Select your Board</option>
                        {boards.map((board, index) => {
                            const { _id, name } = board
                            return <option key={_id} value={_id}>{name}</option>
                        })
                        }
                    </Form.Select>

                    <Form.Label className='mt-4'>Select Subject Category</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={(e) => setSubjectCategoryId(e.target.value)}>
                        <option value="" disabled selected>Select your Subject Category</option>
                        {categorys.map((category, index) => {
                            const { _id, name } = category
                            return <option key={_id} value={_id}>{name}</option>
                        })
                        }
                    </Form.Select>
                    <Button type="submit" className='mt-5' onClick={handleSubmit}>Add Subject</Button>
                </Form>

                <hr />

                <h3>All Subjects</h3>
                <Container className='bg-white p-0  mt-4'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Board</th>
                                <th>Subject Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => {
                                const { name, boardId, subjectCategoryId, _id } = subject
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{name}</td>
                                        <td>{boardId.name}</td>
                                        <td>{subjectCategoryId.name}</td>
                                        <td>
                                            <Container className='p-0 d-flex gap-2'>
                                                <Button variant="warning m-0" onClick={() => handleShowEdit(subject)} disabled={loading}>Edit</Button>
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
            {show && <EditSubject show={show} handleClose={handleCloseEdit} data={selectedSubject} boards={boards} categorys={categorys} fetchData={fetchData} />}
        </>

    )
}

export default AddSubject