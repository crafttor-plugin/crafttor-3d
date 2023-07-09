import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import download from '../assets/images/download.png'
import icon from '../assets/images/icon.png'
import light from '../assets/images/light.png'

function Header({click, setClick}) {
  const [lightIcon, setLightIcon] = useState()
  const [environment, setEnvironment] = useState()
  return (
  <div className='w-full flex h-[56px] px-[16px] py-[13px] shadow-md justify-between ' >
  <img src={logo} />
  <div className='flex py-[2px] ' >
    <div className='relative' >
      <img onClick={() => {setClick('environment');setEnvironment(!environment);setLightIcon(0);  }} className={`mx-2 cursor-pointer rounded-full p-2 w-[32px] h-[32px] ${environment?'bg-gray-200':''} `} src={icon} />
      <div className={`w-[180px] bg-pink-200 z-[2] absolute top-[36px] rounded-sm ${environment?'visible':'hidden'} `}>
        <p className='font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm' onClick={() => {setClick('pointLight'); setEnvironment(!environment)}} >Point Light </p>
        <p className='font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm' onClick={() => {setClick('spotLight'); setEnvironment(!environment)}} >Spot Light </p>
        <p className='font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm' onClick={() => {setClick('ambientLight'); setEnvironment(!environment)}} >Ambient Light </p>
      </div>
    </div>
    <div className='relative' >
    <img onClick={() => {setClick('light'); setLightIcon(!lightIcon);setEnvironment(0) }} className={`mx-2 cursor-pointer rounded-full p-2 w-[32px] h-[32px] ${lightIcon?'bg-gray-200':''} `} src={light} />
  
      <div className={`w-[180px] bg-pink-200 z-[2] absolute top-[36px] rounded-sm ${lightIcon?'visible':'hidden'} `}>
        <p className='font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm' onClick={() => {setClick('pointLight');setLightIcon(!lightIcon)}} >Point Light </p>
        <p className='font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm' onClick={() => {setClick('spotLight');setLightIcon(!lightIcon)}} >Spot Light </p>
        <p className='font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm' onClick={() => {setClick('ambientLight');setLightIcon(!lightIcon)}} >Ambient Light </p>
      </div>
    </div>
    
  </div>
  <div className='flex' >
    <button onClick={() => {setClick('download')}} className='flex items-center justify-between bg-indigo-400 h-[40px] w-[120px] self-center px-4 rounded cursor-pointer' >
      <span className='self-center' ><img src={download} /></span>
      <span className='text-sm font-medium text-white self-center ' >Download</span>
    </button>
  </div>
</div>

  )
}

export default Header