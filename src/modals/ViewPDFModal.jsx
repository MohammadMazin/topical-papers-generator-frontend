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


    const pxToMm = (num) => num * 0.264583333;

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



        var pagesToRemove = [1]
        let questionAdded = []

        var skipNext = false

        for (let i = 0; i < childDivs.length; i++) {

            if (skipNext) {
                skipNext = false
                continue
            }

            const question = document.getElementById(`question${i}`)

            await html2canvas(question, {
                scale: 2
                // eslint-disable-next-line no-loop-func
            }).then(function (canvas) {
                doc.addPage();

                var imgData = canvas.toDataURL('image/jpeg');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = pxToMm(question.offsetHeight);
                var heightLeftToPrint = imgHeight;

                var position = 0;

                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeftToPrint -= pageHeight;
                questionAdded.push(i)

                // If question does not fit in single page
                while (heightLeftToPrint > 0) {
                    position = heightLeftToPrint - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'SLOW');
                    heightLeftToPrint -= pageHeight;
                }

                // check if next question fits in available free space of page
                var spaceRemaining = heightLeftToPrint * -1
                const nextQuestion = document.getElementById(`question${i + 1}`)
                if ((pxToMm(nextQuestion?.offsetHeight)) < spaceRemaining) {
                    html2canvas(nextQuestion, {
                        scale: 2
                    }).then(function (canvas) {
                        var imgData = canvas.toDataURL('image/jpeg');
                        var imgWidth = 210;
                        var imgHeight = pxToMm(nextQuestion.offsetHeight);
                        // doc.addImage(imgData, 'JPEG', 0, pxToMm(question.offsetHeight), imgWidth, imgHeight);
                        console.log(pageHeight - spaceRemaining)
                        doc.addImage(imgData, 'JPEG', 0, pageHeight - spaceRemaining, imgWidth, imgHeight);
                    }
                    ).then(skipNext = true)
                }
            });


        }
        doc.deletePage(1)

        const pages = doc.internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.width;  //Optional
        const pageHeight = doc.internal.pageSize.height;  //Optional
        doc.setFontSize(12);  //Optional
        for (let j = 1; j < pages + 1; j++) {
            let horizontalPos = pageWidth / 2;  //Can be fixed number
            let verticalPos = pageHeight - 10;  //Can be fixed number
            doc.setPage(j);
            doc.text(`${j} of ${pages}`, horizontalPos, verticalPos, { align: 'center' });
        }

        doc.save('Questions.pdf')
        setKey('answer')
    }


    // const saveAnswersPdf = async () => {
    //     window.html2canvas = html2canvas;
    //     window.scrollTo(0, 0);

    //     var dateObj = new Date();
    //     var month = dateObj.getUTCMonth() + 1; //months from 1-12
    //     var day = dateObj.getUTCDate();
    //     var year = dateObj.getUTCFullYear();

    //     const newdate = year + "/" + month + "/" + day;

    //     await html2canvas(document.getElementById("answers"), {
    //         scale: 3
    //     }).then(function (canvas) {
    //         let h = document.querySelector('#answers').offsetHeight;
    //         let w = document.querySelector('#answers').offsetWidth;
    //         var uri = canvas.toDataURL()
    //         var doc = new jsPDF('p', 'px', [w, h]);
    //         doc.addImage(uri, 'JPEG', 0, 0, w, h)
    //         doc.save('Answers ' + newdate + ' - Topical Papers Generator.pdf');
    //         clearSelectedQuestions()
    //         handleClose()
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

        var childDivs = document.getElementById('answers').children
        var doc = new jsPDF('p', 'mm', undefined, undefined, true);



        var pagesToRemove = [1]
        let questionAdded = []

        var skipNext = false

        for (let i = 0; i < childDivs.length; i++) {

            if (skipNext) {
                skipNext = false
                continue
            }

            const answer = document.getElementById(`answer${i}`)

            await html2canvas(answer, {
                scale: 2
                // eslint-disable-next-line no-loop-func
            }).then(function (canvas) {
                doc.addPage();

                var imgData = canvas.toDataURL('image/jpeg');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = pxToMm(answer.offsetHeight);
                var heightLeftToPrint = imgHeight;

                var position = 0;

                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeftToPrint -= pageHeight;
                questionAdded.push(i)

                // If answer does not fit in single page
                while (heightLeftToPrint > 0) {
                    position = heightLeftToPrint - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'SLOW');
                    heightLeftToPrint -= pageHeight;
                }

                // check if next answer fits in available free space of page
                var spaceRemaining = heightLeftToPrint * -1
                const nextQuestion = document.getElementById(`answer${i + 1}`)
                if ((pxToMm(nextQuestion?.offsetHeight)) < spaceRemaining) {
                    html2canvas(nextQuestion, {
                        scale: 2
                    }).then(function (canvas) {
                        var imgData = canvas.toDataURL('image/jpeg');
                        var imgWidth = 210;
                        var imgHeight = pxToMm(nextQuestion.offsetHeight);
                        // doc.addImage(imgData, 'JPEG', 0, pxToMm(answer.offsetHeight), imgWidth, imgHeight);
                        console.log(pageHeight - spaceRemaining)
                        doc.addImage(imgData, 'JPEG', 0, pageHeight - spaceRemaining, imgWidth, imgHeight);
                    }
                    ).then(skipNext = true)
                }
            });


        }
        doc.deletePage(1)

        const pages = doc.internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.width;  //Optional
        const pageHeight = doc.internal.pageSize.height;  //Optional
        doc.setFontSize(12);  //Optional
        for (let j = 1; j < pages + 1; j++) {
            let horizontalPos = pageWidth / 2;  //Can be fixed number
            let verticalPos = pageHeight - 10;  //Can be fixed number
            doc.setPage(j);
            doc.text(`${j} of ${pages}`, horizontalPos, verticalPos, { align: 'center' });
        }
        doc.save('Answers.pdf')
        clearSelectedQuestions()
        handleClose()
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
                                <div id="questions" style={{ width: '210mm', padding: '0 10px' }}>
                                    {selectedQuestions.map((question, index) => {
                                        return (
                                            // <div id={`question${index}`} style={{ minHeight: '297mm', maxHeight: 'max-content', borderBottom: '1px solid gray' }}>
                                            <div id={`question${index}`} style={{ textAlign: 'left' }}>
                                                <b>{index + 1})</b>
                                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </Container>
                        </Tab>
                        <Tab eventKey="answer" title="Answer">
                            <div id="answers" style={{ minWidth: '210mm', width: 'max-content', aspectRatio: '1/1.414' }}>
                                {selectedQuestions.map((question, index) => {
                                    return (
                                        <div id={`answer${index}`} style={{ textAlign: 'left' }} >
                                            <b>Question {index + 1}</b>
                                            <div dangerouslySetInnerHTML={{ __html: question.answer }} style={{ width: '100%' }} />
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