import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, notification, Button } from 'antd';
import { apiGetTodoDetails, apiUpdateTodo, apiDeleteTodo } from '../services/todos/api';
import { useNavigate } from 'react-router-dom';
import TodoDeleteModal from '../components/TodoDeleteModal';

const TodoDetail: React.FC = () => {
  const [instance, setInstance] = useState<API.Todo | null>(null);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const deleteModal = React.useRef<React.ElementRef<typeof TodoDeleteModal>>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    content: yup.string().required('Content is required'),
  });

  const form = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = () => {
      apiGetTodoDetails(parseInt(id as string))
        .then(response => {
          if (isMounted && response.data) {
            setInstance(response.data);
            form.reset({
              title: response.data.title,
              content: response.data.content,
            });
          }
        })
        .catch(error => {
          notification.error({
            message: 'Error',
            description: 'Failed to fetch todo details.',
            placement: 'bottomRight',
          });
        });
    };

    if (id) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, form]);

  const onSubmit = (data: API.TodoUpdateForm) => {
    if (instance) {
      setFormIsSubmitting(true);

      apiUpdateTodo(instance.id, data)
        .then(res => {
          notification.success({
            message: 'Todo updated successfully.',
            placement: 'bottomRight',
          });
          navigate('/');
        })
        .catch(error => {
          notification.error({
            message: 'Something went wrong.',
            placement: 'bottomRight',
          });
        })
        .finally(() => {
          setFormIsSubmitting(false);
        });
    }
  };

  const handleDelete = () => {
    if (instance) {
      deleteModal.current?.show(instance);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="flex flex-col gap-2">
        <h2>Detail Todo</h2>
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <div>
              <Input {...field} placeholder="Title" />
              {form.formState.errors.title && (
                <p className="text-red-600 text-xs px-2 pt-1">{form.formState.errors.title.message}</p>
              )}
            </div>
          )}
        />
  
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <div>
              <Input.TextArea {...field} placeholder="Content" rows={4} />
              {form.formState.errors.content && (
                <p className="text-red-600 text-xs px-2 pt-1">{form.formState.errors.content.message}</p>
              )}
            </div>
          )}
        />
        
        <div className="flex flex-row gap-2">
          <Button className='bg-green-600' onClick={form.handleSubmit(onSubmit)}>
            Update
          </Button>
          <Button className='bg-red-600' onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

    
      <TodoDeleteModal ref={deleteModal} onSubmit={(data) => console.log(data)} />
    </div>
  );
};

export default TodoDetail;
