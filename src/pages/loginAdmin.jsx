import { useState, useContext } from 'react'
import { loginAdmin } from '../services/user'
import UserContext from '../globals/user-data'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


export default function LoginAdmin() {
  const navigate = useNavigate()
  const { setUserState } = useContext(UserContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    const res = await loginAdmin({ email, password })
    if (res.success) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('_id', res.data._id)
      localStorage.setItem('isAdmin', true)
      setUserState({ isAuth: true, token: res.token, data: res.data })
      toast.success('LoginAdmin Successful')
      navigate('/')
    } else
      toast.error('Failed to Login!')
    setLoading(false)
  }


  return (
    <div>
      <main>

        <Container className='w-50 mt-5 card p-5'>
          <h1 className='mt-2 mb-2' style={{ textAlign: 'center' }}>Topical Papers Generator</h1>
          <hr />
          <h3 className='mb-4' style={{ textAlign: 'center' }}>Admin Log In</h3>

          <Form onSubmit={handleLogin}>
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
          </Form>
        </Container>
      </main>
      {/* 
      <footer className={styles.footer}>

      </footer> */}
    </div>
  )
}
