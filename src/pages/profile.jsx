import { useState } from "react"
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from "react-toastify"
import { changePassword } from "../services/user"
import { useNavigate } from 'react-router-dom'


const Profile = () => {

    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [newPassAgain, setNewPassAgain] = useState('')
    const navigate = useNavigate()

    const handleChangePassword = async e => {
        e.preventDefault()
        if (newPass !== newPassAgain) {
            toast.error('New passwords entered do not match')
            return
        }

        const data = {
            _id: localStorage.getItem('_id'),
            oldPass,
            newPass
        }

        const res = await changePassword(data)
        if (res.success) {
            toast.success('Password has been updated')
            navigate('/')
        }
        else
            toast.error(res.message)
    }

    return (
        <Container className='py-4' >
            <h4>Change Password</h4>
            <Form onSubmit={handleChangePassword}>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                    type="password"
                    value={oldPass}
                    className="me-2 mb-4"
                    aria-label="password"
                    onChange={(e) => setOldPass(e.target.value)}
                />
                <Form.Label>New Password</Form.Label>

                <Form.Control
                    type="password"
                    value={newPass}
                    className="me-2 mb-4"
                    aria-label="password"
                    onChange={(e) => setNewPass(e.target.value)}
                />

                <Form.Label>Enter New Password Again</Form.Label>
                <Form.Control
                    type="password"
                    value={newPassAgain}
                    className="me-2 mb-4"
                    aria-label="password"
                    onChange={(e) => setNewPassAgain(e.target.value)}
                />
                <Button type="submit" onClick={handleChangePassword}>Change Password</Button>
            </Form>
        </Container>

    )
}

export default Profile