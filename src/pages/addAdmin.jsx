import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { createAdmin } from '../services/user'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AddAdmin = () => {

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async () => {
        const data = {
            name,
            username,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            adminId: localStorage.getItem["_id"]
        }

        const res = await createAdmin(data)
        if (res.success) {
            toast.success("New Admin has been added to the database")
            navigate('/')
        } else {
            toast.error("Failed to create admin")
            toast.error(res.message)
        }

    }

    return (
        <Container className='my-4'>
            <h1>Create New Admin</h1>
            <hr />
            <Form className='w-75' onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Full Name" required={true} onChange={e => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter Username" required={true} onChange={e => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required={true} onChange={e => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required={true} onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" placeholder="Enter Phone Number" onChange={e => setPhoneNumber(e.target.value)} required={true} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" placeholder="dd/mm/yyyy" required={true} onChange={e => setDateOfBirth(e.target.value)} />
                </Form.Group>


                <Button variant="primary" type="submit" className='w-100' onClick={handleSubmit}>
                    Create Admin
                </Button>
            </Form>
        </Container>
    )
}

export default AddAdmin