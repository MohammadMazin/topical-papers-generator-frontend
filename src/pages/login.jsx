import { useState, useContext } from 'react'
import { login } from '../services/user'
import { Link } from 'react-router-dom'
import UserContext from '../globals/user-data'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


export default function Login() {
  const navigate = useNavigate()
  const { setUserState } = useContext(UserContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    const res = await login({ email, password })
    if (res.success) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('_id', res.data._id)
      setUserState({ isAuth: true, token: res.token, data: res.data })
      toast.success('Login Successful')
      navigate('/')
    } else
      toast.error(res.message)
    setLoading(false)
  }
  const handleGuestLogin = async e => {
    e.preventDefault()
    setLoading(true)
    const res = await login({ email: 'guest@gmail.com', password: 'guest' })
    if (res.success) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('_id', res.data._id)
      setUserState({ isAuth: true, token: res.token, data: res.data })
      toast.success('Login Successful')
      navigate('/')
    } else
      toast.error(res.message)
    setLoading(false)
  }


  return (
    <div>
      <main className='d-flex' style={{ height: '100vh' }}>
        <div className='bg-white loginImage' style={{ flex: 1 }}>
          <img alt="person writing" className='w-100 h-100' src="https://img.freepik.com/premium-photo/asian-woman-university-student-casual-writing-paper-notebook-teenager-student-hand-writing-lecture-note-book-school-campus-college-university-education_7190-3148.jpg?w=2000" style={{ objectFit: 'cover' }} />
        </div>
        <Container className='p-5 h-100 d-flex flex-column align-items-center justify-content-center bg-white' style={{ flex: 1 }}>
          <h1 className='mt-2 mb-2' style={{ textAlign: 'center' }}>Topical Papers Generator</h1>
          <hr />
          <h3 className='mb-4' style={{ textAlign: 'center' }}>Log In</h3>

          <Form onSubmit={handleLogin} className='w-75' style={{ minWidth: '300px' }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
              <Form.Text className="text-muted">
                We&apos;ll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" className='w-100' type="submit" disabled={loading}>
              Log In
            </Button>
            <hr />
            <Container className="d-flex w-75 gap-4 justify-content-around mt-4">
              {/* TODO: Handle Guest User */}
              <span style={{ textAlign: 'center', cursor: 'pointer', color: '#004de7' }} onClick={handleGuestLogin}>Try Us Out! Login as Guest</span >
              <Link to="/register" style={{ color: 'white' }}>
                <Button variant="outline-primary">
                  Sign Up!
                </Button>
              </Link>
            </Container>
          </Form>
        </Container>
      </main>
      {/* 
      <footer className={styles.footer}>

      </footer> */}
    </div>
  )
}
