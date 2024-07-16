import React from 'react'
import { RouteProps, useNavigate } from 'react-router-dom'
import { useAppSelector } from './redux/hooks';
import { AuthState } from './redux/authSlice';

type Props = {
    permittedField: keyof AuthState
} & RouteProps;
const PermittedRoute = (props:Props) => {
    const auth = useAppSelector(state=>state.auth)
    const nav = useNavigate()
    
    const [element,setElment] = React.useState<React.ReactNode>(<></>)

    React.useEffect(()=>{
        if (auth[props.permittedField])
            setElment(props.element)
        else
            nav('/login')
    },[])
        return (element)
        
}

export default PermittedRoute