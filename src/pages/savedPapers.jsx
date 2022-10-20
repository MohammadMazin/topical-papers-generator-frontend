import { useEffect, useState } from "react"
import Container from "react-bootstrap/Container"
import Table from "react-bootstrap/esm/Table"
import Button from "react-bootstrap/Button"
import { deleteSavedPaper, getSavedPaperOfUser } from "../services/savedPapers"
import { toast } from 'react-toastify'
import ViewPDFModal from "../modals/ViewPDFModal"
import { getQuestionsFromIds } from "../services/questions"
import Spinner from "../components/Spinner"

const SavedPapers = () => {

    const [savedPapers, setSavedPapers] = useState([])
    const [selectedPaper, setSelectedPaper] = useState(null)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true)
            const data = {
                userId: localStorage.getItem('_id')
            }
            const res = await getSavedPaperOfUser(data)
            console.log(res.data)
            if (res.success) {
                setSavedPapers(res.data)
            }
            else
                toast.error(res.message)
            setLoading(false)
        }

        fetchData()
    }, [])

    const handleShowPaper = async (paper) => {
        setName(paper.name)
        const res = await getQuestionsFromIds({ idArray: paper.paperData })
        if (res.success) {
            setShow(true)
            setSelectedPaper(res.data)
        }
        else
            toast.error('Could not load information about selected paper')

    }
    const handleHidePaper = (paper) => {
        setShow(false)
        setSelectedPaper(null)
    }

    const handleDelete = async _id => {
        setLoading(true)
        const res = await deleteSavedPaper({ _id })
        if (res.success) {
            setSavedPapers(prevPapers => prevPapers.filter(paper => paper._id !== _id))
            toast.success(res.message)
        }
        else
            toast.error('Could not delete Paper')
        setLoading(false)
    }

    return (
        <>
            <Container className='my-4'>
                {loading ? <Spinner /> :
                    <>
                        <h1> Saved Papers</h1>
                        <hr />
                        {
                            savedPapers.length === 0 ?
                                <h3>No Papers have been saved!</h3>
                                :
                                <Container className="bg-white p-0">


                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Paper Title</th>
                                                <th>Marks</th>
                                                <th>Details</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {savedPapers.map((paper, index) => {
                                                const { _id, name, marks } = paper
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{name}</td>
                                                        <td>{marks}</td>
                                                        <td><span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleShowPaper(paper)}>View Details</span></td>
                                                        <td>
                                                            <Button variant="danger" disabled={loading} onClick={() => handleDelete(_id)}>Delete</Button>
                                                        </td>
                                                    </tr>

                                                )
                                            })}


                                        </tbody>
                                    </Table>

                                </Container>
                        }
                    </>
                }
            </Container>

            {show && <ViewPDFModal show={show} handleClose={handleHidePaper} selectedQuestions={selectedPaper} fromSaved={true} title={name} />}
        </>
    )
}

export default SavedPapers