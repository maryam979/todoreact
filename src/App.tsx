

import React from 'react';
import { apiGetTodos, apiDeleteTodo } from './services/todos/api'
import TodoCard from './components/TodoCard';
import { PlusOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd';
import TodoCreateModal from './components/TodoCreateModal';
import TodoDeleteModal from './components/TodoDeleteModal';

const App = () => {
  const [todos, setTodos] = React.useState<API.Todo[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  const deleteModal = React.useRef<React.ElementRef<typeof TodoDeleteModal>>()

  const fetchData = () => {
    apiGetTodos()
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.log('Eror', error);
      });
  }
  React.useEffect(() => {
    fetchData()
  }, [])
  const handleCancel = () => {
    setModalVisible(false);
    deleteModal.current?.hide()
  };
  const handleOk = (data: API.TodoCreateForm) => {
    fetchData()

    setModalVisible(false);
    deleteModal.current?.hide()
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-2">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {todos.map((todo) => (
          <TodoCard key={todo.id} instance={todo} fetchData={fetchData} onDeleteClick={() => {
            deleteModal.current?.show(todo)
          }} />
        ))}
      </div>

      <FloatButton
        shape="circle"
        type="primary"
        style={{ position: 'fixed', bottom: 20, right: 94 }}
        icon={<PlusOutlined />}
        onClick={() => setModalVisible(true)}

      />
      <TodoCreateModal
        open={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleOk}
      />
      <TodoDeleteModal ref={deleteModal as any} onSubmit={fetchData} />
    </div>
  );
};

export default App;
