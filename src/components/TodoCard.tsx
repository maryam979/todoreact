import React, { useState } from 'react';
import { Card, Button, Popover, ConfigProvider, Modal, notification } from 'antd';
import { MoreOutlined, DeleteOutlined, SmileOutlined } from '@ant-design/icons';

import { apiDeleteTodo } from '../services/todos/api'

type TodoCardProps = {
  instance: API.Todo;
  fetchData: () => void;
};



const TodoCard = (props: TodoCardProps) => {
  const [api, contextHolder] = notification.useNotification()
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [todos, setTodos] = React.useState<API.Todo[]>([]);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccessful, setDeletionSuccessful] = useState(false);


  const handleCancel = () => {
    setModalVisible(false);
    setSelectedTodoId(null);
  };
  const handleOk = () => {

    if (selectedTodoId === null) return;
    setIsDeleting(true);
    apiDeleteTodo(selectedTodoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== selectedTodoId));
        props.fetchData();
        api.success({
          message: 'Todo deleted successfully',
        });
      })
      .catch((error) => {
        console.log('Error deleting todo:', error);
        api.error({
          message: 'Failed to delete todo',
          description: error.message,
        });
      });

    setModalVisible(false);
    setSelectedTodoId(null);
    setIsDeleting(false);

  };

  const content = (
    <div className='flex flex-col gap-2'>
      <Button onClick={() => {
        setSelectedTodoId(props.instance.id);
        setModalVisible(true);
      }}><DeleteOutlined /> Delete</Button>
      <Button ><SmileOutlined /> update</Button>
    </div>
  );



  return (
    <Card title={props.instance.title}>
      <p>{props.instance.content}</p>

      <ConfigProvider>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Popover
            placement="bottom"
            content={content}
            open={open}
            onOpenChange={setOpen}
          >
            <Button onClick={() => setOpen(!open)}><MoreOutlined /></Button>
          </Popover>
        </div>
      </ConfigProvider>

      <Modal
        title="Delete Todo"
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        cancelButtonProps={{
          disabled: isDeleting,
        }}
        confirmLoading={isDeleting}
        okText="Delete"
      >
        <p>Are you sure you want to delete this todo?</p>
      </Modal>
    </Card>
  );
};

export default TodoCard;
