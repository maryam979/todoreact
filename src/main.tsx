import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './redux/store';
import App from './App';
import './index.css';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import Mytodos from './pages/Mytodos';
import Favorite from './pages/Favorite';
import RemindedTodo from './pages/RemindedTodo';
import Todos from './pages/Todos';
import TodoDetail from './pages/TodoDetail';
import LoginPage from './pages/LoginPage';
import PermittedRoute from './PermittedRoute';
import { useAppDispatch } from './redux/hooks';
import authSlice, { loginAction } from './redux/authSlice';
import { apiGetMe } from './services/auth/api';

const Main = () => {
  const dispatch = useAppDispatch()
  const [element,setElment] = React.useState(<></>)
  React.useEffect(()=>{
    console.log('hhhhhhhhhhhhhhhhhh');
    
    apiGetMe().then(res=>{
      dispatch(authSlice.actions.setUser(res.data))
    }).catch(()=>{

    }).finally(()=>{
      setElment(<Outlet />)
    })
  },[])
  return element
}

const router = createBrowserRouter([
  {
    path:'',
    element: <Main />,
    children:[
      {
        path: '/',
        element: <PermittedRoute permittedField='isLoggedIn' element={<App />} />,
        children: [
          {
            path: '/',
            element: <Todos />,
          },
          {
            path: 'todo/:id',
            element: <TodoDetail />,
          },
          {
            path: 'mytodos',
            element: <Mytodos />,
          },
          {
            path: 'favorite',
    
            element: <Favorite />,
    
          },
          {
            path: 'reminded',
            element: <RemindedTodo />,
          },
        ],
      },
      {
        path: '/login',
        element: <LoginPage />,
    
      }
    ]
  }
]);



ReactDOM.createRoot(document.getElementById('root')!).render(<Provider store={store}>
  <RouterProvider router={router} />
</Provider>);
