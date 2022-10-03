import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import { addBoard, getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'



const AddBoard = () => {

    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [boards, setBoards] = useState([])
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


    return (
        <Container className='my-4'>
            <h3>Add Board</h3>
            <hr />

            <Form className='w-50' onSubmit={handleSubmit}>

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
                        </tr>
                    </thead>
                    <tbody>
                        {boards.map((board, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{board.name}</td>
                                    <td>{board.location}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>

        </Container>
    )
}

export default AddBoard