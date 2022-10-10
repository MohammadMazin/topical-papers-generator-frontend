import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
import { getVerifiedUsers, setUserPaidStatus } from '../services/user'
import Form from 'react-bootstrap/Form';
import Spinner from '../components/Spinner';

const Users = () => {
    const [verifiedUsers, setVerifiedUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await getVerifiedUsers()
        if (res.success) {
            setVerifiedUsers(res.data)
        }
        else {
            toast.error('Failed to fetch users data')
        }
    }

    const handlePaidStatus = async (_id, paid) => {
        setLoading(true)

        const data = {
            _id,
            paid,
            adminId: localStorage.getItem("_id")
        }

        const res = await setUserPaidStatus(data)
        if (res.success) {
            if (paid)
                toast.success("User is now a Paid Tier User!")
            else
                toast.success("User is now a Free Tier User!")

            setVerifiedUsers((prevUsers) => {
                const index = prevUsers.findIndex(user => user._id === _id)
                prevUsers[index].paid = paid
                return prevUsers
            })
        }
        else {
            toast.error('Failed to update pay status')
        }
        setLoading(false)
    }


    return (
        <Container className='p-0 my-4'>
            <h1>Users</h1>
            <hr />
            {
                verifiedUsers.length === 0 ?
                    <Spinner text="Loading Users" />
                    :
                    <Table striped bordered hover className='bg-white' >
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
                            {verifiedUsers.map((user, index) => {
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
                                            {user.paid ?
                                                <Button variant="danger" onClick={() => handlePaidStatus(_id, false)} disabled={loading}>Set As Unpaid User</Button>
                                                :
                                                <Button variant="warning" onClick={() => handlePaidStatus(_id, true)} disabled={loading}>Set as Paid User</Button>
                                            }
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

export default Users