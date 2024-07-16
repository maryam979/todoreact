declare namespace API {
    type UserLogin = {
        username:string;
        password:string;
    }
    type User = {
        username:string;
        email:string;
        first_name:string;
        last_name:string;
    }
    type UserLoginResponse = {
        access:string;
        refresh:string;
        user:User;
        
    }
}