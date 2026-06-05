import React, { useState, useContext } from 'react'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState , setCurrentState ] = useState("login");
  const {token,setToken,navigate,backendURL} = useContext(ShopContext);

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
    try{
      // Call the api
      if(currentState!='login'){ //call the sign up api
        const response = await axios.post(backendURL+'/api/user/register',{name,email,password})
        c//store the token got from backend response
        if(response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
        }else{
          toast.error(response.data.message)
        }
      }else{  //call login API
        const response = await axios.post(backendURL+'/api/user/login',{email,password})
        
        if(response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token',token)
        }else{
          toast.error(response.data.message)
        }
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {
      currentState=='login' ? '' :
        <input type="text" onChange={(e)=>setName(e.target.value)} value={name}  placeholder='Name' className='w-full py-2 px-3 border border-gray-800' required/>}
        <input type="email"  onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='Email' className='w-full py-2 px-3 border border-gray-800' required/>
        <input type="password"  onChange={(e)=>setPassword(e.target.value)} value={password} placeholder='Password' className='w-full py-2 px-3 border border-gray-800' required/>
        <div className='w-full flex items-center justify-between text-sm text-gray-600'>
          <p>{currentState=='login' ? 'Forgot Password?' : ''}</p>
          {
            currentState==='login' 
            ? <p onClick={()=>setCurrentState('sign up')} className='cursor-pointer'>Create account</p>
            : <p onClick={()=>setCurrentState('login')} className='cursor-pointer'>Already have an account? Login here</p>
          }
        </div>
        <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState==='login' ? 'Sign in' : 'Sign up'}</button>
        {/* <CartTotal /> */}
    </form>
  )
}

export default Login