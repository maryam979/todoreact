import React from 'react';
import { Modal, Input, notification } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { apiUpdateTodo } from '../services/todos/api';
import { useNavigate } from 'react-router-dom';

type Props = {
  onSubmit: (updatedTodo: API.Todo) => void;
};

type Expose = {
  show: (todo: API.Todo) => void;
  hide: () => void;
};

const TodoUpdateModal = React.forwardRef<Expose, Props>((props, ref) => {
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = React.useState(false);
  const [instance, setInstance] = React.useState<API.Todo>();
  const [formIsSubmitting, setFormIsSubmitting] = React.useState(false);
  
  const show = (todo: API.Todo) => {
    setInstance(todo);
    form.reset(todo);
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  React.useImperativeHandle(ref, () => ({ show, hide }));

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    content: yup.string().required('Content is required'),
  });

  const form = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: API.TodoUpdateForm) => {
    if(instance){
      setFormIsSubmitting(true);

      apiUpdateTodo(instance.id, data)
        .then((res) => {
          api.success({
            message: 'Todo updated successfully.',
            placement: 'bottomRight',
          });
          props.onSubmit(res.data);

        })
        .catch((error) => {
          api.error({
            message: 'Something went wrong.',
            placement: 'bottomRight',
          });
        })
        .finally(() => {
          setFormIsSubmitting(false);
          hide();
        });
    }
  };
  

  return (
    <Modal
    open={open}
      onCancel={() => {
        if (!formIsSubmitting) hide();
      }}
      onOk={form.handleSubmit(onSubmit)}
      title="Update Todo"
      okText="Update"
      afterClose={() => form.reset()}
      cancelButtonProps={{
        disabled: form.formState.isSubmitting,
      }}
      okButtonProps={{
        loading: form.formState.isSubmitting,
        style: { backgroundColor: 'green' },
      }}
    >
      <div className="flex flex-col gap-2">
        {contextHolder}
        <h2>Update</h2>
        <Controller
          control={form.control}
          name="title"
          defaultValue={instance?.title}
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
          defaultValue={instance?.content}
          render={({ field }) => (
            <div>
              <Input.TextArea {...field} placeholder="Content" rows={4} />
              {form.formState.errors.content && (
                <p className="text-red-600 text-xs px-2 pt-1">{form.formState.errors.content.message}</p>
              )}
            </div>
          )}
        />
      </div>
    </Modal>
  );
});

export default TodoUpdateModal;
