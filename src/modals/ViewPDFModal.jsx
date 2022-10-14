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


    // const saveQuestionsPdf = async () => {
    //     // window.html2canvas = html2canvas;
    //     // window.scrollTo(0, 0);

    //     // var dateObj = new Date();
    //     // var month = dateObj.getUTCMonth() + 1; //months from 1-12
    //     // var day = dateObj.getUTCDate();
    //     // var year = dateObj.getUTCFullYear();

    //     // const newdate = year + "/" + month + "/" + day;

    //     // var childDivs = document.getElementById('questions').children




    //     window.html2canvas = html2canvas;
    //     window.scrollTo(0, 0);

    //     var dateObj = new Date();
    //     var month = dateObj.getUTCMonth() + 1; //months from 1-12
    //     var day = dateObj.getUTCDate();
    //     var year = dateObj.getUTCFullYear();

    //     const newdate = year + "/" + month + "/" + day;

    //     var childDivs = document.getElementById('questions').children
    //     var doc = new jsPDF('p', 'mm', undefined, undefined, true);

    //     for (let i = 0; i < childDivs.length; i++) {

    //         await html2canvas(document.getElementById(`question${i}`), {
    //             scale: 2
    //         }).then(function (canvas) {
    //             var imgData = canvas.toDataURL('image/jpeg');
    //             var imgWidth = 210;
    //             var pageHeight = 295;
    //             var imgHeight = canvas.height * imgWidth / canvas.width;
    //             var heightLeft = imgHeight;

    //             var position = 0;

    //             doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    //             heightLeft -= pageHeight;

    //             while (heightLeft >= 0) {
    //                 position = heightLeft - imgHeight;
    //                 doc.addPage();
    //                 doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'SLOW');
    //                 heightLeft -= pageHeight;
    //             }

    //         });


    //     }
    //     doc.save('file.pdf')
    // }
    const saveQuestionsPdf = async () => {
        // window.html2canvas = html2canvas;
        // window.scrollTo(0, 0);

        // var dateObj = new Date();
        // var month = dateObj.getUTCMonth() + 1; //months from 1-12
        // var day = dateObj.getUTCDate();
        // var year = dateObj.getUTCFullYear();

        // const newdate = year + "/" + month + "/" + day;

        // var childDivs = document.getElementById('questions').children




        window.html2canvas = html2canvas;
        window.scrollTo(0, 0);

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const newdate = year + "/" + month + "/" + day;

        var childDivs = document.getElementById('questions').children
        var doc = new jsPDF('p', 'mm', undefined, undefined, true);

        var skipNext = false

        var pagesToRemove = [1]

        for (let i = 0; i < childDivs.length; i++) {

            const question = document.getElementById(`question${i}`)
            await html2canvas(question, {
                scale: 2
                // eslint-disable-next-line no-loop-func
            }).then(function (canvas) {
                doc.addPage();

                var imgData = canvas.toDataURL('image/jpeg');

                var imgWidth = 210;
                var pageHeight = 295;

                // var imgHeight = canvas.height * imgWidth / canvas.width;
                var imgHeight = question.offsetHeight * 0.2645833333;
                var heightLeftToPrint = imgHeight;

                var position = 0;
                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeftToPrint -= pageHeight;


                while (heightLeftToPrint > 0) {
                    position = heightLeftToPrint - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'SLOW');
                    heightLeftToPrint -= pageHeight;
                }


                // check if next question fits
                var spaceRemaining = heightLeftToPrint * -1
                const nextQuestion = document.getElementById(`question${i + 1}`)
                if ((nextQuestion?.offsetHeight * 0.2645833333) < spaceRemaining) {
                    html2canvas(nextQuestion, {
                        scale: 2
                    }).then(function (canvas) {
                        var imgData = canvas.toDataURL('image/jpeg');
                        var imgWidth = 210;
                        var imgHeight = nextQuestion.offsetHeight * 0.2645833333;
                        doc.addImage(imgData, 'JPEG', 0, question.offsetHeight * 0.2645833333, imgWidth, imgHeight);
                        skipNext = true
                        i++
                        pagesToRemove.push(i + 2)
                    }
                    )
                }


            });


        }
        console.log(pagesToRemove)
        for (var i = pagesToRemove.length - 1; i >= 0; i--)
            doc.deletePage(pagesToRemove[i])
        doc.save('file.pdf')
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
                            <Container className='p-5 w-100 d-flex justify-content-center' style={{ wordWrap: 'break-word' }}>
                                <div id="questions" className='' style={{ width: '210mm', padding: '0 10px' }}>
                                    {selectedQuestions.map((question, index) => {
                                        return (
                                            // <div id={`question${index}`} style={{ minHeight: '297mm', maxHeight: 'max-content', borderBottom: '1px solid gray' }}>
                                            <div id={`question${index}`} style={{ borderBottom: '1px solid gray' }}>
                                                <b>Question {index + 1}</b>
                                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
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