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

    const savePdf = () => {
        window.html2canvas = html2canvas;

        window.scrollTo(0, 0);

        // Convert the div to image (canvas)
        html2canvas(document.getElementById("questions")).then(function (canvas) {

            let h = document.querySelector('#questions').offsetHeight;
            let w = document.querySelector('#questions').offsetWidth;

            // Get the image data as JPEG and 0.9 quality (0.0 - 1.0)
            var uri = canvas.toDataURL()
            var filename = 's.png'

            var link = document.createElement('a');

            if (typeof link.download === 'string') {
                link.href = uri;
                link.download = filename;
                //Firefox requires the link to be in the body
                document.body.appendChild(link);
                //simulate click
                link.click();
                //remove the link when done
                document.body.removeChild(link);

                var doc = new jsPDF('p', 'px', [w, h]);
                doc.addImage(uri, 'JPEG', 0, 0, w, h)
                doc.save('samplssse-file.pdf');



            } else {

                window.open(uri);

            }

        });

        // var w = document.querySelector("#questions").offsetWidth;
        // var h = document.querySelector("#questions").offsetHeight;
        // console.log(w, h)
        // html2canvas(document.querySelector("#questions"), {
        //     useCORS: true,
        //     dpi: 300, // Set to 300 DPI
        //     scale: 3, // Adjusts your resolution
        //     onrendered: function (canvas) {
        // var img = canvas.toDataURL("image/jpeg", 1);
        // console.log('1')
        // var doc = new jsPDF('L', 'px', [w, h]);
        // console.log('2')
        // doc.addImage(img, 'JPEG', 0, 0, w, h);
        // console.log('3')
        // doc.save('sample-file.pdf');
        // console.log('4')
        //     }
        // });
        // console.log('first')

    }


    const generatePDF = () => {
        try {
            var w = document.querySelector("#questions").offsetWidth;
            var h = document.querySelector("#questions").offsetHeight;
            let docQuestions = new jsPDF("p", "px", "a3");
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
            toast.error('Failed to generate PDFs')
        }

    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Selected Questions</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Container className="bg-white mt-4" >
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
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
                <Button variant="primary" onClick={savePdf}>
                    Generate PDF
                </Button>
            </Modal.Footer>
        </Modal >
    )
}

export default ViewPDFModal