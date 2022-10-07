import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'
import { getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { addQuestion, deleteQuestion, getAllQuestions } from '../services/questions'
import { getQuestionTypes } from '../services/questionTypes'
import { getAllLevelsOfBoard } from '../services/levels'
import { getAllSubjects } from '../services/subjects'
import CodeEditor from '@uiw/react-textarea-code-editor';
import { getTopicsOfSubject } from '../services/topics'
import { useNavigate } from 'react-router-dom'
import QuestionDetail from '../modals/QuestionDetail'
import EditQuestion from '../modals/EditQuestion'

const AddQuestion = () => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [marks, setMarks] = useState(null)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [questionTypeId, setQuestionTypeId] = useState(null)
    const [questionTypes, setQuestionTypes] = useState([])

    const [questions, setQuestions] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState([])

    const [boards, setBoards] = useState([])
    const [subjects, setSubjects] = useState([])
    const [levels, setLevels] = useState([])
    const [topics, setTopics] = useState([])
    const [courseId, setCourseId] = useState([])

    const [boardId, setBoardId] = useState(null)
    const [levelId, setLevelId] = useState(null)
    const [subjectId, setSubjectId] = useState(null)
    const [topicId, setTopicId] = useState(null)
    const [paid, setPaid] = useState(0)

    const [show, setShow] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

        const fetchQuestions = async () => {
            const res = await getAllQuestions()
            if (res.success)
                setQuestions(res.data)
            else
                toast.error('Failed to fetch data')
        }

        const fetchData = async () => {

            // TODO: Loading spinner where required
            const resBoards = await getAllBoards()
            if (resBoards.success) {
                setBoards(resBoards.data)
            }
            else {
                toast.error('Failed to load Boards! Reload the page and try again')
            }

            const resSubjects = await getAllSubjects()
            if (resSubjects.success) {
                setSubjects(resSubjects.data)
            }
            else
                toast.error(resSubjects.message)

            const res = await getQuestionTypes()
            if (res.success) {
                setQuestionTypes(res.data)
                setQuestionTypeId(res.data[0]._id)
            }
            else {
                toast.error('Failed to Fetch Question Types')
            }
        }

        fetchQuestions()
        fetchData()
    }, [])

    const handleSubmit = async () => {
        setLoading(true)
        //TODO: Add validation

        const data = {
            title,
            description,
            marks,
            question,
            answer,
            courseId,
            boardId,
            levelId,
            subjectId,
            questionTypeId,
            topicId,
            paid,
            adminId: localStorage.getItem("_id")
        }

        const res = await addQuestion(data)
        if (res.success) {
            toast.success('Question added to database!')
            // navigate('/')
        }
        else
            toast.error('Failed to add question to database!')
        setLoading(false)
    }

    const handleGetLevelsOfBoard = async (id) => {
        const res = await getAllLevelsOfBoard({ boardId: id })
        if (res.success) {
            setBoardId(id)
            setLevels(res.data)
        }
        else
            toast.error(res.message)
    }

    const handleSelectSubject = async id => {
        setSubjectId(id)

        const res = await getTopicsOfSubject({ subjectId: id })
        if (res.success)
            setTopics(res.data)
        else
            toast.error('Failed to fetch topics of subject')
    }

    const handleClose = () => { setShow(false) }
    const handleShowQuestion = (question) => {
        setSelectedQuestion(question)
        setShow(true)
    }
    const handleShowEdit = (question) => {
        setSelectedQuestion(question)
        setShowEdit(true)
    }
    const handleHideEdit = () => setShowEdit(false)

    const handleDelete = async (_id) => {
        setLoading(true)
        const data = {
            _id,
            adminId: localStorage.getItem("_id")
        }
        const res = await deleteQuestion(data)
        if (res.success) {
            toast.success("Question Deleted Successfully!")
            setQuestions((prevQuestions) => prevQuestions.filter(question => question._id !== _id))
        }
        else
            toast.error("Failed to Delete Question!")
        setLoading(false)
    }

    return (
        <>
            <Container className='py-4'>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Add Question</Accordion.Header>
                        <Accordion.Body>
                            <h1>Add Question</h1>
                            <hr />
                            <Form.Label>Question Title</Form.Label>
                            <Form.Control
                                type="title"
                                placeholder=""
                                className="me-2 mb-4"
                                aria-label="title"
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <Form.Label>Question Description</Form.Label>
                            <Form.Control
                                type="description"
                                placeholder=""
                                className="me-2 mb-4"
                                aria-label="description"
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <Form.Label>Course ID</Form.Label>
                            <Form.Control
                                type="title"
                                placeholder=""
                                className="me-2 mb-4 w-25"
                                aria-label="title"
                                onChange={(e) => setCourseId(e.target.value)}
                            />

                            <Form.Label>Marks</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder=""
                                aria-label="Title"
                                className='w-25'
                                onChange={(e) => setMarks(parseInt(e.target.value))}
                            />

                            <Form.Label>Question Tier</Form.Label>
                            <Form.Select
                                className='w-25'
                                onChange={(e) => setPaid(e.target.value)}
                            >
                                <option value={0} selected>Free Tier</option>
                                <option value={1} >Paid Tier</option>
                                <option value={2} >Guest Tier</option>
                            </Form.Select>

                            <Form.Label className='mt-3'>Question Type</Form.Label>
                            <Form.Select
                                className='w-25'
                                onChange={(e) => setQuestionTypeId(e.target.value)}
                            >
                                <option value="" disabled selected>Select your Question Type</option>
                                {questionTypes.map((questionType, index) => {
                                    const { name, _id } = questionType
                                    return (
                                        // <option onClick={() => setQuestionTypeId(_id)}>{name}</option>
                                        <option value={_id}>{name}</option>
                                    )
                                })}
                            </Form.Select>

                            <Container className='d-flex flex-column justify-space-around p-0 gap-5 mt-3'>
                                <Container className='p-0 d-flex'>
                                    <Container className='p-0'>
                                        <Form.Label>Select Board</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => handleGetLevelsOfBoard(e.target.value)} style={{ width: '80%' }}>
                                            <option value="" disabled selected>Select your Board</option>
                                            {boards.map((board, index) => {
                                                const { _id, name } = board
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>

                                    <Container className='p-0'>
                                        <Form.Label>Select Level</Form.Label>
                                        <Form.Select aria-label="Default select example" disabled={levels.length === 0} onChange={(e) => setLevelId(e.target.value)} style={{ width: '80%' }}>
                                            <option value="" disabled selected>Select your Level</option>
                                            {levels.map((level, index) => {
                                                const { _id, name } = level
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>
                                </Container>

                                <Container className='p-0 d-flex'>
                                    <Container className='p-0'>
                                        <Form.Label>Select Subject</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => handleSelectSubject(e.target.value)} style={{ width: '80%' }}>
                                            <option value="" disabled selected>Select your Subject</option>
                                            {subjects.map((subject, index) => {
                                                const { _id, name } = subject
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>

                                    <Container className='p-0'>
                                        <Form.Label>Select Topic</Form.Label>
                                        <Form.Select aria-label="Default select example" disabled={topics.length === 0} onChange={(e) => setTopicId(e.target.value)} style={{ width: '80%' }}>
                                            <option value="" disabled selected>Select your Topic</option>
                                            {topics.map((topic, index) => {
                                                const { _id, name } = topic
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>
                                </Container>
                            </Container>

                            <p className='mt-5'>Question</p>
                            <Container className=' p-0 d-flex gap-5 mt-1'>
                                <Container className='p-0 bg-white flex-1 p-0 w-50 d-flex flex-column'>
                                    <CodeEditor
                                        value={question}
                                        language="html"
                                        placeholder="Please enter HTML code."
                                        onChange={(evn) => setQuestion(evn.target.value)}
                                        padding={15}
                                        style={{
                                            fontSize: 18,
                                            backgroundColor: "#04212b",
                                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                        }}
                                    />
                                </Container>
                                <div className='w-50 p-2' dangerouslySetInnerHTML={{ __html: question }} style={{ backgroundColor: 'white' }} />
                            </Container>

                            <p className='mt-5'>Answer</p>
                            <Container className=' p-0 d-flex gap-5 mt-1'>
                                <Container className='p-0 bg-white flex-1 p-0 w-50 d-flex flex-column'>
                                    <CodeEditor
                                        value={answer}
                                        language="html"
                                        placeholder="Please enter HTML code."
                                        onChange={(evn) => setAnswer(evn.target.value)}
                                        padding={15}
                                        style={{
                                            fontSize: 18,
                                            backgroundColor: "#04212b",
                                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                        }}
                                    />
                                </Container>

                                <div className='w-50 p-2' dangerouslySetInnerHTML={{ __html: answer }} style={{ backgroundColor: 'white' }} />
                            </Container>
                            <hr />
                            <Button className='d-flex ms-auto px-5 mt-4' onClick={handleSubmit} disabled={loading}>Add Question</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>


            </Container>
            <div className='p-0 bg-white mt-4' style={{ width: '90vw', marginLeft: 'auto', marginRight: 'auto' }}>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Marks</th>
                            <th>Detail</th>
                            <th>Course ID</th>
                            <th>Board</th>
                            <th>Level</th>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Question Type</th>
                            <th>Tier</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => {
                            const { title, description, marks, courseId, topicId, questionTypeId, boardId, levelId, subjectId, paid, _id } = q
                            return (
                                <tr key={_id}>
                                    <td>{index + 1}</td>
                                    <td>{title}</td>
                                    <td>{description}</td>
                                    <td>{marks}</td>
                                    <td>
                                        <span onClick={() => handleShowQuestion(q)} style={{ color: '#004cff', cursor: 'pointer' }}>View Detail</span>
                                    </td>
                                    <td>{courseId}</td>
                                    <td>{boardId?.name}</td>
                                    <td>{levelId?.name}</td>
                                    <td>{subjectId?.name}</td>
                                    <td>{topicId?.name}</td>
                                    <td>{questionTypeId?.name}</td>
                                    <td>{paid ? <b>Paid</b> : 'Free'}</td>
                                    <td>
                                        <Container className='p-0 d-flex gap-2'>
                                            <Button variant="warning m-0" onClick={() => handleShowEdit(q)} disabled={loading}>Edit</Button>
                                            <Button variant="danger m-0" onClick={() => handleDelete(_id)} disabled={loading}>Delete</Button>
                                        </Container>
                                    </td>
                                </tr>
                            )
                        })

                        }
                    </tbody>
                </Table>
            </div>
            {show && <QuestionDetail show={show} handleClose={handleClose} data={selectedQuestion} />}
            {showEdit && <EditQuestion show={showEdit} handleClose={handleHideEdit} data={selectedQuestion} />}
        </>
    )
}

export default AddQuestion