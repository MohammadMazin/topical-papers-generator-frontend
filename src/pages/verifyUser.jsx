import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import UserContext from '../globals/user-data'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
import { approveUser, getUnverifiedUsers, unapproveUser } from '../services/user'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom'

const VerifyUser = () => {

    const [unverifiedUsers, setUnverifiedUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await getUnverifiedUsers()
        if (res.success) {
            setUnverifiedUsers(res.data)
        }
        else {
            toast.error('Failed to fetch users data')
        }
    }

    const handleApprove = async (_id) => {
        setLoading(true)

        const data = {
            _id,
            adminId: localStorage.getItem("_id")
        }

        const res = await approveUser(data)
        if (res.success) {
            toast.success('User has been approved')
            fetchData()
        }
        else
            toast.success('Failed to approve user!')
        setLoading(false)
    }

    const handleDelete = async (_id) => {
        setLoading(true)

        const data = {
            _id,
            adminId: localStorage.getItem("_id")
        }

        const res = await unapproveUser(data)
        if (res.success) {
            toast.success('User has been unapproved')
            fetchData()
        }
        else
            toast.success('Failed to unapprove user!')
        setLoading(false)
    }

    return (
        <Container className='p-0'>
            <h1>Verify Users</h1>
            <hr />
            {
                unverifiedUsers.length === 0 ?
                    <Container className='d-flex flex-column align-items-center'>
                        <h4 className='mt-5' style={{ textAlign: 'center' }}>No Users to Verify</h4>
                        <Button onClick={() => navigate('/')} style={{ width: 'max-content' }}>Go Back</Button>
                    </Container>
                    :
                    <Table striped bordered hover className='bg-white'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Date Of Birth</th>
                                <th>Subjects</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unverifiedUsers.map((user, index) => {
                                const { name, username, email, phoneNumber, dateOfBirth, subjects, _id } = user
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{name}</td>
                                        <td>{username}</td>
                                        <td>{email}</td>
                                        <td>{phoneNumber}</td>
                                        <td>{dateOfBirth.split('T')[0]}</td>
                                        <td>
                                            <Form.Select>
                                                {subjects.map((subject, index) => {
                                                    return (
                                                        <option>{subject.name}</option>
                                                    )
                                                })}
                                            </Form.Select>

                                        </td>
                                        <td className='d-flex gap-3'>
                                            <Button variant="success" onClick={() => handleApprove(_id)} disabled={loading}>Approve</Button>
                                            <Button variant="danger" onClick={() => handleDelete(_id)} disabled={loading}>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
            }
        </Container>
    )
}

export default VerifyUser