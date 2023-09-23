import React, { useEffect} from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Badge, Button, Card } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import MainScreen from '../../components/MainScreen'
import Accordion from 'react-bootstrap/Accordion';
import './MyNotes.css'
import axios from "axios"
import { deleteNoteAction, listNotes } from '../../actions/notesActions'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

const MyNotes = ({search}) => {
    const dispatch = useDispatch();
    const noteList = useSelector(state => state.noteList);
    const { loading, notes, error } = noteList;

    // const [ notes, setNotes] = useState([])
    const userLogin = useSelector((state) => state.userLogin);
    const {userInfo} = userLogin; 

    const noteCreate = useSelector((state) => state.noteCreate);
    const { success : successCreate } = noteCreate;

    const noteUpdate = useSelector((state) => state.noteUpdate);
    const { success: successUpdate } = noteUpdate;

    const noteDelete = useSelector((state) => state.noteDelete);
    const {loading: loadingDelete, error: errorDelete, success: successDelete} = noteDelete;

    const deleteHandler = (id) => {
        if(window.confirm("Are you sure ?")){
            dispatch(deleteNoteAction(id));
        }
    }

    // const fetchNotes = async() => {
    //     const {data}= await axios.get("http://localhost:5000/api/notes");
    //     setNotes(data);
    // }

    // console.log(notes);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(listNotes());
        if(!userInfo){
          navigate('/')
        }
    }, [dispatch, userInfo, successCreate, successUpdate, successDelete])

    return (<MainScreen title={`Welcome back ${userInfo? userInfo.name: "user"}`}>
    <Link to="/createnote">
        <Button style={{marginLeft: 10, marginBottom: 6}} size="lg">
            Create New Note
        </Button>
    </Link>

    {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
    {errorDelete && (
      <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
    )}
    {loadingDelete && <Loading />}
    {loading && <Loading/>}
    {notes?.reverse().filter(filteredNote =>(
      filteredNote.title.toLowerCase().includes(search.toLowerCase())
    )).map((note) => (
        <Accordion key={note._id}>
          <Card style={{ margin: 10 }}>
            <Accordion.Header style={{outline : "none"}}>
                <Card.Header style={{display: 'flex'}}>
                        <span
                            className="note-header"
                            style={{
                            color: "black",
                            textDecoration: "none",
                            flex: 1,
                            cursor: "pointer",
                            alignSelf: "center",
                            fontSize: 18,
                            width: '950px',
                            textAlign: "left",
                        }}
                        >
                            {note.title}
                        </span>
                    {/* </div> */}
                    <div>
                        <Button href={`/note/${note._id}`}>Edit</Button>
                        <Button
                        variant="danger"
                        className="nx-2"
                        onClick={() => deleteHandler(note._id)}
                        style={{marginLeft: '4px'}}
                        >
                        Delete
                        </Button>
                    </div>
                </Card.Header>
                            </Accordion.Header>
            <Accordion.Body>
              <Card.Body>
                <h4>
                  {/* <Badge variant='success' style={{ fontSize: 15 }}>
                    Catagory - {note.category}
                  </Badge> */}
                    <span class="badge rounded-pill bg-success">{note.category}</span>
                </h4>

                <blockquote className="blockquote mb-0">
                  <p>{note.content}</p>
                  <footer className="blockquote-footer">
                    Created On {""}
                    <cite title="Source Title">
                      {note.createdAt.substring(0,10)}
                    </cite>
                  </footer>
                </blockquote>
              </Card.Body>
            </Accordion.Body>
          </Card>
        </Accordion>
      ))}

        
  </MainScreen>);
}

export default MyNotes