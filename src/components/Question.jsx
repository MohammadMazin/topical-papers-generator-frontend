import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge';


const Question = ({ data, setSelectedQuestion, handleAddQuestion, handleRemoveQuestion }) => {
    const { title, description, marks, topicId, questionTypeId, boardId, levelId, subjectId, paid, _id, selected } = data

    return (
        <div className='card my-4'>
            <Container className={`my-0 d-flex flex-column gap-4 p-3 bg-gradient ${!selected ? 'questionUnselected' : 'questionSelected'}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedQuestion(data)}>
                <Container className='p-0 d-flex justify-content-between'>
                    <h4>{title}</h4>
                    <p><b>{marks}</b> Marks</p>
                </Container>
                <Container className='d-flex p-0 gap-3' >
                    <Badge pill>Topic: {topicId?.name}</Badge>
                    <Badge pill>{questionTypeId?.name}</Badge>
                    <Badge pill>{boardId?.name} - {levelId?.name}</Badge>
                    <Badge pill>{subjectId?.name}</Badge>
                </Container>
                <div dangerouslySetInnerHTML={{ __html: description }} />
            </Container>
            {!selected ?
                <Button className='py-2' style={{ borderRadius: '0  0 5px 5px' }} onClick={handleAddQuestion}>Add Question</Button>
                :
                <Button className='py-2' style={{ borderRadius: '0  0 5px 5px' }} onClick={handleRemoveQuestion} variant="danger">Remove Question</Button>
            }
        </div>
    )
}

export default Question