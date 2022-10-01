import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const ViewPDFModal = ({ show, handleClose, selectedQuestions }) => {

    const [key, setKey] = useState('question')

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Selected Questions</Modal.Title>
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
                            {selectedQuestions.map((question, index) => {
                                return (
                                    <>
                                        <b>{index + 1}</b>
                                        <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                        <hr />
                                    </>
                                )
                            })}
                        </Tab>
                        <Tab eventKey="answer" title="Answer">
                            {selectedQuestions.map((question, index) => {
                                return (
                                    <>
                                        <b>{index + 1}</b>
                                        <div dangerouslySetInnerHTML={{ __html: question.answer }} />
                                        <hr />
                                    </>
                                )
                            })}
                        </Tab>

                    </Tabs>
                </Container>




            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Generate PDF
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewPDFModal