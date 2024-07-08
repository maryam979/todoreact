import React from 'react';
import { apiGetTodos } from '../services/todos/api';
import TodoCard from '../components/TodoCard';
import { PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import TodoCreateModal from '../components/TodoCreateModal';
import TodoDeleteModal from '../components/TodoDeleteModal';
import TodoUpdateModal from '../components/TodoUpdateModal';
import MainDrawer from '../components/MainDrawer'
const Todos = () => {
  const [todos, setTodos] = React.useState<API.Todo[]>([]);
  const deleteModal = React.useRef<React.ElementRef<typeof TodoDeleteModal>>(null);
  const createModal = React.useRef<React.ElementRef<typeof TodoCreateModal>>(null);
  const updateModal = React.useRef<React.ElementRef<typeof TodoUpdateModal>>(null);



  const fetchData = () => {
    apiGetTodos()
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.log('Error', error);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOk = (data: API.TodoCreateForm) => {
    fetchData();
    createModal.current?.hide();
  };

  return (
      <div className="container mx-auto p-2">
        <h2 className='text-center font-medium text-indigo-600  mb-5'>My todos</h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              instance={todo}
              fetchData={fetchData}
              onDeleteClick={() => deleteModal.current?.show(todo)}
              onUpdateClick={() => updateModal.current?.show(todo)}
            />
          ))}
        </div>

    
        <TodoCreateModal ref={createModal as any} onSubmit={fetchData} />
        <TodoDeleteModal ref={deleteModal as any} onSubmit={fetchData} />
        <TodoUpdateModal ref={updateModal as any} onSubmit={fetchData} />






      </div>

  );
};

export default Todos;
