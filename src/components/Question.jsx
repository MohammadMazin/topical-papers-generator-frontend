import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'


const Question = ({ data, setSelectedQuestion, handleAddQuestion, handleRemoveQuestion }) => {
    const { title, description, marks, selected } = data

    return (
        <div className='card my-4'>
            <Container className={`my-0 p-3 bg-gradient ${!selected ? 'questionUnselected' : 'questionSelected'}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedQuestion(data)}>
                <Container className='p-0 d-flex justify-content-between'>
                    <h4>{title}</h4>
                    <p><b>{marks}</b> Marks</p>
                </Container>
                <hr />
                {/* TODO: Do i need a dangerouslySetInnerHTML for description?*/}
                <div dangerouslySetInnerHTML={{ __html: description }} />


            </Container>
            {!selected ?
                <Button style={{ borderRadius: '0  0 5px 5px' }} onClick={handleAddQuestion}>Add Question</Button>
                :
                <Button style={{ borderRadius: '0  0 5px 5px' }} onClick={handleRemoveQuestion} variant="danger">Remove Question</Button>
            }
        </div>
    )
}

export default Question