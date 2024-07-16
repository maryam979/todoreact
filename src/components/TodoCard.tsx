import React, { useState } from 'react';
import { Card, Button, Popover, ConfigProvider, Modal, notification } from 'antd';
import { MoreOutlined, DeleteOutlined, SmileOutlined } from '@ant-design/icons';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Image } from 'antd';

type TodoCardProps = {
  instance: API.Todo;
  fetchData: () => void;
  onDeleteClick?: () => void;
  onUpdateClick?: () => void;
};



const TodoCard = (props: TodoCardProps) => {

  const [open, setOpen] = React.useState(false)


  const content = (
    <div className='flex flex-col gap-2'>
      <Button onClick={() => {
        if (props.onDeleteClick)
          props.onDeleteClick()
      }}><DeleteOutlined /> Delete</Button>
      <Button onClick={() => {
        if (props.onUpdateClick)
          props.onUpdateClick()
      }}

      ><SmileOutlined /> update</Button>
    </div>
  );



  return (
    <Card
      title={props.instance.title} extra={<Link to={`/todo/${props.instance.id}`}><ArrowRightOutlined /></Link>}
    >
      <Image
        width={200}
        src={props.instance.image}
        preview={{ src: props.instance.image }}
      />





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

    </Card>
  );
};

export default TodoCard;
