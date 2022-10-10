import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import { addBoard, deleteBoard, getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import EditBoard from '../modals/EditBoard';

const AddBoard = () => {

    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [boards, setBoards] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedBoard, setSelectedBoard] = useState(null)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {

            const res = await getAllBoards()
            if (res.success) {
                setBoards(res.data)
            }
            else
                toast.error('Failed to fetch all board details')
        }
        fetchData()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            name,
            location,
            adminId: localStorage.getItem("_id")
        }


        const res = await addBoard(data)
        if (res.success) {
            toast.success(`Board ${name} has been successfully added`)
            navigate('/')
        }
        else {
            toast.error("Failed to Add Board")
        }

    }

    const handleDelete = async (_id) => {
        setLoading(true)
        const data = {
            _id,
            adminId: localStorage.getItem('_id')
        }
        const res = await deleteBoard(data)
        if (res.success) {
            toast.success("Board Deleted")
            setBoards((prevBoards) => prevBoards.filter(board => board._id !== _id))

        } else
            toast.error(res.message)
        setLoading(false)
    }

    const handleShowEdit = (board) => {
        setSelectedBoard(board)
        setShow(true)
    }
    const handleCloseEdit = (board) => {
        setSelectedBoard(null)
        setShow(false)
    }


    return (
        <>
            <Container className='my-4'>
                <h3>Add Board</h3>
                <hr />

                <Form className='w-50' onSubmit={handleSubmit} style={{ minWidth: '300px' }}>

                    <Form.Label>Board Name</Form.Label>
                    <Form.Control
                        type="title"
                        placeholder="Ex: CIE"
                        className="me-2 mb-4"
                        aria-label="title"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Form.Label>Board Location</Form.Label>
                    <Form.Control
                        type="title"
                        className="me-2 mb-4"
                        aria-label="title"
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <Button type="submit">Add Board</Button>

                </Form>

                <hr />

                <h3>All Boards</h3>
                <Container className='bg-white p-0  mt-4'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boards.map((board, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{board.name}</td>
                                        <td>{board.location}</td>
                                        <td>
                                            <Container className='p-0 d-flex gap-2'>
                                                <Button variant="warning m-0" onClick={() => handleShowEdit(board)} disabled={loading}>Edit</Button>
                                                <Button variant="danger m-0" onClick={() => handleDelete(board._id)} disabled={loading}>Delete</Button>
                                            </Container>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>

            </Container>
            {show && <EditBoard show={show} handleClose={handleCloseEdit} data={selectedBoard} setBoards={setBoards} />}
        </>

    )
}

export default AddBoard