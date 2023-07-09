import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import React, {useEffect, useRef, useState} from 'react';
import {
  HexAlphaColorPicker,
  HexColorInput,
  HexColorPicker,
} from 'react-colorful';
import {Group} from 'three';
import front from '../assets/images/front.png';
import isometric from '../assets/images/isometric.png';
import dynamic from '../assets/images/dynamic.png';
import {getGLBFile, getapi} from '../services/services';

async function Avatar({click, setClick}) {
  const {nodes, materials} = useGLTF(require('../assets/gftf/avatar.gltf'));
  const [canvasReady, setCanvasReady] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [color, setColor] = useState('blue');
  const [colorPicker, setColorPicker] = useState();
  const [orientation, setOrientation] = useState('Front');
  const [componentColor, setComponentColor] = useState({});
  const [componentMetalness, setComponentMetalness] = useState({});
  const [componentRoughness, setComponentRoughness] = useState({});
  const [components, setComponents] = useState({});
  const [showPositionSlider, setShowPositionSlider] = useState(false);
  const [lights, setLights] = useState([
    {
      type: 'pointLight',
      name: 'Point Light',
      position: {
        x: 100,
        y: 200,
        z: 300,
      },
      color: 'yellow',
    },
    {
      type: 'spotLight',
      name: 'Spot Light',
      position: {
        x: 100,
        y: -200,
        z: 300,
      },
      color: 'yellow',
    },
  ]);
  const canvasRef = useRef(null);
  const [componentSelect, setComponentSelect] = useState('');

  const [panelsActive, setPanelsActive] = useState(false);

  useEffect(() => {
    let components = {};
    Object.values(nodes['Scene'].children).map(val => {
      let componentName = '';
      for (let j = 0; j < val.name.length; j++) {
        if (
          (val.name[j] >= 'a' && val.name[j] <= 'z') ||
          (val.name[j] >= 'A' && val.name[j] <= 'Z')
        ) {
          componentName += val.name[j];
        }
      }
      componentName = componentName.toLowerCase();
      if (!components[componentName]) {
        components[componentName] = [];
        if (!componentColor[componentName]) {
          componentColor[componentName] = '';
        }
        if (!componentMetalness[componentName]) {
          componentMetalness[componentName] = val?.material?.metalness ?? 0;
        }
        if (!componentRoughness[componentName]) {
          componentRoughness[componentName] = val?.material?.roughness ?? 0;
        }
      }
      components[componentName].push({
        type: val.type,
        component: val,
      });
    });
    setComponents(components);
  }, []);

  useEffect(() => {
    let avatarItems = {};
    Object.keys(components).map(val => {
      avatarItems[val] = components[val][0];
    });
    setAvatar(avatarItems);
  }, [components]);

  if (click == 'download') {
    const dataURL = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setClick('');
  }
  console.log(lights, click);

  useEffect(() => {
    if (click == 'pointLight') {
      let lightVal = lights;
      lightVal.push({
        type: 'pointLight',
        name: 'Point Light',
        position: {
          x: 100,
          y: 200,
          z: 300,
        },
        color: 'yellow',
      });
      setLights(lightVal);
      setClick('');
    } else if (click == 'spotLight') {
      let lightVal = lights;
      lightVal.push({
        type: 'spotLight',
        name: 'Spot Light',
        position: {
          x: 100,
          y: 200,
          z: 300,
        },
        color: 'yellow',
      });
      setLights(lightVal);
      setClick('');
    }
  }, [click]);
  if (click == 'pointlight') {
    console.log(click);
    setClick('');
  } else if (click == 'spotlight') {
    setClick('');
  }
  return (
    <div
      onClick={event => {
        setShowPositionSlider(false);
        setColorPicker(false);
      }}
      className="w-full h-full flex">
      <div className="h-[480px] w-[480px] flex mx-auto left-0 right-0 self-center items-center -mt-[64px] ">
        <Canvas
          dpr={[1, 2]}
          flat
          resize={{scroll: true, debounce: {scroll: 100, resize: 2}}}
          pixelRatio={2}
          camera={{position: [-15, 0, 10], fov: 15}}
          className="self-center"
          ref={canvasRef}
          onCreated={() => {
            setCanvasReady(true);
          }}
          gl={{preserveDrawingBuffer: true, logarithmicDepthBuffer: true}}>
          {Object.keys(avatar).map(val =>
            avatar[val].type == 'Mesh' ? (
              <mesh
                material-roughness={componentRoughness[val]}
                material-metalness={componentMetalness[val]}
                material-color={componentColor[val]}
                onClick={event => {
                  event.stopPropagation();
                  setComponentSelect(val);
                  setPanelsActive(true);
                  let materialColor = avatar[val].component.material.color;
                  setColor(
                    `rgb(${255 * materialColor.r},${255 * materialColor.g},${
                      255 * materialColor.b
                    })`,
                  );
                }}
                {...avatar[val].component}
                position={[
                  avatar[val].component.position.x,
                  avatar[val].component.position.y - 1,
                  avatar[val].component.position.z,
                ]}
              />
            ) : (
              <group
                {...avatar[val].component}
                position={[
                  avatar[val].component.position.x,
                  avatar[val].component.position.y - 1,
                  avatar[val].component.position.z,
                ]}>
                {Object.values(avatar[val].component.children).map(val => (
                  <mesh {...val} />
                ))}
              </group>
            ),
          )}

          {lights?.map(light =>
            light.type == 'pointLight' ? (
              <pointLight
                position={[
                  light.position.x,
                  light.position.y,
                  light.position.z,
                ]}
              />
            ) : light.type == 'spotLight' ? (
              <spotLight
                position={[
                  light.position.x,
                  light.position.y,
                  light.position.z,
                ]}
              />
            ) : (
              <></>
            ),
          )}

          <OrbitControls
            enableZoom={false}
            maxAzimuthAngle={
              orientation == 'Front'
                ? 0
                : orientation == 'Isometric'
                ? -Math.PI / 6
                : Math.PI / 3
            }
            minAzimuthAngle={
              orientation == 'Front'
                ? 0
                : orientation == 'Isometric'
                ? -Math.PI / 6
                : -Math.PI / 3
            }
            minPolarAngle={
              orientation == 'Front'
                ? Math.PI / 2
                : orientation == 'Isometric'
                ? Math.PI / 3
                : Math.PI / 3
            }
            maxPolarAngle={
              orientation == 'Front'
                ? Math.PI / 2
                : orientation == 'Isometric'
                ? Math.PI / 3
                : Math.PI / 2
            }
          />
        </Canvas>
      </div>

      <div
        className={`w-[320px] transition-all ease-in shadow-2xl absolute h-full bg-white top-0 ${
          panelsActive ? 'left-0' : '-left-[320px]'
        } py-[36px] px-[18px] `}>
        <p className={`font-medium text-md `}>
          {componentSelect[0]?.toUpperCase() + componentSelect?.substr(1)}{' '}
        </p>
        <div
          className={`flex h-[128px] relative self-center items-center overflow-x-auto `}>
          {componentSelect &&
            Object.values(components[componentSelect])?.map(val => (
              <div
                onClick={() => {
                  setAvatar(values => ({
                    ...values,
                    [componentSelect]: val,
                  }));
                }}
                className="h-[64px] w-[64px] cursor-pointer border-2 mr-2 border-blue-400 ">
                <Canvas camera={{fov: 40}} className="bg-pink-200 ">
                  <mesh {...val.component} position={0} />
                  <ambientLight />
                </Canvas>
              </div>
            ))}
        </div>
      </div>
      <div
        className={`w-[320px] transition-all ease-in shadow-2xl absolute h-full bg-white top-0 ${
          panelsActive ? 'right-0' : '-right-[320px] '
        } py-[36px] px-[18px] justify-center`}>
        <div className="flex w-full justify-between items-center">
          <p className=" font-medium mb-2">Color:</p>
          <div
            onClick={event => {
              event.stopPropagation();
              setColorPicker(!colorPicker);
            }}
            style={{backgroundColor: color}}
            className={`w-12 h-12 cursor-pointer rounded-full `}>
            {' '}
          </div>
          {colorPicker && (
            <div className="mt-4 custom-color-picker w-[284px] flex absolute top-24 box-border bg-pink-200 z-[2] ">
              <HexColorPicker
                onClick={event => {
                  event.stopPropagation();
                }}
                color={color}
                onChange={event => {
                  // setColor(event)
                  setComponentColor(val => ({
                    ...val,
                    [componentSelect]: event,
                  }));
                }}
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">
            Metallness: <span>{componentMetalness[componentSelect]} </span>
          </p>
          <input
            className="my-2 w-full border-pink-200 bg-purple-400 stroke-purple-400 "
            value={componentMetalness[componentSelect]}
            onChange={event => {
              setComponentMetalness(val => ({
                ...val,
                [componentSelect]: event.target.value,
              }));
            }}
            min={0}
            max={10}
            step={0.01}
            type={'range'}
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">
            Roughness: <span>{componentRoughness[componentSelect]} </span>
          </p>
          <input
            className="my-2 w-full border-pink-200 bg-purple-400 stroke-purple-400 "
            value={componentRoughness[componentSelect]}
            onChange={event => {
              setComponentRoughness(val => ({
                ...val,
                [componentSelect]: event.target.value,
              }));
            }}
            min={0}
            max={2}
            step={0.01}
            type={'range'}
          />
        </div>

        <div className="mt-8">
          <span className=" font-medium">Lights:</span>
          <div>
            {lights?.map((light, key) => (
              <div
                onClick={event => {
                  event.stopPropagation();
                }}
                className="relative items-center justify-between w-full py-2">
                <div className="flex justify-between mb-2 items-center">
                  <span className=" font-medium">{light.name} </span>
                  <span
                    className=" text-sm font-medium text-indigo-600 cursor-pointer"
                    onClick={() => {
                      let lightVal = lights;
                      lightVal.splice(key, 1);
                      setLights([...lightVal]);
                    }}>
                    Remove{' '}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="relative box-border w-[68px] rounded-md bg-transparent border-2 text-sm px-2 py-2 cursor-pointer"
                    onClick={() => {
                      setShowPositionSlider({key: key + 1, position: 'x'});
                    }}>
                    x : {light.position.x}
                    {showPositionSlider &&
                      showPositionSlider.key == key + 1 &&
                      showPositionSlider.position == 'x' && (
                        <div className="absolute -left-24 top-12 bg-white z-[2] py-2 px-4 shadow-md ">
                          <input
                            min={0}
                            max={1000}
                            type={'range'}
                            step={1}
                            value={light.position.x}
                            onChange={event => {
                              let lightVal = lights;
                              lightVal[key].position.x = parseInt(
                                event.target.value,
                              );
                              setLights([...lightVal]);
                            }}
                          />
                        </div>
                      )}
                  </span>

                  <span
                    className="relative box-border w-[68px] rounded-md bg-transparent border-2 text-sm px-2 py-2 cursor-pointer"
                    onClick={() => {
                      setShowPositionSlider({key: key + 1, position: 'y'});
                    }}>
                    y : {light.position.y}
                    {showPositionSlider &&
                      showPositionSlider.key == key + 1 &&
                      showPositionSlider.position == 'y' && (
                        <div className="absolute -left-24 top-12 bg-white z-[2] py-2 px-4 shadow-md ">
                          <input
                            min={0}
                            max={1000}
                            type={'range'}
                            step={1}
                            value={light.position.y}
                            onChange={event => {
                              let lightVal = lights;
                              lightVal[key].position.y = parseInt(
                                event.target.value,
                              );
                              setLights([...lightVal]);
                            }}
                          />
                        </div>
                      )}
                  </span>

                  <span
                    className="relative box-border w-[68px] rounded-md bg-transparent border-2 text-sm px-2 py-2 cursor-pointer"
                    onClick={() => {
                      setShowPositionSlider({key: key + 1, position: 'z'});
                    }}>
                    z : {light.position.z}
                    {showPositionSlider &&
                      showPositionSlider.key == key + 1 &&
                      showPositionSlider.position == 'z' && (
                        <div className="absolute -left-24 top-12 bg-white z-[2] py-2 px-4 shadow-md ">
                          <input
                            min={0}
                            max={1000}
                            type={'range'}
                            step={1}
                            value={light.position.z}
                            onChange={event => {
                              let lightVal = lights;
                              lightVal[key].position.z = parseInt(
                                event.target.value,
                              );
                              setLights([...lightVal]);
                            }}
                          />
                        </div>
                      )}
                  </span>

                  <span
                    className="w-[28px] h-[28px] relative self-center bg-blue-200 rounded-full cursor-pointer "
                    onClick={() => {
                      setShowPositionSlider({key: key + 1, position: 'color'});
                    }}>
                    {showPositionSlider &&
                      showPositionSlider.key == key + 1 &&
                      showPositionSlider.position == 'color' && (
                        <div className=" mt-4 custom-color-picker w-[284px] -left-[256px] flex absolute top-12 box-border bg-pink-200 z-[2] ">
                          <HexColorPicker
                            color={color}
                            onChange={event => {
                              setColor(event);
                              setComponentColor(val => ({
                                ...val,
                                [componentSelect]: event,
                              }));
                            }}
                          />
                        </div>
                      )}
                  </span>
                </div>
              </div>
            ))}
            ,
          </div>
        </div>
      </div>

      <div className="absolute w-[440px] h-[64px] bg-white bottom-24 mx-auto flex left-0 right-0 rounded-full justify-evenly items-center shadow-2xl">
        <div
          className={`flex cursor-pointer px-4 py-2 ${
            orientation == 'Front' ? 'bg-gray-200 rounded-full' : ''
          }`}
          onClick={() => {
            setOrientation('Front');
          }}>
          <img className="w-4 h-4 self-center " src={front} />
          <span className="mx-2">Front</span>{' '}
        </div>
        <div
          className={`flex cursor-pointer px-4 py-2 ${
            orientation == 'Isometric' ? 'bg-gray-200 rounded-full' : ''
          }`}
          onClick={() => {
            setOrientation('Isometric');
          }}>
          <img className="w-4 h-4 self-center " src={isometric} />
          <span className="mx-2">Isometric</span>{' '}
        </div>
        <div
          className={`flex cursor-pointer px-4 py-2 ${
            orientation == 'Dynamic' ? 'bg-gray-200 rounded-full' : ''
          }`}
          onClick={() => {
            setOrientation('Dynamic');
          }}>
          <img className="w-4 h-4 self-center " src={dynamic} />
          <span className="mx-2">Dynamic</span>{' '}
        </div>
      </div>
    </div>
  );
}

export default Avatar;
