import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addLevel } from '../services/levels'



const AddLevel = () => {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [boards, setBoards] = useState([])
    const [boardId, setBoardId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllBoards()
            if (res.success)
                setBoards(res.data)
            else
                toast.error("Failed To Load Boards")
        }

        fetchData()
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


    return (
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

        </Container>
    )
}

export default AddLevel