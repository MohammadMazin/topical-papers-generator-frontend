import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2PDF from 'jspdf-html2canvas'
import { toast } from 'react-toastify';

const ViewPDFModal = ({ show, handleClose, selectedQuestions, clearSelectedQuestions }) => {

    const [key, setKey] = useState('question')

    const saveQuestionsPdf = async () => {
        window.html2canvas = html2canvas;
        window.scrollTo(0, 0);

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const newdate = year + "/" + month + "/" + day;

        console.log(window.Document)
        await html2canvas(document.getElementById("questions"), {
            scale: 3
        }).then(function (canvas) {
            let h = document.querySelector('#questions').offsetHeight;
            let w = document.querySelector('#questions').offsetWidth;
            var uri = canvas.toDataURL()
            var doc = new jsPDF('p', 'px', [w, h]);
            doc.addImage(uri, 'JPEG', 0, 0, w, h)
            doc.save('Questions ' + newdate + ' - Topical Papers Generator.pdf');
            setKey('answer')
        });
    }

    const saveAnswersPdf = async () => {
        window.html2canvas = html2canvas;
        window.scrollTo(0, 0);

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const newdate = year + "/" + month + "/" + day;

        await html2canvas(document.getElementById("answers"), {
            scale: 3
        }).then(function (canvas) {
            let h = document.querySelector('#answers').offsetHeight;
            let w = document.querySelector('#answers').offsetWidth;
            var uri = canvas.toDataURL()
            var doc = new jsPDF('p', 'px', [w, h]);
            doc.addImage(uri, 'JPEG', 0, 0, w, h)
            doc.save('Answers ' + newdate + ' - Topical Papers Generator.pdf');
            clearSelectedQuestions()
            handleClose()
        });
    }


    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Selected Questions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                    {
                        key === "question" ?
                            <Button variant="primary" onClick={saveQuestionsPdf}>
                                Generate Questions PDF
                            </Button>
                            :
                            <Button variant="primary" onClick={saveAnswersPdf}>
                                Generate Answers PDF
                            </Button>
                    }
                </Modal.Footer>

                <Container className="bg-white mt-4" >
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                        transition={false}
                    >
                        <Tab eventKey="question" title="Question" style={{ backgroundColor: 'light-blue' }}>
                            <Container id="questions" className='p-5 w-100' style={{ wordWrap: 'break-word' }}>
                                <div className='w-75'>
                                    {selectedQuestions.map((question, index) => {
                                        return (
                                            <>
                                                <b>Question {index + 1}</b>
                                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                                <hr />
                                            </>
                                        )
                                    })}
                                </div>
                            </Container>
                        </Tab>
                        <Tab eventKey="answer" title="Answer">
                            <div id="answers" className=''>
                                {selectedQuestions.map((question, index) => {
                                    return (
                                        <div style={{ width: '100%' }} >
                                            <b>Question {index + 1}</b>
                                            <div dangerouslySetInnerHTML={{ __html: question.answer }} style={{ width: '100%' }} />
                                            <hr />
                                        </div>
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
                {
                    key === "question" ?
                        <Button variant="primary" onClick={saveQuestionsPdf}>
                            Generate Questions PDF
                        </Button>
                        :
                        <Button variant="primary" onClick={saveAnswersPdf}>
                            Generate Answers PDF
                        </Button>
                }

            </Modal.Footer>
        </Modal >
    )
}

export default ViewPDFModal