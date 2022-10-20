import { useState, useEffect, useRef } from 'react'
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
import Multiselect from 'multiselect-react-dropdown';

import { PDFDownloadLink } from '@react-pdf/renderer'
import QuestionPDF from '../components/QuestionPDF'
import { getQuestionTypes } from '../services/questionTypes'

function getWindowDimensions() {
    const { innerWidth: width, } = window;
    return width
}

const Dashboard = () => {

    const dropdownRef = useRef()

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [search, setSearch] = useState("")
    const [questions, setQuestions] = useState([])
    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [subjects, setSubjects] = useState([])
    const [boards, setBoards] = useState([])
    const [levels, setLevels] = useState([])
    const [topics, setTopics] = useState([])
    const [questionTypes, setQuestionTypes] = useState([])

    const [boardId, setBoardId] = useState(null)
    const [courseId, setCourseId] = useState(null)
    const [levelId, setLevelId] = useState(null)
    const [subjectId, setSubjectId] = useState(null)
    const [topicId, setTopicId] = useState([])
    const [questionTypeId, setQuestionTypeId] = useState(null)
    const [tags, setTags] = useState(null)

    const [filterOn, setFilterOn] = useState(false)

    const [loading, setLoading] = useState(false)
    const [key, setKey] = useState('question');
    const [selectedQuestion, setSelectedQuestion] = useState(null)

    const [width, setWidth] = useState(getWindowDimensions())

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

            const resQType = await getQuestionTypes()
            if (resQType.success) {
                setQuestionTypes(resQType.data)
            }
            else
                toast.error(resQType.message)
        }

        function handleResize() {
            setWidth(getWindowDimensions());
        }

        fetchData()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
            boardId: boardId === 'null' ? null : boardId,
            levelId: levelId === 'null' ? null : levelId,
            subjectId: subjectId === 'null' ? null : subjectId,
            topicId: topicId.length === 0 ? null : topicId.map(topic => topic._id),
            questionTypeId: questionTypeId === 'null' ? null : questionTypeId,
            courseId: courseId === '' ? null : courseId?.split(','),
            description: tags === '' ? null : tags?.split(','),
            filterOn,
            userId: localStorage.getItem("_id")
        }

        console.log(data)

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

    const handleSelectSubject = async _id => {
        let id = _id === 'null' ? null : _id
        setSubjectId(id)

        const res = await getTopicsOfSubject({ subjectId: id })
        if (res.success) {
            setTopics(res.data)
            dropdownRef.current.resetSelectedValues()
            setTopicId([])
        }
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

    const handleSelectTopics = (selectedItem, selectedList) => {
        setTopicId((prevTopicIds) => {
            return [
                ...selectedItem
            ]
        })
    }
    const handleUnselectTopics = (selectedItem, selectedList) => {
        setTopicId((prevTopicIds) => {
            return prevTopicIds.filter(topicId => topicId._id !== selectedList._id)

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
                                            <option value={'null'}>All Levels</option>
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
                                            <option value={'null'}>All Subjects</option>
                                            {subjects.map((subject, index) => {
                                                const { _id, name } = subject
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>

                                    <Container className='p-0'>
                                        <Form.Label>Select Topic</Form.Label>
                                        {/* <Form.Select aria-label="Default select example" disabled={topics.length === 0} onChange={(e) => setTopicId(e.target.value)}>
                                            <option value={'null'}>All Topics</option>
                                            {topics.map((topic, index) => {
                                                const { _id, name } = topic
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select> */}
                                        <Multiselect
                                            disable={topics.length === 0}
                                            ref={dropdownRef}
                                            options={topics}
                                            onSelect={handleSelectTopics}
                                            onRemove={handleUnselectTopics}
                                            displayValue="name"
                                        />
                                    </Container>

                                </Container>
                                <Container className='d-flex justify-space-around p-0 gap-5 mt-3'>
                                    <Container className='p-0'>
                                        <Form.Label>Select Question Type</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => setQuestionTypeId(e.target.value)}>
                                            <option value={'null'}>All Question Types</option>
                                            {questionTypes.map((questionType, index) => {
                                                const { _id, name } = questionType
                                                return <option key={_id} value={_id}>{name}</option>
                                            })
                                            }
                                        </Form.Select>
                                    </Container>

                                    <Container>
                                        <Form.Label>Course ID</Form.Label>
                                        <Form.Control
                                            type="search"
                                            placeholder="Separate Course ID by Comma- Example:(2210,2541)"
                                            className="me-2"
                                            aria-label="Search"
                                            onChange={(e) => setCourseId(e.target.value)} />

                                    </Container>
                                </Container>

                                <Form.Label>Tags</Form.Label>
                                <Form.Control
                                    type="search"
                                    placeholder="Separate Tags by Comma- Example:(output,laser printer,computer)"
                                    className="me-2"
                                    aria-label="Search"
                                    onChange={(e) => setTags(e.target.value)} />
                                <Container>

                                </Container>

                                <Container className='w-100 p-0 d-flex'>
                                    <Button variant="primary" className='mt-3 ms-auto' onClick={handleSearch}>Search Using Filters</Button>
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
                                                <h3 className='p-3'>{questions.length} Search Results</h3>
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
                                                        width={width}
                                                    />
                                                })
                                                }
                                            </Container>

                                            <Container className="bg-white mt-4 dashboardTab" >
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
        </>
    )
}

export default Dashboard