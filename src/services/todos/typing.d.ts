declare namespace API {
    type Todo = {
        id: number;
        title: string;
        content: string;
    }

    type TodoCreateForm = {
        title: string
        content: string
    }

    type TodoUpdateForm = {
        title: string
        content: string
    }
} 