import axiosInterceptor from "../../utils/axiosInterceptor";

export const apiGetTodos = ()=>{
    return axiosInterceptor.get<API.Todo[]>('/core/todos/');
}

export const apiPostTodo = (data:API.TodoCreateForm)=>{
    return axiosInterceptor.post<API.Todo>('/core/todos/',data);
}
export const apiDeleteTodo = (id: number) => {
    return axiosInterceptor.delete(`/core/todos/${id}`);
};