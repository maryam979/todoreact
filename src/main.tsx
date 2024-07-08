import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './redux/store';
import App from './App';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Mytodos from './pages/Mytodos';
import Favorite from './pages/Favorite';
import RemindedTodo from './pages/RemindedTodo';
import Todos from './pages/Todos';
import TodoDetail from './pages/TodoDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/> ,
    children: [
      {
        path: '/',
        element: <Todos/>,
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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>,
);
