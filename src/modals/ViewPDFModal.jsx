import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

const ViewPDFModal = ({ show, handleClose, selectedQuestions, clearSelectedQuestions }) => {

    const [key, setKey] = useState('question')

    const generatePDF = () => {
        try {

            let docQuestions = new jsPDF("p", "pt", "a4");
            docQuestions.html(document.querySelector("#questions"), {
                callback: function (pdf) {
                    pdf.save("queestions.pdf");
                }
            })

            let docAnswers = new jsPDF("p", "pt", "a4");
            docAnswers.html(document.querySelector("#answers"), {
                callback: function (pdf) {
                    pdf.save("answers.pdf");
                    clearSelectedQuestions()
                    handleClose()
                }
            })

        } catch (error) {
            console.log(error)
            toast.error('Failed to generate PDFs')
        }

    }

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
                            <Container id="questions" className='p-5 w-100' style={{ wordWrap: 'break-word' }}>
                                <div className='w-75'>
                                    {selectedQuestions.map((question, index) => {
                                        return (
                                            <>
                                                <b>{index + 1}</b>
                                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                                <hr />
                                            </>
                                        )
                                    })}
                                </div>
                            </Container>
                        </Tab>
                        <Tab eventKey="answer" title="Answer">
                            <div id="answers" className='p-4'>
                                {selectedQuestions.map((question, index) => {
                                    return (
                                        <>
                                            <b>Question {index + 1}</b>
                                            <div dangerouslySetInnerHTML={{ __html: question.answer }} />
                                            <hr />
                                        </>
                                    )
                                })}
                            </div>
                        </Tab>

                    </Tabs>
                </Container>




            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={generatePDF}>
                    Generate PDF
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewPDFModal