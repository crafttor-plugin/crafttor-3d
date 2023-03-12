import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { HexAlphaColorPicker, HexColorInput, HexColorPicker } from 'react-colorful'
import { Group } from 'three'
import front from '../assets/images/front.png'
import isometric from '../assets/images/isometric.png'
import dynamic from '../assets/images/dynamic.png'

function Avatar({click,setClick}) {
    const {nodes, materials} = useGLTF(require('../assets/gftf/avatar.gltf'))
    const [canvasReady, setCanvasReady] = useState(false)
    const [avatar, setAvatar] = useState({})
    const [color, setColor] = useState('blue')
    const [colorPicker, setColorPicker] = useState()
    const [orientation, setOrientation] = useState('Front')
    const [componentColor, setComponentColor] = useState({})
    const [componentMetalness, setComponentMetalness] = useState({})
    const [componentRoughness, setComponentRoughness] = useState({})
    const canvasRef = useRef(null)
    const [componentSelect, setComponentSelect] = useState('')

    const [panelsActive, setPanelsActive] = useState(false)

    let components = {}
    Object.values(nodes['Scene'].children).map((val) => {
        let componentName = ""
        for (let j=0;j<val.name.length;j++){
            if((val.name[j]>='a'&&val.name[j]<='z')||(val.name[j]>='A'&&val.name[j]<='Z')){
                componentName+=val.name[j]
            }
        }
        componentName = componentName.toLowerCase()
        if(!components[componentName]){
            components[componentName] = []
            if(!componentColor[componentName]){
                componentColor[componentName] = ''
            }
            if(!componentMetalness[componentName]){
                componentMetalness[componentName] = val?.material?.metalness??0
            }
            if(!componentRoughness[componentName]){
                componentRoughness[componentName] = val?.material?.roughness??0
            }
        }
        components[componentName].push({
            type:val.type,
            component:val
        })
    })

    useEffect(() => {
        let avatarItems = {}
        Object.keys(components).map((val) => {
            avatarItems[val] = components[val][0]
        })
        setAvatar(avatarItems)
    },[])

    if(click == 'download'){
        const dataURL = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'avatar.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setClick('')
    }
    if(click == 'pointlight'){
        setClick('')
    }
    else if(click == 'spotlight'){
        setClick('')
    }
  return (
    <div className='w-full h-full' >
        <div className='h-full w-full pt-[48px] ' >
            <Canvas dpr={[2,2]} flat resize={{scroll:true,debounce:{scroll:100,resize:2}}} pixelRatio={2} camera={{ position: [-15, 0, 10], fov: 25 }}className=''  ref={canvasRef} onCreated={() => {setCanvasReady(true)}} gl={{preserveDrawingBuffer:true,logarithmicDepthBuffer:true}}  >
                {
                Object.keys(avatar).map((val) => (
                    avatar[val].type == 'Mesh' ?
                    <mesh material-roughness={componentRoughness[val]} material-metalness={componentMetalness[val]} material-color={componentColor[val]} onClick={(event) => {
                        event.stopPropagation()
                        setComponentSelect(val)
                        setPanelsActive(true)
                        let materialColor = (avatar[val].component.material.color)
                        setColor(`rgb(${255*materialColor.r},${255*materialColor.g},${255*materialColor.b})`)
                    }} {...(avatar[val].component)} /> :
                    <group {...avatar[val].component} >
                        {
                            Object.values(avatar[val].component.children).map((val) => (
                                <mesh {...val} />
                            ))
                        }

                    </group>
                ))
                }
                {/* <ambientLight color={'blue'} /> */}
                <pointLight position={[200,200,200]} />
                <pointLight position={[-300,-200,200]} />
                <OrbitControls enableZoom={false} maxAzimuthAngle={orientation=='Front'?0:orientation=='Isometric'?-Math.PI/6 :Math.PI/3} minAzimuthAngle={orientation=='Front'?0:orientation=='Isometric'?-Math.PI/6 :-Math.PI/3} minPolarAngle={orientation=='Front'?Math.PI/2:orientation=='Isometric'?Math.PI/3 :Math.PI/3} maxPolarAngle={orientation=='Front'?Math.PI/2:orientation=='Isometric'?Math.PI/3 :Math.PI/2} />
            </Canvas>
        </div>
        
        <div className={`w-[320px] transition-all ease-in shadow-2xl absolute h-full bg-white top-0 ${panelsActive?'left-0':'-left-[320px]' } py-[36px] px-[18px] `} >
            <p className={`font-medium text-md `} >{componentSelect[0]?.toUpperCase()+componentSelect?.substr(1)} </p>
            <div className={`flex h-[128px] relative self-center items-center overflow-x-auto `} >
                {
                    componentSelect &&
                    Object.values(components[componentSelect])?.map((val) => (
                        
                        <div onClick={() => {
                            setAvatar(values => ({
                                ...values,[componentSelect]:val
                            }))
                        }} className='h-[64px] w-[64px] cursor-pointer border-2 mr-2 border-blue-400 ' >
                            <Canvas camera={{fov:40}} className='bg-pink-200 ' >
                                <mesh {...val.component} position={0} />
                                <ambientLight/>
                            </Canvas>
                            </div>
                    ))
                }
            </div>
        </div>
        <div className={`w-[320px] transition-all ease-in shadow-2xl absolute h-full bg-white top-0 ${panelsActive?'right-0':'-right-[320px] ' } py-[36px] px-[18px] justify-center`} >
            <div className='flex w-full justify-between items-center' >
                <p className=' font-medium mb-2' >Color:</p>
                <div onClick={() => {setColorPicker(!colorPicker)}} style={{backgroundColor:color}} className={`w-12 h-12 cursor-pointer rounded-full `} > </div>
                {colorPicker && <div className='mt-4 custom-color-picker w-[284px] flex absolute top-24 box-border bg-pink-200 z-[2] '>

                    <HexColorPicker color={color} onChange={(event) => {
                        setColor(event)
                        setComponentColor(val => ({
                        ...val,[componentSelect]:event
                        }))
                    }} />
                </div>}   
            </div>
            <div className='mt-4' >
                <p className='text-sm font-medium' >Metallness: <span>{componentMetalness[componentSelect]} </span></p>
                <input className='my-2 w-full border-pink-200 bg-purple-400 stroke-purple-400 ' value={componentMetalness[componentSelect]} onChange={(event) => {setComponentMetalness(val => ({
                    ...val,[componentSelect]:event.target.value
                }))}} min={0} max={10} step={.01} type={'range'} />

            </div>

            <div className='mt-4' >
                <p className='text-sm font-medium' >Roughness: <span>{componentRoughness[componentSelect]} </span></p>
                <input className='my-2 w-full border-pink-200 bg-purple-400 stroke-purple-400 ' value={componentRoughness[componentSelect]} onChange={(event) => {setComponentRoughness(val => ({
                    ...val,[componentSelect]:event.target.value
                }))}} min={0} max={2} step={.01} type={'range'} />

            </div>
        </div>

        <div className='absolute w-[440px] h-[64px] bg-white bottom-24 mx-auto flex left-0 right-0 rounded-full justify-evenly items-center shadow-2xl' >
            <div className={`flex cursor-pointer px-4 py-2 ${orientation=='Front'? 'bg-gray-200 rounded-full':''}`} onClick={() => {setOrientation('Front') }} ><img className='w-4 h-4 self-center ' src={front} /><span className='mx-2' >Front</span> </div>
            <div className={`flex cursor-pointer px-4 py-2 ${orientation=='Isometric'? 'bg-gray-200 rounded-full':''}`} onClick={() => {setOrientation('Isometric') }} ><img className='w-4 h-4 self-center ' src={isometric} /><span className='mx-2' >Isometric</span> </div>
            <div className={`flex cursor-pointer px-4 py-2 ${orientation=='Dynamic'? 'bg-gray-200 rounded-full':''}`} onClick={() => {setOrientation('Dynamic') }} ><img className='w-4 h-4 self-center ' src={dynamic} /><span className='mx-2' >Dynamic</span> </div>
        </div>

    </div>
  )
}

export default Avatar