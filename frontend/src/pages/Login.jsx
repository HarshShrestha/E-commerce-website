import React, { useState } from 'react'

const Login = () => {

  const [currentState , setCurrentState ] = useState("login");

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currentState=='login' ? '' :<input type="text" placeholder='Name' className='w-full py-2 px-3 border border-gray-800' required/>}
      <input type="email" placeholder='Email' className='w-full py-2 px-3 border border-gray-800' required/>
      <input type="password" placeholder='Password' className='w-full py-2 px-3 border border-gray-800' required/>
      <div className='w-full flex items-center justify-between text-sm text-gray-600'>
        <p>{currentState=='login' ? 'Forgot Password?' : ''}</p>
        {
          currentState==='login' 
          ? <p onClick={()=>setCurrentState('sign up')} className='cursor-pointer'>Create account</p>
          : <p onClick={()=>setCurrentState('login')} className='cursor-pointer'>Already have an account? Login here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState==='login' ? 'Sign in' : 'Sign up'}</button>
    </form>
  )
}

export default Login