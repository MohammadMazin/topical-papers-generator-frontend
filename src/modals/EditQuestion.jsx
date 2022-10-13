import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import CodeEditor from '@uiw/react-textarea-code-editor';
import { toast } from 'react-toastify'
import { editQuestion } from '../services/questions'
import { getAllLevelsOfBoard } from '../services/levels'
import { getTopicsOfSubject } from '../services/topics'

const EditQuestion = ({
    show,
    data,
    handleClose,
    questionTypes,
    levels,
    boards,
    subjects,
    topics,
    setLevels,
    setTopics
}) => {


    const questionId = data._id
    const [title, setTitle] = useState(data.title)
    const [description, setDescription] = useState(data.description)
    const [courseId, setCourseId] = useState(data.courseId)
    const [marks, setMarks] = useState(data.marks)
    const [boardId, setBoardId] = useState(data.boardId._id)
    const [subjectId, setSubjectId] = useState(data.subjectId._id)
    const [questionTypeId, setQuestionTypeId] = useState(data.questionTypeId._id)
    const [levelId, setLevelId] = useState(data.levelId._id)
    const [topicId, setTopicId] = useState(data.topicId._id)
    const [paid, setPaid] = useState(data.paid)

    const [question, setQuestion] = useState(data.question)
    const [answer, setAnswer] = useState(data.answer)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        handleGetLevelsOfBoard(boardId)
        handleSelectSubject(subjectId)
    }, [])

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

    const handleSubmit = async () => {
        setLoading(true)
        //TODO: Add validation

        const data = {
            _id: questionId,
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

        console.log(data)

        const res = await editQuestion(data)
        if (res.success) {
            console.log(res)
            toast.success('Question added to database!')
        }
        else
            toast.error('Failed to add question to database!')
        setLoading(false)
    }


    return (
        <Modal show={show} onHide={handleClose} fullscreen={true} >
            <Modal.Header closeButton>
                <Modal.Title>Edit Question</Modal.Title>
            </Modal.Header>
            <Modal.Body >

                <Container className="bg-white mt-4" style={{ textAlign: 'left' }}>
                    <Form.Label>Question Title</Form.Label>
                    <Form.Control
                        type="title"
                        value={title}
                        placeholder=""
                        className="me-2 mb-4"
                        aria-label="title"
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <Form.Label>Question Description</Form.Label>
                    <Form.Control
                        type="description"
                        value={description}
                        placeholder=""
                        className="me-2 mb-4"
                        aria-label="description"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Form.Label>Course ID</Form.Label>
                    <Form.Control
                        type="title"
                        value={courseId}
                        placeholder=""
                        className="me-2 mb-4 w-25"
                        aria-label="title"
                        onChange={(e) => setCourseId(e.target.value)}
                    />

                    <Form.Label>Marks</Form.Label>
                    <Form.Control
                        type="number"
                        value={marks}
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
                        <option value={0} selected={paid === 0}>Free Tier</option>
                        <option value={1} selected={paid === 1}>Paid Tier</option>
                        <option value={2} selected={paid === 2}>Guest Tier</option>
                    </Form.Select>

                    <Form.Label className='mt-3'>Question Type</Form.Label>
                    <Form.Select
                        className='w-25'
                        onChange={(e) => setQuestionTypeId(e.target.value)}
                    >
                        {questionTypes.map((questionType, index) => {
                            const { name, _id } = questionType
                            return (
                                // <option onClick={() => setQuestionTypeId(_id)}>{name}</option>
                                <option value={_id} selected={_id === data.questionTypeId._id}>{name}</option>
                            )
                        })}
                    </Form.Select>

                    <Container className='d-flex flex-column justify-space-around p-0 gap-5 mt-3'>
                        <Container className='p-0 d-flex'>
                            <Container className='p-0'>
                                <Form.Label>Select Board</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={(e) => handleGetLevelsOfBoard(e.target.value)} style={{ width: '80%' }}>
                                    <option value="" disabled >Select your Board</option>
                                    {boards.map((board, index) => {
                                        const { _id, name } = board
                                        return <option key={_id} value={_id} selected={_id === data.boardId._id}>{name}</option>
                                    })
                                    }
                                </Form.Select>
                            </Container>

                            <Container className='p-0'>
                                <Form.Label>Select Level</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={(e) => setLevelId(e.target.value)} style={{ width: '80%' }}>
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
                                    <option value="" disabled >Select your Subject</option>
                                    {subjects.map((subject, index) => {
                                        const { _id, name } = subject
                                        return <option key={_id} value={_id} selected={_id === data.subjectId._id}>{name}</option>
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
                            <Container style={{
                                overflowY: 'auto',
                                height: '500px'
                            }}>
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

                        </Container>
                        <div className='w-50 p-2' dangerouslySetInnerHTML={{ __html: question }} style={{ backgroundColor: 'white' }} />
                    </Container>

                    <p className='mt-5'>Answer</p>
                    <Container className=' p-0 d-flex gap-5 mt-1'>
                        <Container className='p-0 bg-white flex-1 p-0 w-50 d-flex flex-column'>
                            <Container style={{
                                overflowY: 'auto',
                                height: '500px'
                            }}>
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
                        </Container>

                        <div className='w-50 p-2' dangerouslySetInnerHTML={{ __html: answer }} style={{ backgroundColor: 'white' }} />
                    </Container>
                    <hr />
                    <Button className='d-flex ms-auto px-5 mt-4' onClick={handleSubmit} disabled={loading}>Edit Question</Button>

                </Container>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditQuestion