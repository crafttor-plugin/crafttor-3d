import React from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

function AvatarGLTF({...props}) {
    const {nodes, materials} = useGLTF(require('../assets/gftf/avatar.gltf'))
    console.log(materials)
  return (
    <group {...props} dispose={null} >
        <mesh castShadow receiveShadow geometry={nodes.Base_Hair} material={materials.Hair} material-envMapIntensity={0.8} />
      
    </group>
  )
}

// useGLTF.preload('../assets/gltf/avatar.gltf')
export default AvatarGLTF

// import './index.css'
// import './App.css'
// import { Canvas, useFrame } from '@react-three/fiber'
// import AvatarGLTF from './ReactGLTF/AvatarGLTF';
// import { CameraControls, OrbitControls, useGLTF } from '@react-three/drei';
// import { useEffect, useRef, useState } from 'react';
// import * as THREE from "three";

// function App() {
  // const [canvasReady, setCanvasReady] = useState(false)
  
//   let canvasRef = useRef()
//   function download(){
//     const canvas = canvasRef.current
//     const dataURL = canvas.toDataURL('image/png',1)
//     const link = document.createElement('a')
//     link.href = dataURL
//     link.download = 'my-scene.png'
//     link.click()
//   }
  
//   const {nodes, materials} = useGLTF(require('./assets/gftf/avatar.gltf'))
//   const components = {
//     baseHair:['Base_Hair','Base_Hair001','Base_Hair002','None'],
//     // bezierCircle:['BezierCircle','None'],
//     body:['Body','None'],
//     bread:['Bread','None'],
//     bubbleHair:['Bubble_Hair','None'],
//     cap:['Cap','None'],
//     cloths:['Cloths','None'],
//     // cube:['Cube','None'],
//     // cylinder:['Cylinder003','Cylinder003_1','Cylinder003_2','None'],
//     ears:['Ears','None'],
//     eyebrow:['Eye_Bro','None'],
//     face:['Face001','Face','None'],
//     girlHair:['Girl_Hair2','Girl_Hair_Long','Hair_Big','Hair_girl_puff','None'],
//     // hat:['Hat','None'],
//     hoddy:['Hoddy','Hoddy_lay','Jacket1','None'],
//     mouth:['Mouth','None'],
//     // nurbsPath:['NurbsPath','None'],
//     scene:['Scene','None'],
//     specs:['Spec1','Spec2','None'],
//     // sphere:['Sphere','None'],
//     tshirtNeck:['Tshirt_Neck','None'],
//     eye:['eye','None'],
//     moustache:['moustache_1','moustache_2','None']
//   }

//   const [avatar, setAvatar] = useState()
//   const [componentSelect, setComponentSelect] = useState('specs')
//   const [itemSelect, setItemSelect] = useState()
//   const [componentSelectShow, setComponentSelectShow] = useState(false)

//   useEffect(() => {
//     let avatarVal = {}
//     Object.keys(components).map(val => {
//       avatarVal[val] = {
//         ...nodes[components[val][0]]
//       }
//     })
//     setAvatar(avatarVal)

//   },[])


  
  
  
//   return (
//     <div
//     onClick={() => {
//       setComponentSelectShow(false)
//     }}
//     className="h-[100vh] w-full bg-amber-200 relative overflow-scroll">
//       <p className='text-2xl font-medium text-center' > Craftor Project </p>
//       <div className='flex h-[3000px] max-w-[3000px] items-center mx-auto scale-50' >
//       {avatar && 
//       <Canvas className='absolute h-full w-full'
//        gl={{preserveDrawingBuffer:true}} onCreated={() => setCanvasReady(true)} ref={canvasRef} onClick={(event) => {event.stopPropagation()}} camera={{fov:8}} >
//         <ambientLight/>

//         {
//           Object.keys(avatar).map((val,key) => (
//             avatar[val].type == 'Mesh'?
            
//             <mesh key={key} {...avatar[val]} onClick={(event) => {
//               event.stopPropagation();
//               setComponentSelect(val)
//               setComponentSelectShow(true)
//             }} 
//             />
//             :<mesh/>
//           ))
//         }
        
//         {/* <CameraControls  /> */}
//         {/* <object3D /> */}
//         <OrbitControls setAzimuthalAngle={Math.PI/4} maxAzimuthAngle={Math.PI/2} minAzimuthAngle={-Math.PI/2} minPolarAngle={Math.PI/2} maxPolarAngle={Math.PI/2} />
//         <spotLight position={[100,200,300]} />
        
//       </Canvas>}
//       </div>
//       {componentSelectShow && <div className='absolute bg-slate-200 w-[260px] rounded-md h-fit my-auto top-[240px] right-[80px] ' >
//         <p className='text-2xl py-2 font-bold text-blue-900 w-full text-center border-gray-200 ' >{componentSelect.toUpperCase()} </p>
//         <div className=' bg-slate-400 divide-y-2 overflow-scroll max-h-[360px] rounded-b-md ' >
//           {
//             components[componentSelect]?.map((itemOption) => (
//               <p className='pl-4 py-2 font-medium cursor-pointer'
//               onClick={(event) => {
//                 event.stopPropagation()
//                 setAvatar(values => ({
//                   ...values, [componentSelect]:{...nodes[itemOption]}
//                 }))
//                 setItemSelect(itemOption)
//                 setComponentSelectShow(false)
                

//               }}
//               >{itemOption} </p>
//             ))
//           }
//         </div>
//       </div>}
//       <button className='bg-green-200 px-4 py-2 rounded-md flex mx-auto absolute left-0 top-0' onClick={download} > Download </button>
//     </div>
//   );
// }

// export default App;