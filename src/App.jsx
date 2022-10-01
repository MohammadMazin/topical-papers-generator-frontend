import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import './App.css';
import Router from './Router';


function App() {
  return (
    <>
      <Router />
      <ToastContainer className={'toast-position'} />
    </>

  );
}

export default App;
