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