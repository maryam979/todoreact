
import { Modal, notification } from 'antd';

import { apiDeleteTodo, apiPostTodo } from '../services/todos/api';
import { useNavigate } from 'react-router-dom';
import React from 'react';





type Props = {
  onSubmit: (data: API.Todo) => void;
}

type Expose = {
  show:(todo:API.Todo)=>void;
  hide:()=>void;
}


const TodoDeleteModal = React.forwardRef<Expose,Props>((props,ref) => {
  const [api, contextHolder] = notification.useNotification()

  const [instance,setInstance] = React.useState<API.Todo>()
  const [open,setOpen] = React.useState(false)

  const [deleteIsSubmitting, setDeleteIsSubmitting] = React.useState(false)
  const navigate = useNavigate();

  const show = (todo:API.Todo)=> {
    console.log(todo);
    
    setInstance(todo)
    setOpen(true)
  }

  const hide = ()=>{
    setOpen(false)
  }
  
  const onDelete = () => {
    if(instance){
      setDeleteIsSubmitting(true)

      apiDeleteTodo(instance.id)
        .then(res => {
          api.success({
            message: 'Instance was deleted successfuly.',
            placement: 'bottom'
          })
          props.onSubmit(res.data);
          hide()
          navigate('/');
        }).catch(() => {
          api.error({
            message: 'Somethings wrong.',
            placement: 'bottom'
          })
        }).finally(() => {
          setDeleteIsSubmitting(false)
        })
    }
  };

  React.useImperativeHandle(ref,()=>({show,hide}))
  return (
    <Modal
      open={open}
      onCancel={() => {
        if (!deleteIsSubmitting)
          hide()
      }}
      onOk={onDelete}
      title="Delete Todo"
      okText="Delete"
      cancelButtonProps={{
        disabled: deleteIsSubmitting
      }}
      okButtonProps={{
        loading: deleteIsSubmitting,
        danger:true
      }}
    >
      <div className='flex flex-col gap-2'>
        {contextHolder}
        Are you sure ?
      </div>
    </Modal>
  );
})

export default TodoDeleteModal;