import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

const DashboardAdmin = () => {

    return (
        <>
            <Container className='p-0 my-4 d-flex flex-column  w-50'>
                <h1>Options</h1>
                <Container className='py-5 card gap-3 d-flex align-items-center' style={{ flexWrap: 'wrap' }} >
                    <Link to="/addBoard" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Boards</Button></Link>
                    <Link to="/addLevel" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Levels</Button></Link>

                    <hr />
                    <Link to="/addSubjectCategory" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Subject Categorys</Button></Link>
                    <Link to="/addSubject" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Subjects</Button></Link>
                    <Link to="/addTopic" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Topics</Button></Link>

                    <hr />
                    <Link to="/addQuestionType" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Question Types</Button></Link>
                    <Link to="/addQuestion" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Questions</Button></Link>

                    <hr />
                    <Link to="/verify-user" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Verify Users</Button></Link>
                    <Link to="/create-admin" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Create Admin</Button></Link>

                </Container>
            </Container>
        </>
    )
}

export default DashboardAdmin