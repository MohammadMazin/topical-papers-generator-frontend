import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import { getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addLevel, deleteLevel, getAllLevels } from '../services/levels'
import EditLevel from '../modals/EditLevel';



const AddLevel = () => {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [boards, setBoards] = useState([])
    const [boardId, setBoardId] = useState(null)
    const [levels, setLevels] = useState([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllBoards()
            if (res.success)
                setBoards(res.data)
            else
                toast.error("Failed To Load Boards")
        }

        const fetchLevels = async () => {
            const res = await getAllLevels()
            if (res.success)
                setLevels(res.data)
            else
                toast.error("Failed To Load Levels")
        }
        fetchData()
        fetchLevels()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            name,
            description,
            boardId,
            adminId: localStorage.getItem("_id")
        }

        const res = await addLevel(data)
        if (res.success) {
            toast.success(`Level ${name} has been successfully added`)
            navigate('/')
        }
        else {
            toast.error("Failed to Add Level")
        }

    }

    const handleShowEdit = (level) => {
        setSelectedLevel(level)
        setShow(true)
    }
    const handleCloseEdit = (level) => {
        setSelectedLevel(null)
        setShow(false)
    }

    const handleDelete = async (_id) => {
        setLoading(true)
        const data = {
            _id,
            adminId: localStorage.getItem("_id")
        }
        const res = await deleteLevel(data)
        if (res.success) {
            toast.success("Level deleted")
            setLevels((prevLevels) => prevLevels.filter(level => level._id !== _id))

        } else
            toast.erro("Could not delete level")

        setLoading(false)
    }

    return (
        <>
            <Container className='my-4'>
                <h3>Add Level</h3>
                <hr />

                <Form className='w-50' onSubmit={handleSubmit}>

                    <Form.Label>Level Name</Form.Label>
                    <Form.Control
                        type="title"
                        placeholder="Ex: A levels"
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

                    <Form.Label>Select Board</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={(e) => setBoardId(e.target.value)}>
                        <option value="" disabled selected>Select your Board</option>
                        {boards.map((board, index) => {
                            const { _id, name } = board
                            return <option key={_id} value={_id}>{name}</option>
                        })
                        }
                    </Form.Select>

                    <Button type="submit" className='mt-5' onClick={handleSubmit}>Add Level</Button>

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
                                <th>Board</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.map((level, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{level.name}</td>
                                        <td>{level.description}</td>
                                        <td>{level.boardId.name}</td>
                                        <Container className='p-0 d-flex gap-2'>
                                            <Button variant="warning m-0" onClick={() => handleShowEdit(level)} disabled={loading}>Edit</Button>
                                            <Button variant="danger m-0" onClick={() => handleDelete(level._id)} disabled={loading}>Delete</Button>
                                        </Container>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>


                </Container>

            </Container>
            {show && <EditLevel show={show} handleClose={handleCloseEdit} setLevels={setLevels} data={selectedLevel} boards={boards} />}
        </>

    )
}

export default AddLevel