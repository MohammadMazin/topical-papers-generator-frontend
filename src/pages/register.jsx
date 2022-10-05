import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllSubjects } from '../services/subjects'
import { toast } from 'react-toastify'
import Multiselect from 'multiselect-react-dropdown';
import { addUser } from '../services/user'
import { useNavigate } from 'react-router-dom'

export default function Register() {

    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [subjects, setSubjects] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await getAllSubjects()
            if (res.success) {
                setSubjects(res.data)
            }
            else
                toast.error('Failed to Fetch Subjects. Reload the page.')

            setLoading(false)
        }

        fetchData()
    }, [])

    const handleSelect = (selectedItem, selectedList) => {
        setSelectedSubjects((prevSubjects) => {
            return [
                ...selectedItem
            ]
        })
    }
    const handleUnselect = (selectedItem, selectedList) => {
        setSelectedSubjects((prevSubjects) => {
            return prevSubjects.filter(subject => subject._id !== selectedList._id)
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()


        const data = {
            username,
            password,
            name,
            email,
            phoneNumber,
            dateOfBirth,
            subjects: selectedSubjects.map(subject => subject._id),
            adminId: localStorage.getItem("_id")
        }


        const res = await addUser(data)
        if (res.success) {
            toast.success('Signed Up Successfully')
            navigate('/')
        }
        else {
            toast.error('Failed Signed Up')
            toast.error(res.message)
        }
    }

    return (
        <div className="p-0">
            <main className="d-flex" style={{ height: '100vh' }}>
                <Container className='w-50 card p-5 d-flex flex-column align-items-center justify-content-center'>
                    <Link to="/">Back To Login</Link>
                    <h1 className='mt-2 mb-2' style={{ textAlign: 'center' }}>Topical Papers Generator</h1>
                    <hr />
                    <h3 className='mb-4' style={{ textAlign: 'center' }}>Sign Up</h3>

                    <Form className='w-75'>
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
                            <Form.Text className="text-muted">
                                We&apos;ll never share your email with anyone else.
                            </Form.Text>
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
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Subjects</Form.Label>
                            {!loading &&
                                <Multiselect
                                    options={subjects}
                                    onSelect={handleSelect}
                                    onRemove={handleUnselect}
                                    displayValue="name"
                                />
                            }
                        </Form.Group>

                        <Button variant="primary" className='w-100' onClick={handleSubmit}>
                            Sign Up
                        </Button>
                    </Form>

                </Container>
                <div className='w-50 bg-white'>
                    <img className='w-100 h-100' src="https://assets.entrepreneur.com/content/3x2/2000/20150115183825-books-reading.jpeg" style={{ objectFit: 'cover' }} />
                </div>
            </main >
            {/* 
      <footer className={styles.footer}>

      </footer> */}
        </div >
    )
}
