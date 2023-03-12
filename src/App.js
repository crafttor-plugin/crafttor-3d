import './index.css'
import './App.css'
import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Avatar from './components/Avatar';
import './App.css'
function App() {
  const [click, setClick] = useState()
    
  return (
    <div className='w-[100vw] h-[100vh] overflow-hidden ' >
      <Header click = {click} setClick = {setClick} />
      <div className='  w-full h-full bg-[#F2F2F2] relative justify-center self-center items-center'  >
        <Avatar click={click} setClick={setClick} />
      </div>

    </div>
  );
}

export default App;