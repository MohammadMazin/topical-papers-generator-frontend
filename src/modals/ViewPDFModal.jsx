import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Form from 'react-bootstrap/Form';
import html2PDF from 'jspdf-html2canvas'
import { toast } from 'react-toastify';
import { PDFDownloadLink } from '@react-pdf/renderer'
import QuestionPDF from '../components/QuestionPDF'
import { addSavedPaper } from '../services/savedPapers';

const ViewPDFModal = ({ show, handleClose, selectedQuestions, clearSelectedQuestions, fromSaved = false, title }) => {

    const [key, setKey] = useState('question')
    const [titlePage, setTitlePage] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [showPreview, setShowPreview] = useState(null)

    const [schoolName, setSchoolName] = useState('')
    const [courseTitle, setCourseTitle] = useState('')
    const [courseCode, setCourseCode] = useState('')
    const [paperType, setPaperType] = useState('')
    const [paperVariant, setPaperVariant] = useState('')
    const [examDate, setExamDate] = useState('')
    const [totalTime, setTotalTime] = useState('')

    const [saved, setSaved] = useState(false)
    const [name, setName] = useState(fromSaved ? title : '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!selectedFile) {
            return
        }

        let previewArray = []
        for (let i = 0; i < selectedFile.length; i++) {
            previewArray.push(URL.createObjectURL(selectedFile[i]))
        }

        setPreview(previewArray)
        setShowPreview(true)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(previewArray)
    }, [selectedFile])

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

        let questionAdded = []
        var skipNext = false

        if (titlePage) {

            // check if all fields have value in title page


            if (schoolName === '' || courseTitle === '' || courseCode === '' || paperType === '' || paperVariant === '' || examDate === '' || totalTime === '') {
                toast.error('Please fill all the fields in the title page')
                return
            }

            if (showPreview === null) {
                toast.error('Please upload a logo!')
                return
            }

            const titlePage = document.getElementById('titlePage')
            await html2canvas(titlePage, {
                scale: 2
            }).then(function (canvas) {
                doc.addPage()
                var imgData = canvas.toDataURL('image/jpeg');
                var imgWidth = 210;
                var imgHeight = pxToMm(titlePage.offsetHeight);
                var position = 0
                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            })
        }

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
                        // var imgWidthQ = 210;
                        var imgWidthQ = pxToMm(nextQuestion.offsetWidth);
                        var imgHeightQ = pxToMm(nextQuestion.offsetHeight);
                        // doc.addImage(imgData, 'JPEG', 0, pxToMm(question.offsetHeight), imgWidthQ, imgHeightQ);
                        doc.addImage(imgData, 'JPEG', 0, pageHeight - spaceRemaining, imgWidthQ, imgHeightQ);


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
        var skipNext = false

        var pagesToRemove = [1]
        let questionAdded = []


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

    const onSelectFile = (e) => {
        //on upload
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files)
    }

    const calculateTotalExamMarks = () => {
        return selectedQuestions.reduce((prev, current) => prev + current.marks, 0)
    }


    const handleSavePaper = async () => {

        if (name === '') {
            toast.error('Enter a Title to save your paper')
            return
        }

        setLoading(true)
        const data = {
            userId: localStorage.getItem('_id'),
            name,
            paperData: selectedQuestions.map((question) => question._id),
            marks: calculateTotalExamMarks(),
        }

        const res = await addSavedPaper(data)
        if (res.success) {
            toast.success(res.message)
            setSaved(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    return (
        <Modal show={show} onHide={handleClose} fullscreen={true}>
            <Modal.Header closeButton>
                <Container className='d-flex flex-column'>

                    <Modal.Title>Selected Questions</Modal.Title>
                    {
                        !localStorage.getItem("isGuest") &&
                        <>
                            <Container className='d-flex p-0 mt-3'>
                                <Form.Control
                                    className='p-0'
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    disabled={fromSaved}
                                    type="text"
                                    placeholder="Enter Paper Title"
                                    style={{ border: 'none', flex: 8, borderRadius: 0, borderBottom: '1px solid gray ', fontSize: '2rem' }}
                                />
                                <Button style={{ flex: 1, height: 'max-content', margin: 'auto 0 auto 1rem' }} disabled={saved || loading || fromSaved} onClick={handleSavePaper}>Save Paper</Button>
                            </Container>
                        </>
                    }
                </Container>
            </Modal.Header>
            <Modal.Body>

                <Container className="bg-white mt-4" >
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                        transition={false}
                    >
                        <Tab eventKey="question" title="Question" style={{ backgroundColor: 'light-blue' }}>
                            <Container className='p-5 w-100 d-flex flex-column align-items-center' style={{ wordWrap: 'break-word' }}>

                                {
                                    titlePage && (
                                        <>
                                            <div className='w-50 pb-3' style={{ borderBottom: '1px solid black' }}>

                                                <label for="file-upload" className="uploadButton">
                                                    Upload Images
                                                </label>
                                                <input id="file-upload" onChange={onSelectFile} type="file" accept=".jpg, .png" />
                                            </div>
                                            <div id="titlePage" style={{ width: '210mm', height: '297mm', padding: '0 10px' }}>

                                                <Container className='d-flex flex-column mt-5 align-items-center h-100 gap-4'>
                                                    {showPreview ?
                                                        <img className="file" src={preview} alt="school logo" style={{ width: '25%', height: 'auto' }} />
                                                        :
                                                        <div style={{ width: '25%', padding: '3rem 0', border: '1px dashed black' }}><b>LOGO</b></div>
                                                    }
                                                    <span style={{ width: '100%', padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} >
                                                        <b>School Name: </b> <Form.Control className='p-0' onChange={(e) => setSchoolName(e.target.value)} type="text" placeholder="Enter School Name" style={{ border: 'none' }} />
                                                    </span>
                                                    <Container className='p-0 d-flex gap-3'>
                                                        <span style={{ flex: 1, padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} ><b>Course Title:</b> <Form.Control className='p-0' onChange={(e) => setCourseTitle(e.target.value)} type="text" placeholder="Ex: (Computer Science)" style={{ border: 'none' }} /> </span>
                                                        <span style={{ flex: 1, padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} ><b>Course Code:</b> <Form.Control className='p-0' onChange={(e) => setCourseCode(e.target.value)} type="text" placeholder="Ex: (2201)" style={{ border: 'none' }} /> </span>
                                                    </Container>
                                                    <Container className='p-0 d-flex gap-3'>
                                                        <span style={{ flex: 1, padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} ><b>Paper Type:</b> <Form.Control className='p-0' onChange={(e) => setPaperType(e.target.value)} type="text" placeholder="Ex: (Part 1 Theory)" style={{ border: 'none' }} /> </span>
                                                        <span style={{ flex: 1, padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} ><b>Paper Variant:</b> <Form.Control className='p-0' onChange={(e) => setPaperVariant(e.target.value)} type="text" placeholder="Ex: (12)" style={{ border: 'none' }} /> </span>
                                                    </Container>
                                                    <span style={{ width: '100%', padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} >
                                                        <b>Exam Date: </b> <Form.Control className='p-0' onChange={(e) => setExamDate(e.target.value)} type="text" placeholder="DD/MM/YY" style={{ border: 'none' }} />
                                                    </span>
                                                    <Container className='p-0 d-flex gap-3'>
                                                        <span style={{ flex: 1, padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} ><b>Total Marks:</b> {calculateTotalExamMarks()} </span>
                                                        <span style={{ flex: 1, padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} ><b>Total Time:</b> <Form.Control className='p-0' onChange={(e) => setTotalTime(e.target.value)} type="text" placeholder="2 Hours 30 Minutes" style={{ border: 'none' }} /> </span>
                                                    </Container>
                                                    <hr />
                                                    <span style={{ width: '100%', padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} >Name: </span>
                                                    <span style={{ width: '100%', padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} >Class:</span>
                                                    <span style={{ width: '100%', padding: ' 0.8rem 1rem', border: '1px solid black', textAlign: 'left' }} >Registration Number:</span>
                                                </Container>
                                            </div>
                                        </>

                                    )
                                }

                                <div id="questions" style={{ width: '210mm', padding: '0 10px' }}>
                                    {selectedQuestions.map((question, index) => {

                                        if (index + 1 === selectedQuestions.length)
                                            return (
                                                <>
                                                    <div id={`question${index}`} style={{}}>
                                                        <b>{index + 1})</b>
                                                        <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                                    </div>
                                                    <div id={`question${index + 1}`} style={{}}>
                                                        <hr />
                                                    </div>
                                                </>
                                            )

                                        return (
                                            <div id={`question${index}`} style={{}}>
                                                <b>Question {index + 1})</b>
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

                                    if (index + 1 === selectedQuestions.length)
                                        return (
                                            <>
                                                <div id={`answer${index}`} style={{ textAlign: 'left' }}>
                                                    <b>{index + 1})</b>
                                                    <div dangerouslySetInnerHTML={{ __html: question.answer }} />
                                                </div>
                                                <div id={`answer${index + 1}`} style={{ textAlign: 'left' }}>
                                                    <hr />
                                                </div>
                                            </>
                                        )
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
                {
                    !localStorage.getItem("isGuest") &&
                    <>
                        <Form.Check
                            value={titlePage}
                            type="switch"
                            id="title page"
                            label="Include Title Page"
                            onChange={(e) => setTitlePage(e.target.checked)}
                        />
                    </>
                }

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