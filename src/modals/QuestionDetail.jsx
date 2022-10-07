import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const QuestionDetail = ({ data, show, handleClose }) => {

    const { answer, question } = data

    const [key, setKey] = useState('question')

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Question Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Container className="bg-white mt-4">
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="question" title="Question">
                            <Container id="questions" className='p-5 w-100' style={{ wordWrap: 'break-word' }}>
                                <div id="answers" className='p-4'>
                                    <div dangerouslySetInnerHTML={{ __html: question }} />
                                </div>
                            </Container>
                        </Tab>
                        <Tab eventKey="answer" title="Answer">
                            <div id="answers" className='p-4'>
                                <div dangerouslySetInnerHTML={{ __html: answer }} />
                            </div>
                        </Tab>

                    </Tabs>
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

export default QuestionDetail