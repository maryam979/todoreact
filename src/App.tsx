import React from 'react';
import { Button, Drawer } from 'antd';
import Todos from './pages/Todos';
import TodoDetail from './pages/TodoDetail';
import {
  Outlet,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from './redux/hooks';
import drawerSlice from './redux/drawerSlice';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';


 
function App() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.drawer.open);

  const showDrawer = () => {
    dispatch(drawerSlice.actions.open());
  };

  const onClose = () => {
    dispatch(drawerSlice.actions.close());
  };

  return (
    <>

      <Drawer
        title="User"

        placement='left'
        onClose={onClose}
        open={isOpen}
      >
        <div className='flex flex-col group-5'>
          <Link className='font-medium text-blue-600 ' to="/"> Todos</Link>
          <Link  className='font-medium  text-blue-600' to="/mytodos">My Todos</Link>
          <Link  className='font-medium  text-blue-600 border-bottom-3' to="/favorite">Favorite</Link>
          <Link  className='font-medium  text-blue-600 border-bottom-3'  to="/reminded">Reminded</Link>
        </div>
      </Drawer>
      <div className='bg-blue-500 mb-4 min-w-full'>

        <Button type="primary" onClick={showDrawer}>
          Open

        </Button>
      </div>

      <div className='mx-auto container p-2'>
        <Outlet></Outlet>
      </div>
      {/* <RouterProvider router={router} /> */}
    </>
  );
}

export default App;
