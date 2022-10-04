import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

const DashboardAdmin = () => {

    return (
        <>
            <Container className='p-0 my-4 d-flex flex-column  w-50'>
                <h1>Options</h1>
                <Container className='py-5 card gap-3 d-flex align-items-center' style={{ flexWrap: 'wrap' }} >
                    <Link to="/addBoard" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Board</Button></Link>
                    <Link to="/addLevel" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Level</Button></Link>

                    <hr />
                    <Link to="/addSubjectCategory" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Subject Category</Button></Link>
                    <Link to="/addSubject" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Subject</Button></Link>
                    <Link to="/addTopic" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Topic</Button></Link>

                    <hr />
                    <Link to="/addQuestionType" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Question Type</Button></Link>
                    <Link to="/addQuestion" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Question</Button></Link>

                    <hr />
                    <Link to="/verify-user" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Verify User</Button></Link>
                    <Link to="/create-admin" className='w-50' ><Button className='py-3 w-100' style={{ fontSize: '24px' }}>Create Admin</Button></Link>

                </Container>
            </Container>

            {/* <Container className="d-flex justify-content-center">

                <Pagination>
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis />

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis />
                    <Pagination.Item>{20}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </Container> */}
        </>
    )
}

export default DashboardAdmin