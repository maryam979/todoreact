import { Button, Modal, Input, notification } from 'antd';
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { apiPostTodo } from '../services/todos/api';
import React from 'react';

type Props = {
  onSubmit: (data: API.Todo) => void;
}

type Expose = {
  show: () => void;
  hide: () => void;
}

const TodoCreateModal = React.forwardRef<Expose, Props>((props, ref) => {
  const [api, contextHolder] = notification.useNotification()
  const [open, setOpen] = React.useState(false)
  const [formIsSubmitting, setFormIsSubmitting] = React.useState(false)
  
  const show = () => {
    console.log("show ceate");
    
    setOpen(true)
  }

  const hide = () => {
    setOpen(false)
  }

  React.useImperativeHandle(ref, () => ({ show, hide }));

  const schema = yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
  })

  const form = useForm({
    resolver: yupResolver(schema)
  })

 

  const onSubmit = (data: API.TodoCreateForm) => {
    setFormIsSubmitting(true)
    apiPostTodo(data)
      .then(res => {
        api.success({
          message: 'Instance was created successfully.',
          placement: 'bottom'
        })
        props.onSubmit(res.data);
      })
      .catch(() => {
        api.error({
          message: 'Something went wrong.',
          placement: 'bottom'
        })
      })
      .finally(() => {
        setFormIsSubmitting(false)
        hide();
      })
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        if (!formIsSubmitting) hide();
      }}
      onOk={() => form.handleSubmit(onSubmit)()}
      title="Create Todo"
      okText="Add"
      afterClose={() => form.reset()}
      cancelButtonProps={{
        disabled: formIsSubmitting
      }}
      okButtonProps={{
        loading: formIsSubmitting
      }}
    >
      <div className='flex flex-col gap-2'>
        {contextHolder}
        <Controller
          control={form.control}
          name='title'
          render={({ field }) => (
            <div>
              <Input {...field} placeholder="Title" />
              <p className={`text-red-600 text-xs px-2 ${form.formState.errors[field.name]?.message ? 'pt-1' : ''} `}>
                {form.formState.errors[field.name]?.message}
              </p>
            </div>
          )}
        />
        <Controller
          control={form.control}
          name='content'
          render={({ field }) => (
            <div>
              <Input.TextArea {...field} placeholder="Content" rows={4} />
              <p className={`text-red-600 text-xs px-2 ${form.formState.errors[field.name]?.message ? 'pt-1' : ''} `}>
                {form.formState.errors[field.name]?.message}
              </p>
            </div>
          )}
        />
      </div>
    </Modal>
  );
});

export default TodoCreateModal;
