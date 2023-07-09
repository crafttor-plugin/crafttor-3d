import './index.css';
import './App.css';
import {useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import Avatar from './components/Avatar';
import './App.css';
import {getGLBFile} from './services/services';
import {useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
function App() {
  const [click, setClick] = useState();
  const file = getGLBFile();
  const glbfile = useLoader(
    GLTFLoader,
    'https://crafttor-admin.s3.amazonaws.com/modal/category/3DAvatar_Main_Cap.glb',
  );
  console.log(glbfile);
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden ">
      <Header click={click} setClick={setClick} />
      <div className="  w-full h-full bg-[#F2F2F2] relative justify-center self-center items-center">
        <Avatar click={click} setClick={setClick} />
      </div>
    </div>
  );
}

export default App;
