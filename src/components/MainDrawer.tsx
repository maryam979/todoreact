import React from 'react';
import { Button, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import drawerSlice from '../redux/drawerSlice';

const MainDrawer = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.drawer.open);

  const showDrawer = () => {
    dispatch(drawerSlice.actions.open());
  };
  
  const onClose = () => {
    dispatch(drawerSlice.actions.close());
  };

  return (
    <div className='bg-blue-500 mb-4 min-w-full'>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer
        title="User"

        placement='left'
        onClose={onClose}
        open={isOpen}
      >
     
      </Drawer>
    </div>
);
};

export default MainDrawer;
