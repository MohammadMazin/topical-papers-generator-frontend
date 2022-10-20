import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion'



const Question = ({ data, setSelectedQuestion, handleAddQuestion, handleRemoveQuestion, width }) => {
    const { title, description, marks, topicId, courseId, questionTypeId, boardId, levelId, subjectId, paid, _id, question, answer, selected } = data
    const [key, setKey] = useState('question');

    if (width < 768) {
        return (
            <div className='card my-4 w-100'>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <Container className={`my-0 d-flex flex-column gap-4 p-3 bg-gradient ${!selected ? 'questionUnselected' : 'questionSelected'}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedQuestion(data)}>
                                <Container className='p-0 d-flex justify-content-between'>
                                    <h4>{title}</h4>
                                    <p><b>{marks}</b> Marks</p>
                                </Container>
                                <Container className='d-flex p-0 gap-3' style={{ minWidth: '200px', flexWrap: 'wrap' }}>
                                    <Badge pill>Topic: {topicId?.name}</Badge>
                                    <Badge pill>Course ID: {courseId}</Badge>
                                    <Badge pill>{questionTypeId?.name}</Badge>
                                    <Badge pill>{boardId?.name} - {levelId?.name}</Badge>
                                    <Badge pill>{subjectId?.name}</Badge>
                                </Container>
                                <Container className='d-flex gap-3 p-0' style={{ flexWrap: 'war' }}>
                                    <b>Tags:</b>
                                    {description.map((desc, index) => {
                                        return <p>{desc}</p>
                                    })}
                                </Container>
                            </Container>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Container className="bg-white mt-4" >
                                <div style={{ position: 'sticky', top: '30px' }}>

                                    <Tabs
                                        id="controlled-tab-example"
                                        activeKey={key}
                                        onSelect={(k) => setKey(k)}
                                        className="mb-3"
                                    >
                                        <Tab eventKey="question" title="Question">
                                            <div dangerouslySetInnerHTML={{ __html: question }} />
                                        </Tab>
                                        <Tab eventKey="answer" title="Answer">
                                            <div dangerouslySetInnerHTML={{ __html: answer }} />
                                        </Tab>

                                    </Tabs>
                                </div>
                            </Container>
                        </Accordion.Body>
                        {!selected ?
                            <Button className='py-2 w-100' style={{ borderRadius: '0  0 5px 5px' }} onClick={handleAddQuestion}>Add Question</Button>
                            :
                            <Button className='py-2 w-100' style={{ borderRadius: '0  0 5px 5px' }} onClick={handleRemoveQuestion} variant="danger">Remove Question</Button>
                        }
                    </Accordion.Item>
                </Accordion>

            </div>

        )
    }

    return (
        <div className='card my-4 w-100'>
            <Container className={`my-0 d-flex flex-column gap-4 p-3 bg-gradient ${!selected ? 'questionUnselected' : 'questionSelected'}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedQuestion(data)}>
                <Container className='p-0 d-flex justify-content-between'>
                    <h4>{title}</h4>
                    <p><b>{marks}</b> Marks</p>
                </Container>
                <Container className='d-flex p-0 gap-3' style={{ minWidth: '200px', flexWrap: 'wrap' }}>
                    <Badge pill>Topic: {topicId?.name}</Badge>
                    <Badge pill>Course ID: {courseId}</Badge>
                    <Badge pill>{questionTypeId?.name}</Badge>
                    <Badge pill>{boardId?.name} - {levelId?.name}</Badge>
                    <Badge pill>{subjectId?.name}</Badge>
                </Container>
                <Container className='d-flex gap-3 p-0' style={{ flexWrap: 'war' }}>
                    <b>Tags:</b>
                    {description.map((desc, index) => {
                        return <p>{desc}</p>
                    })}
                </Container>

            </Container>
            {!selected ?
                <Button className='py-2' style={{ borderRadius: '0  0 5px 5px' }} onClick={handleAddQuestion}>Add Question</Button>
                :
                <Button className='py-2' style={{ borderRadius: '0  0 5px 5px' }} onClick={handleRemoveQuestion} variant="danger">Remove Question</Button>
            }
        </div>
    )
}

export default Question