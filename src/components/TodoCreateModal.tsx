import React, { useState, useCallback } from 'react';
import { Button, Modal, Input, notification, Upload, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { UploadFile, UploadProps } from 'antd';
import { apiPostTodo } from '../services/todos/api';

type FileType = UploadFile & { originFileObj?: File };

const getBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type Props = {
  onSubmit: (data: API.Todo) => void;
}

type Expose = {
  show: () => void;
  hide: () => void;
}

const TodoCreateModal = React.forwardRef<Expose, Props>((props, ref) => {
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = useCallback(async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as Blob);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  }, []);

  const handleChange: UploadProps['onChange'] = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Keep only the last uploaded file
  }, []);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const show = useCallback(() => {
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  React.useImperativeHandle(ref, () => ({ show, hide }));

  const schema = yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
  });

  const form = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(async (data: API.TodoCreateForm) => {
   

    console.log("Form Data with Image:", data); 
    setFormIsSubmitting(true);
    if (fileList.length > 0) {
      try {
          const base64Image = await getBase64(fileList[0].originFileObj as Blob);
          data.image = base64Image; // Add image data
      } catch (error) {
          console.error("Error converting file to base64:", error);
      }
  }
    apiPostTodo(data)
        .then(res => {
            api.success({
                message: 'Instance was created successfully.',
                placement: 'bottom'
            });
            props.onSubmit(res.data);
        })
        .catch(err => {
            console.error("Error adding todo:", err); // Log the error response
            api.error({
                message: 'Something went wrong.',
                placement: 'bottom'
            });
        })
        .finally(() => {
            setFormIsSubmitting(false);
            hide();
        });
}, [api, hide, props, fileList]);

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
      cancelButtonProps={{ disabled: formIsSubmitting }}
      okButtonProps={{ loading: formIsSubmitting }}
    >
      <div className='flex flex-col gap-2'>
        {contextHolder}
        <Upload
          listType="picture-circle"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false} // Prevent automatic upload
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
        <Controller
          control={form.control}
          name='title'
          render={({ field }) => (
            <div>
              <Input {...field} placeholder="Title" />
              <p className={`text-red-600 text-xs px-2 ${form.formState.errors[field.name]?.message ? 'pt-1' : ''}`}>
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
              <p className={`text-red-600 text-xs px-2 ${form.formState.errors[field.name]?.message ? 'pt-1' : ''}`}>
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
