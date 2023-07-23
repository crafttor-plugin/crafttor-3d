import './index.css';
import './App.css';
import {useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import Avatar from './components/Avatar';
import './App.css';
function App() {
  const [click, setClick] = useState();
  const [environmentValue, setEnvironmentValue] = useState(null);
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden ">
      <Header
        environmentValue={environmentValue}
        setEnvironmentValue={setEnvironmentValue}
        click={click}
        setClick={setClick}
      />
      <div className="  w-full h-full bg-[#F2F2F2] relative justify-center self-center items-center">
        <Avatar
          environmentValue={environmentValue}
          setEnvironmentValue={setEnvironmentValue}
          click={click}
          setClick={setClick}
        />
      </div>
    </div>
  );
}

export default App;
