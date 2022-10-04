import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Question from '../components/Question'
import Accordion from 'react-bootstrap/Accordion';
import Pagination from 'react-bootstrap/Pagination';
import { searchQuestions } from '../services/questions'
import { getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { getSingleUser } from '../services/user'
import { getAllLevelsOfBoard } from '../services/levels'
import Spinner from '../components/Spinner'

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ViewPDFModal from '../modals/ViewPDFModal'
import { getTopicsOfSubject } from '../services/topics'

const Dashboard = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [search, setSearch] = useState("")
    const [questions, setQuestions] = useState([])
    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [subjects, setSubjects] = useState([])
    const [boards, setBoards] = useState([])
    const [levels, setLevels] = useState([])
    const [topics, setTopics] = useState([])

    const [boardId, setBoardId] = useState(null)
    const [levelId, setLevelId] = useState(null)
    const [subjectId, setSubjectId] = useState(null)
    const [topicId, setTopicId] = useState(null)

    const [filterOn, setFilterOn] = useState(false)

    const [loading, setLoading] = useState(false)
    const [key, setKey] = useState('question');
    const [selectedQuestion, setSelectedQuestion] = useState(null)

    const [show, setShow] = useState(false)


    useEffect(() => {

        const fetchData = async () => {
            const resBoards = await getAllBoards()
            if (resBoards.success) {
                setBoards(resBoards.data)
            }
            else {

                toast.error('Failed to load Boards! Reload the page and try again')
            }

            const _id = localStorage.getItem("_id")
            if (_id) {
                const resSubjects = await getSingleUser({ _id })
                if (resSubjects.success) {
                    setSubjects(resSubjects.data.subjects)
                }
                else
                    toast.error(resSubjects.message)
            }
        }

        fetchData()
    }, [])

    // TODO: Test with levels of other boards - add data into other boards

    const handleGetLevelsOfBoard = async (id) => {
        if (id === 'null') {
            setLevels([])
            setBoardId(null)
            return
        }

        const res = await getAllLevelsOfBoard({ boardId: id })
        if (res.success) {
            setBoardId(id)
            setLevels(res.data)
        }
        else
            toast.error(res.message)
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            query: search,
            boardId,
            levelId,
            subjectId,
            topicId,
            filterOn,
            userId: localStorage.getItem("_id")
        }

        const res = await searchQuestions(data)
        if (res.success) {
            setQuestions(res.data)
        }
        else
            console.log(res)
        setLoading(false)
    }

    const handleAddQuestion = (_id) => {
        let index;
        setQuestions(prevQuestions => {
            index = prevQuestions.findIndex(question => question._id === _id)

            prevQuestions[index].selected = true

            return [...prevQuestions]
        })

        setSelectedQuestions(prevSelectedQuestions => {
            return [...prevSelectedQuestions, questions[index]]
        })
    }

    const handleRemoveQuestion = (_id) => {
        let index;
        setQuestions(prevQuestions => {
            index = prevQuestions.findIndex(question => question._id === _id)

            prevQuestions[index].selected = false

            return [...prevQuestions]
        })

        setSelectedQuestions(prevSelectedQuestions => {
            return prevSelectedQuestions?.filter(question => question._id !== questions[index]._id)
        })
    }

    const handleSelectSubject = async id => {
        setSubjectId(id)

        const res = await getTopicsOfSubject({ subjectId: id })
        if (res.success)
            setTopics(res.data)
        else
            toast.error('Failed to fetch topics of subject')
    }

    const handleCloseModal = () => setShow(false)
    const clearSelectedQuestions = () => {
        setSelectedQuestions([])
        setQuestions(prevQuestions => {
            const data = prevQuestions.map(question => {
                if (question.selected)
                    question.selected = false
                return question
            })
            return data
        })
    }

    return (
        <>
            <Container>
                <Container className='p-0 my-5 '>
                    <Container className="d-flex p-0">
                        <Form onSubmit={handleSearch} className="d-flex p-0 w-100">
                            <Form.Control
                                type="search"
                                placeholder="Search for Questions"
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant="primary" type="submit" onClick={handleSearch}>Search</Button>
                        </Form>
                    </Container>

                    <Accordion className='mt-3'>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header onClick={() => setFilterOn(!filterOn)}>Filters</Accordion.Header>
                            <Accordion.Body>
                                <Container className='d-flex justify-space-around p-0 gap-5 mt-3'>
                                    <Container className='p-0'>
                                        <Form.Label>Select Board</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => handleGetLevelsOfBoard(e.target.value)}>
                                            <option value={'null'}>All Boards</option>
                                            {boards.map((board, index) => {
                                                const { _id, name } = board
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>
                                    <Container className='p-0'>
                                        <Form.Label>Select Level</Form.Label>
                                        <Form.Select aria-label="Default select example" disabled={levels.length === 0} onChange={(e) => setLevelId(e.target.value)}>
                                            <option value={null}>All Levels</option>
                                            {levels.map((level, index) => {
                                                const { _id, name } = level
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>
                                </Container>

                                <Container className='d-flex justify-space-around p-0 gap-5 mt-3'>
                                    <Container className='p-0'>
                                        <Form.Label>Select Subject</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => handleSelectSubject(e.target.value)}>
                                            <option value={null}>All Subjects</option>
                                            {subjects.map((subject, index) => {
                                                const { _id, name } = subject
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>

                                    <Container className='p-0'>
                                        <Form.Label>Select Topic</Form.Label>
                                        <Form.Select aria-label="Default select example" disabled={topics.length === 0} onChange={(e) => setTopicId(e.target.value)}>
                                            <option value={null}>All Topics</option>
                                            {topics.map((topic, index) => {
                                                const { _id, name } = topic
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>
                                </Container>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <hr />
                    {
                        loading ? <Spinner /> :
                            (
                                questions.length === 0 ?
                                    <Container className="p-0 d-flex justify-content-center mt-5">
                                        <h4>No Questions found...</h4>
                                    </Container>

                                    :
                                    <>
                                        <Container className='d-flex flex-row-reverse gap-3 flex-end p-0'>
                                            <Button onClick={() => setShow(true)} disabled={selectedQuestions.length === 0}>View PDF {selectedQuestions.length > 0 && `(${selectedQuestions.length} Questions)`}</Button>
                                        </Container>

                                        <Container className='p-0 d-flex'>
                                            <Container className="mt-4 rounded bg-white bg-gradient py-2">
                                                <h3 className='p-3'>Search Results</h3>
                                                {questions.map((question, index) => {

                                                    selectedQuestions.forEach(selectedQuestion => {
                                                        if (selectedQuestion._id === question._id)
                                                            question.selected = true
                                                    })

                                                    return <Question
                                                        key={question._id}
                                                        data={question}
                                                        setSelectedQuestion={setSelectedQuestion}
                                                        handleAddQuestion={() => handleAddQuestion(question._id)}
                                                        handleRemoveQuestion={() => handleRemoveQuestion(question._id)}
                                                    />
                                                })
                                                }
                                            </Container>

                                            <Container className="bg-white mt-4" >
                                                <div style={{ position: 'sticky', top: '30px' }}>

                                                    <Tabs
                                                        id="controlled-tab-example"
                                                        activeKey={key}
                                                        onSelect={(k) => setKey(k)}
                                                        className="mb-3"

                                                    >
                                                        <Tab eventKey="question" title="Question">
                                                            <div dangerouslySetInnerHTML={{ __html: selectedQuestion?.question }} />
                                                        </Tab>
                                                        <Tab eventKey="answer" title="Answer">
                                                            <div dangerouslySetInnerHTML={{ __html: selectedQuestion?.answer }} />
                                                        </Tab>

                                                    </Tabs>
                                                </div>
                                            </Container>
                                        </Container>
                                    </>
                            )
                    }
                </Container>
            </Container>

            {show && <ViewPDFModal
                show={show}
                handleClose={handleCloseModal}
                selectedQuestions={selectedQuestions}
                clearSelectedQuestions={clearSelectedQuestions} />}

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

export default Dashboard