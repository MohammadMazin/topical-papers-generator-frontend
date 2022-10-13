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
import { PDFDownloadLink } from '@react-pdf/renderer'
import QuestionPDF from '../components/QuestionPDF'

const ViewPDFModal = ({ show, handleClose, selectedQuestions, clearSelectedQuestions }) => {

    const [key, setKey] = useState('question')


    const saveQuestionsPdf = async () => {
        // window.html2canvas = html2canvas;
        // window.scrollTo(0, 0);

        // var dateObj = new Date();
        // var month = dateObj.getUTCMonth() + 1; //months from 1-12
        // var day = dateObj.getUTCDate();
        // var year = dateObj.getUTCFullYear();

        // const newdate = year + "/" + month + "/" + day;

        // var childDivs = document.getElementById('questions').children



        // await html2canvas(document.getElementById(`questions`), {
        //     scale: 2
        // }).then(function (canvas) {
        //     var imgData = canvas.toDataURL('image/png');
        //     var imgWidth = 210;
        //     var pageHeight = 295;
        //     var imgHeight = canvas.height * imgWidth / canvas.width;
        //     var heightLeft = imgHeight;


        //     var doc = new jsPDF('p', 'mm', "a4");
        //     var position = 0;

        //     doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        //     heightLeft -= pageHeight;

        //     while (heightLeft >= 0) {
        //         position = heightLeft - imgHeight;
        //         doc.addPage();
        //         doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        //         heightLeft -= pageHeight;
        //     }
        //     doc.save('file.pdf')

        // });
        window.html2canvas = html2canvas;
        window.scrollTo(0, 0);

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const newdate = year + "/" + month + "/" + day;

        var childDivs = document.getElementById('questions').children
        var doc = new jsPDF('p', 'mm');

        for (let i = 0; i < childDivs.length; i++) {

            await html2canvas(document.getElementById(`question${i}`), {
                scale: 2
            }).then(function (canvas) {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;

                var position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

            });


        }
        doc.save('file.pdf')
    }


    // const saveQuestionsPdf = async () => {
    //     window.html2canvas = html2canvas;
    //     window.scrollTo(0, 0);

    //     var dateObj = new Date();
    //     var month = dateObj.getUTCMonth() + 1; //months from 1-12
    //     var day = dateObj.getUTCDate();
    //     var year = dateObj.getUTCFullYear();

    //     const newdate = year + "/" + month + "/" + day;

    //     await html2canvas(document.getElementById("questions"), {
    //         scale: 3
    //     }).then(function (canvas) {
    //         let h = document.querySelector('#questions').offsetHeight;
    //         let w = document.querySelector('#questions').offsetWidth;
    //         var uri = canvas.toDataURL()
    //         var doc = new jsPDF('p', 'px', [w, h]);
    //         doc.addImage(uri, 'JPEG', 0, 0, w, h)
    //         doc.save('Questions ' + newdate + ' - Topical Papers Generator.pdf');
    //         setKey('answer')
    //     });
    // }


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
        <Modal show={show} onHide={handleClose} fullscreen={true}>
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
                            <Container className='p-5 w-100' style={{ wordWrap: 'break-word' }}>
                                <div id="questions" className='' style={{ width: '210mm', padding: '0 10px' }}>
                                    {selectedQuestions.map((question, index) => {
                                        return (
                                            <div id={`question${index}`} style={{ minHeight: '297mm', maxHeight: 'max-content' }}>
                                                <b>Question {index + 1}</b>
                                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                                <hr />
                                            </div>
                                        )
                                    })}
                                </div>
                            </Container>
                        </Tab>
                        <Tab eventKey="answer" title="Answer">
                            <div id="answers" className='p-1'>
                                {selectedQuestions.map((question, index) => {
                                    return (
                                        <div style={{ width: '210mm', height: '350mm', backgroundColor: 'pink' }} >
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