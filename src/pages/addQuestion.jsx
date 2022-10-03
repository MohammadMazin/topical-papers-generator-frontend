import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { getAllBoards } from '../services/boards'
import { toast } from 'react-toastify'
import { addQuestion } from '../services/questions'
import { getQuestionTypes } from '../services/questionTypes'
import { getAllLevelsOfBoard } from '../services/levels'
import { getAllSubjects } from '../services/subjects'
import CodeEditor from '@uiw/react-textarea-code-editor';
import { getTopicsOfSubject } from '../services/topics'
import { useNavigate } from 'react-router-dom'

const AddQuestion = () => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [marks, setMarks] = useState(null)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [questionTypeId, setQuestionTypeId] = useState(null)
    const [questionTypes, setQuestionTypes] = useState([])

    const [boards, setBoards] = useState([])
    const [subjects, setSubjects] = useState([])
    const [levels, setLevels] = useState([])
    const [topics, setTopics] = useState([])

    const [boardId, setBoardId] = useState(null)
    const [levelId, setLevelId] = useState(null)
    const [subjectId, setSubjectId] = useState(null)
    const [topicId, setTopicId] = useState(null)

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

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
            boardId,
            levelId,
            subjectId,
            questionTypeId,
            topicId,
            adminId: localStorage.getItem("_id")
        }

        const res = await addQuestion(data)
        if (res.success) {
            toast.success('Question added to database!')
            navigate('/')
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

    return (
        <Container className='py-4'>
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

            <Form.Label>Marks</Form.Label>
            <Form.Control
                type="number"
                placeholder=""
                aria-label="Title"
                className='w-25'
                onChange={(e) => setMarks(parseInt(e.target.value))}
            />

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

        </Container>
    )
}

export default AddQuestion