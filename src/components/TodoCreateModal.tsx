import React from 'react';

import { Button, Modal } from 'antd';
import { Input, notification } from 'antd';
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { apiPostTodo } from '../services/todos/api';





type Props = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: API.Todo) => void;
}

/**
props
emits
validation (yup)
use service layer (api / types)
notification
manage busy points/cases
 */


const TodoCreateModal = (props: Props) => {
  const [api, contextHolder] = notification.useNotification()
  const schema = yup.object({
    
    title: yup.string().required(),
    content: yup.string().required(),
  })
  const form = useForm<API.TodoCreateForm>({
    resolver: yupResolver(schema)
  })
  const [formIsSubmitting, setFormIsSubmtting] = React.useState(false)
  const onSubmit = (data: API.TodoCreateForm) => {
    setFormIsSubmtting(true)
    apiPostTodo(data)
      .then(res => {
        api.success({
          message: 'Instance was created successfuly.',
          placement: 'bottom'
        })
        props.onSubmit(res.data);
      }).catch(() => {
        api.error({
          message: 'Somethings wrong.',
          placement: 'bottom'
        })
      }).finally(() => {
        setFormIsSubmtting(false)
      })
  };
  return (



    <Modal
      open={props.open}
      onCancel={() => {
        if (!formIsSubmitting)
          props.onCancel()
      }}
      onOk={() => form.handleSubmit(onSubmit)()}
      title="Create Todo"
      okText="Add"
      afterClose={form.reset}
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
};

export default TodoCreateModal;