import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, notification, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { apiLogin } from '../services/auth/api';
import { loginAction } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage =  () => {
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const { handleSubmit, control, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: API.UserLogin) => {
    setFormIsSubmitting(true);
    try {
      const res = await apiLogin(data);
      dispatch(loginAction(res.data));
      notification.success({
        message: 'Welcome to your website',
        placement: 'bottom',
      });
      navigate('/');
    } catch (err) {
      notification.error({
        message: 'Something went wrong',
        placement: 'bottom',
      });
    } finally {
      setFormIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-2">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <div>
                <Input {...field} placeholder="Username" />
                {formState.errors[field.name] && (
                  <p className="text-red-600 text-xs px-2 pt-1">
                    {formState.errors[field.name]?.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <div>
                <Input.Password {...field} placeholder="Password" />
                {formState.errors.password && (
                  <p className="text-red-600 text-xs px-2 pt-1">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>
            )}
          />
          <Button
            type="primary"
            htmlType="submit"
            loading={formIsSubmitting}
            className="mt-4"
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage ;
