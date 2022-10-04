import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import DashboardAdmin from './pages/dashboardAdmin'
import LoginAdmin from './pages/loginAdmin'
import AddQuestion from './pages/addQuestion'
import AddBoard from './pages/addBoard'
import AddLevel from './pages/addLevel'
import AddQuestionType from './pages/addQuestionType'
import AddSubjectCategory from './pages/addSubjectCategory'
import AddSubject from './pages/addSubject'
import AddTopic from './pages/addTopic'
import AddAdmin from './pages/addAdmin'
import Users from './pages/users'
import EditQuestion from './pages/editQuestion'
import DeleteQuestion from './pages/deleteQuestion'
import VerifyUser from './pages/verifyUser'
import { useContext, useEffect } from 'react'
import UserContext from './globals/user-data'
import NavigationBar from './components/Navigationbar'
import { Button, Container } from 'react-bootstrap'
import './App.css'

import { toast } from 'react-toastify'


function Router() {

    const { userState, setUserState } = useContext(UserContext)
    const navigate = useNavigate();


    const logOutBtnHandler = (showToast = false) => {
        if (showToast)
            toast.success('User logged out successfully')
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setUserState({ isAuth: false, token: null, userId: null })
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('_id')
        const isAdmin = localStorage.getItem("isAdmin")
        if (!token || !userId) {
            logOutBtnHandler()
            return
        }
        if (isAdmin)
            setUserState({ isAuth: true, isAdmin: true, token: token, userId: userId })
        else
            setUserState({ isAuth: true, token: token, userId: userId })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUserState])


    if (userState.data?.isAdmin || userState.isAdmin) {
        return (
            <>
                {userState.isAuth && <NavigationBar />}
                <Routes>
                    {
                        userState.isAuth && (userState.data?.isAdmin || userState.isAdmin) ?
                            <>
                                <Route path="/" element={<DashboardAdmin />} />
                                <Route path="/addQuestion" element={<AddQuestion />} />
                                <Route path="/addBoard" element={<AddBoard />} />
                                <Route path="/addLevel" element={<AddLevel />} />
                                <Route path="/addSubjectCategory" element={<AddSubjectCategory />} />
                                <Route path="/addSubject" element={<AddSubject />} />
                                <Route path="/addQuestionType" element={<AddQuestionType />} />
                                <Route path="/addTopic" element={<AddTopic />} />
                                <Route path="/edit" element={<EditQuestion />} />
                                <Route path="/delete" element={<DeleteQuestion />} />
                                <Route path="/verify-user" element={<VerifyUser />} />
                                <Route path="/users" element={<Users />} />
                                <Route path="/create-admin" element={<AddAdmin />} />
                            </> :
                            <>
                                <Route path="/" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </>
                    }
                    <Route path="*" element={<div className='heading'>
                        <Container className='d-flex flex-column '>
                            <h1>There's nothing here. You've taken a wrong turn!</h1>
                            <Button className='w-25' style={{ fontSize: '1.5rem' }} onClick={() => navigate(-1)}>Go Back</Button>
                        </Container>
                    </div>} />
                </Routes>
            </>
        );
    }

    return (
        <>
            {userState.isAuth && <NavigationBar />}
            <Routes>
                {
                    userState.isAuth ?
                        <>
                            <Route path="/" element={<Dashboard />} />
                        </> :
                        <>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login-admin" element={<LoginAdmin />} />
                        </>
                }
                <Route path="*" element={<div className='heading'>
                    <Container className='d-flex flex-column '>
                        <h1>There's nothing here. You've taken a wrong turn!</h1>
                        <Button className='w-25' style={{ fontSize: '1.5rem' }} onClick={() => navigate(-1)}>Go Back</Button>
                    </Container>
                </div>} />
            </Routes>
        </>

    );
}

export default Router;
