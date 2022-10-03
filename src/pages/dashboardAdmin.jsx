import { useState, useEffect, useContext } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import UserContext from '../globals/user-data'
import { searchQuestions } from '../services/questions'
import { getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { getSingleUser } from '../services/user'
import { getAllLevels } from '../services/levels'

const DashboardAdmin = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks


    useEffect(() => {

    }, [])


    return (
        <>
            <Container className=' d-flex align-items-center' style={{ height: '90vh' }}>
                <Container className='p-0 mt-5 d-flex flex-column  w-50'>
                    <h1>Options</h1>
                    <Container className='py-5 card gap-3 d-flex flex-column align-items-center' >
                        <Link to="/addQuestion" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Question</Button>
                        </Link>
                        <Link to="/addBoard" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Board</Button>
                        </Link>
                        <Link to="/addLevel" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Level</Button>
                        </Link>
                        <Link to="/addSubjectCategory" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Subject Category</Button>
                        </Link>
                        <Link to="/addSubject" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Subject</Button>
                        </Link>
                        <Link to="/addTopic" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Topic</Button>
                        </Link>
                        <Link to="/addQuestionType" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Add Question Type</Button>
                        </Link>
                        <Link to="/verify-user" className='w-75'>
                            <Button className='py-3 w-100' style={{ fontSize: '24px' }}>Verify User</Button>
                        </Link>
                    </Container>
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