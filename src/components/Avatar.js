import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from '@react-three/drei';
import {Canvas, useLoader} from '@react-three/fiber';
import React, {useEffect, useRef, useState} from 'react';
import {
  HexAlphaColorPicker,
  HexColorInput,
  HexColorPicker,
} from 'react-colorful';
import {Group} from 'three';
import front from '../assets/images/front.png';
import colorWheel from '../assets/images/colorWheel.png';
import isometric from '../assets/images/isometric.png';
import dynamic from '../assets/images/dynamic.png';
import {getGLBFile, getResponseAPI, getapi} from '../services/services';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

function Avatar({click, setClick, environmentValue, setEnvironmentValue}) {
  const [apiData, setApiData] = useState(null);
  const [componentsGLB, setComponentsGLB] = useState(null);
  const {nodes, materials} = useGLTF(require('../assets/gftf/avatar.gltf'));
  const [canvasReady, setCanvasReady] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [color, setColor] = useState('blue');
  const [colorPicker, setColorPicker] = useState();
  const [orientation, setOrientation] = useState('Front');
  const [showPositionSlider, setShowPositionSlider] = useState(false);
  const [lights, setLights] = useState([
    {
      type: 'pointLight',
      name: 'Point Light',
      position: {
        x: -600,
        y: 200,
        z: 300,
      },
      color: '#FFFAE6',
    },
    {
      type: 'spotLight',
      name: 'Spot Light',
      position: {
        x: 600,
        y: -200,
        z: 300,
      },
      color: '#FFFAE6',
    },
  ]);
  const [original, setOriginal] = useState({
    lights: JSON.parse(JSON.stringify(lights)),
  });
  const canvasRef = useRef(null);
  const [componentSelect, setComponentSelect] = useState('');

  const [panelsActive, setPanelsActive] = useState(false);

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  useEffect(() => {
    async function getData() {
      setApiData(await getResponseAPI());
    }
    getData();
  }, []);

  useEffect(() => {
    if (apiData) {
      const loader = new GLTFLoader();
      let data = {};
      data['base'] = {
        ...apiData.base,
      };
      loader.load(apiData.base.file, gltf => {
        let {scene} = gltf;
        let variations = {};
        variations[scene.name] = {};
        variations[scene.name]['colors'] = data['base']?.colors;
        variations[scene.name]['currentColor'] = data['base'].preset.color;
        variations[scene.name]['element'] = scene;
        variations[scene.name]['image'] = '';
        variations[scene.name]['name'] = scene.name;
        variations[scene.name]['roughness'] = 0;
        variations[scene.name]['metalness'] = 0;
        variations[scene.name]['rule'] = {};
        data['base'] = {
          ...data['base'],
          scene: scene,
          variations: variations,
        };
        setComponentsGLB({...data});
      });
      data['categories'] = {};
      apiData.category.map(category => {
        let variationData = {};
        category.variation.map(variation => {
          variationData[variation.name] = {...variation};
          variationData[variation.name]['rule'] = {};
          if (variation.rule) {
            variation.rule.map(val => {
              variationData[variation.name]['rule'][val.category] = val;
            });
          }
          if (category.rule) {
            category.rule.map(val => {
              if (val.category in variationData[variation.name]['rule']);
              else variationData[variation.name]['rule'][val.category] = val;
            });
          }
        });
        loader.load(category.file, gltf => {
          let {scene} = gltf;
          scene.children.map(val => {
            if (val.name in variationData) {
              variationData[val.name] = {
                ...variationData[val.name],
                metalness: val?.material?.metalness ?? 0,
                roughness: val?.material?.roughness ?? 0,
                currentColor: rgbToHex(
                  Math.floor(val?.material?.color?.r * 255),
                  Math.floor(val?.material?.color?.g * 255),
                  Math.floor(val?.material?.color?.b * 255),
                ),
                colors: [],
                element: val,
              };
            }
          });
          data['categories'][category['name']] = {
            ...category,
            variation: variationData,
          };
          setComponentsGLB({...data});
        });
      });
    }
  }, [apiData]);

  useEffect(() => {
    if (
      componentSelect &&
      componentSelect?.item &&
      componentSelect?.hasVariations
    ) {
      let avatarVal = avatar;
      avatarVal[componentSelect?.component] =
        componentsGLB?.categories[componentSelect?.component]?.variation[
          componentSelect?.item
        ];
      let copyAvatarVal = {...avatarVal};
      Object.values(copyAvatarVal[componentSelect.component].rule).map(rule => {
        let currentValue = avatarVal[rule.category]?.name;
        if (rule?.preserve && rule?.preservel?.length) {
          if (currentValue in rule.preserve);
          else {
            if (rule.variation) {
              avatarVal[rule.category] =
                componentsGLB['categories'][rule.category]['variations'][
                  rule.variation
                ];
            } else {
              delete avatarVal[rule.category];
            }
          }
        } else {
          if (rule.variation) {
            avatarVal[rule.category] =
              componentsGLB['categories'][rule.category]['variations'][
                rule.variation
              ];
          } else {
            delete avatarVal[rule.category];
          }
        }
      });

      setAvatar({...avatarVal});
    }
  }, [componentSelect]);

  useEffect(() => {
    if (componentsGLB?.categories) {
      let avatarVal = {},
        copyAvatarVal = {};
      let val = componentsGLB?.categories;
      Object.keys(componentsGLB?.categories).map(category => {
        if (val[category]?.preset) {
          let variation =
            val[category].variation[val[category].preset.variation];
          variation.currentColor = val[category].preset.color;

          variation['hasVariations'] = true;
          avatarVal[category] = variation;
        }
      });
      setOriginal(val => ({
        lights: val.lights,
        avatar: JSON.parse(JSON.stringify(avatarVal)),
      }));
      if (componentsGLB?.base?.variations) {
        componentsGLB?.base?.variations['Scene'].element.children.map(val => {
          avatarVal[val.name] = {
            ...componentsGLB?.base?.variations['Scene'],
            element: val,
            metalness: val.metalness ?? 0,
            roughness: val.roughness ?? 0,
            hasVariations: false,
          };
          if (!componentsGLB?.base?.preset?.applyTo.includes(val.name)) {
            avatarVal[val.name].currentColor = '';
          }
        });
      }
      // avatarVal['base'] = componentsGLB?.base.variations['Scene'];

      setAvatar(avatarVal);
    }
  }, [componentsGLB]);
  console.log(componentsGLB);

  if (click == 'download') {
    const canvas = canvasRef.current;
    const bigCanvas = document.createElement('canvas');
    const bigContext = bigCanvas.getContext('2d');

    bigCanvas.width = 3000;
    bigCanvas.height = 3000;

    bigContext.imageSmoothingEnabled = true;

    bigContext.drawImage(canvas, 0, 0, bigCanvas.width, bigCanvas.height);

    const dataURL = bigCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setClick('');
  }

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
        color: '#FFFFFF',
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
        color: '#FFFFFF',
      });
      setLights(lightVal);
      setClick('');
    }
  }, [click]);
  if (click == 'pointlight') {
    setClick('');
  } else if (click == 'spotlight') {
    setClick('');
  }
  console.log(avatar);
  return (
    <div
      onClick={event => {
        setShowPositionSlider(false);
        setColorPicker(false);
      }}
      className="w-full h-full flex">
      <div className="h-[480px] w-[480px] flex mx-auto left-0 right-0 self-center items-center -mt-[64px] ">
        <button
          onClick={() => {
            // setApiData({...setApiData});
            // setComponentsGLB({...setComponentsGLB});
            Object.keys(original.avatar).map(val => {
              console.log(componentsGLB.categories[val]);
              original.avatar[val].element =
                componentsGLB.categories[val].variation[
                  original.avatar[val].name
                ].element;
            });
            setLights([...original.lights]);
            setAvatar({...original.avatar});
          }}
          className={`${
            original.avatar == JSON.stringify(avatar) ? 'hidden' : 'visible'
          } absolute px-[12px] py-[8px] rounded-full shadow-lg top-[48px] left-0 right-0 w-fit mx-auto bg-white font-semibold`}>
          Reset
        </button>

        <Canvas
          dpr={[1, 2]}
          flat
          resize={{scroll: true, debounce: {scroll: 100, resize: 2}}}
          camera={{position: [-15, 0, 10], fov: 15}}
          className="self-center"
          ref={canvasRef}
          onCreated={() => {
            setCanvasReady(true);
          }}
          gl={{preserveDrawingBuffer: true, logarithmicDepthBuffer: true}}>
          {/* <group
            onClick={() => {
              setComponentSelect({
                component: 'base',
                item: Object.keys(componentsGLB?.base?.variations)[0],
              });
            }}>
            {componentsGLB?.base &&
              componentsGLB?.base?.scene?.children?.map((val, keyId) =>
                val.type == 'Mesh' ? (
                  <mesh
                    material-color={val.name == 'skin' && 'pink'}
                    key={`mesh-${keyId}`}
                    // material-roughness={componentRoughness[val]}
                    // material-metalness={componentMetalness[val]}
                    // material-color={componentColor[val]}
                    onClick={event => {
                      console.log(val.name);
                      // event.stopPropagation();
                      // setComponentSelect('base');
                      // setPanelsActive(true);
                      // let materialColor = avatar[val].component.material.color;
                      // setColor(
                      //   `rgb(${255 * materialColor.r},${255 * materialColor.g},${
                      //     255 * materialColor.b
                      //   })`,
                      // );
                    }}
                    {...val}
                    position={[
                      val.position.x,
                      val.position.y - 1,
                      val.position.z,
                    ]}
                  />
                ) : (
                  <group
                    key={`group-${keyId}`}
                    {...val}
                    position={[
                      val.position.x,
                      val.position.y - 1,
                      val.position.z,
                    ]}>
                    {Object.values(val.children).map(values => (
                      <mesh
                        onClick={() => {
                          console.log(values.name);
                        }}
                        material-color={values.name == 'skin' && 'pink'}
                        {...values}
                      />
                    ))}
                  </group>
                ),
              )}
          </group> */}

          {Object.keys(avatar).map(val =>
            avatar[val].element.type == 'Mesh' ? (
              <mesh
                material-roughness={avatar[val].roughness}
                material-metalness={avatar[val].metalness}
                material-color={avatar[val].currentColor}
                onClick={event => {
                  event.stopPropagation();
                  console.log(val);
                  setComponentSelect({
                    component: val,
                    item: avatar[val]?.element?.name,
                    hasVariations: avatar[val]?.hasVariations,
                  });
                  setPanelsActive(true);
                  // let materialColor = avatar[val].component.material.color;
                  // setColor(
                  //   `rgb(${255 * materialColor.r},${255 * materialColor.g},${
                  //     255 * materialColor.b
                  //   })`,
                  // );
                }}
                {...avatar[val].element}
                position={[
                  avatar[val].element.position.x,
                  avatar[val].element.position.y - 1,
                  avatar[val].element.position.z,
                ]}
              />
            ) : (
              <group
                {...avatar[val].element}
                position={[
                  avatar[val].element.position.x,
                  avatar[val].element.position.y - 1,
                  avatar[val].element.position.z,
                ]}>
                {Object.values(avatar[val].element.children).map(values => (
                  <mesh
                    {...values}
                    material-roughness={avatar[val].roughness}
                    material-metalness={avatar[val].metalness}
                    material-color={avatar[val].currentColor}
                    onClick={event => {
                      event.stopPropagation();
                      setComponentSelect({
                        component: val,
                        item: avatar[val]?.element?.name,
                        hasVariations: avatar[val]?.hasVariations,
                      });
                    }}
                  />
                ))}
              </group>
            ),
          )}

          {environmentValue === null &&
            lights?.map(light =>
              light.type == 'pointLight' ? (
                <pointLight
                  position={[
                    light.position.x,
                    light.position.y,
                    light.position.z,
                  ]}
                  color={light.color}
                />
              ) : light.type == 'spotLight' ? (
                <spotLight
                  position={[
                    light.position.x,
                    light.position.y,
                    light.position.z,
                  ]}
                  color={light.color}
                />
              ) : (
                <ambientLight intensity={0.4} />
              ),
            )}
          <ambientLight intensity={0.4} />
          {environmentValue && (
            <Environment
              preset={environmentValue}
              // blur={0.5}
            />
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
          {componentSelect &&
            componentSelect?.component[0]?.toUpperCase() +
              componentSelect?.component?.substr(1)}{' '}
        </p>
        <div
          className={`flex flex-wrap relative self-center items-center max-h-[480px] overflow-x-hidden overflow-y-scroll`}>
          {componentSelect &&
            componentSelect?.hasVariations &&
            Object.values(
              componentsGLB.categories[componentSelect?.component]?.variation,
            )?.map(val => (
              <div
                onClick={() => {
                  setComponentSelect(component => ({
                    ...component,
                    item: val.name,
                    hasVariations: true,
                  }));
                  // setAvatar(values => ({
                  //   ...values,
                  //   [componentSelect]: val,
                  // }));
                }}
                className={`h-[64px] w-[64px] cursor-pointer border-2 mr-[6px] mb-[8px] ${
                  componentSelect?.item == val.name
                    ? 'border-blue-400'
                    : 'border-gray-200'
                }`}>
                {/* <Canvas camera={{fov: 40}} className="bg-pink-200 ">
                  <mesh {...val.component} position={0} />
                  <ambientLight />
                </Canvas> */}
                <img src={val.image} />
              </div>
            ))}
        </div>

        <p className={`text-[16px] font-semibold mt-[64px]`}>Categories:</p>
        <div className={`flex flex-wrap mt-[8px]`}>
          {componentsGLB &&
            Object.keys(componentsGLB.categories).map(val => (
              <p
                className={`px-[8px] py-[4px] rounded-md mr-[8px] cursor-pointer ${
                  componentSelect?.component == val ? 'border-purple-600' : ''
                } border-2`}
                onClick={() => {
                  setComponentSelect({
                    component: val,
                    item: avatar[val]?.name,
                    hasVariations: true,
                  });
                }}>
                {val}
              </p>
            ))}
        </div>
      </div>
      <div
        className={`w-[320px] transition-all ease-in shadow-2xl absolute h-full bg-white top-0 ${
          panelsActive ? 'right-0' : '-right-[320px] '
        } py-[36px] px-[18px] justify-center`}>
        <div className="w-full relative">
          <p className=" font-medium mb-2">
            {componentSelect &&
              componentSelect?.component[0]?.toUpperCase() +
                componentSelect?.component?.substr(1)}{' '}
            Color:
          </p>
          <p
            onClick={() => {
              let copyAvatarComponent = avatar[componentSelect?.component];
              copyAvatarComponent.currentColor =
                original.avatar[componentSelect?.component]?.currentColor;
              setAvatar(val => ({
                ...val,
                [componentSelect?.component]: copyAvatarComponent,
              }));
            }}
            className={`absolute top-0 right-0 font-medium text-indigo-600 cursor-pointer`}>
            Reset{' '}
          </p>

          {colorPicker && (
            <div className="mt-4 custom-color-picker w-[284px] flex absolute top-24 box-border bg-pink-200 z-[2] ">
              <HexColorPicker
                onClick={event => {
                  event.stopPropagation();
                }}
                color={avatar[componentSelect.component].currentColor}
                onChange={event => {
                  let component = avatar[componentSelect.component];
                  component.currentColor = event;
                  setAvatar(val => ({
                    ...val,
                    [componentSelect.component]: component,
                  }));
                }}
              />
            </div>
          )}
          <div className={`flex`}>
            {componentSelect && (
              <div
                onClick={event => {
                  event.stopPropagation();
                  setColorPicker(!colorPicker);
                }}
                style={{
                  '--tw-ring-color':
                    avatar[componentSelect.component]?.currentColor,
                }}
                className={`w-[24px] h-[24px] relative ${
                  avatar[componentSelect?.component] &&
                  avatar[componentSelect?.component]?.currentColor in
                    avatar[componentSelect?.component]?.colors
                    ? ''
                    : 'ring-2 ring-offset-2 ring-violet-600'
                } cursor-pointer rounded-full flex juce items-center `}>
                <img src={colorWheel} className={`w-full h-full`} />
              </div>
            )}
            {avatar &&
              componentSelect &&
              avatar[componentSelect?.component] &&
              avatar[componentSelect?.component].colors.map(color => (
                <div
                  onClick={event => {
                    event.stopPropagation();
                    let component = avatar[componentSelect.component];
                    component.currentColor = color;
                    setAvatar(val => ({
                      ...val,
                      [componentSelect.component]: component,
                    }));
                  }}
                  style={{backgroundColor: color}}
                  className={`w-[24px] ml-[8px] relative h-[24px]${
                    avatar[componentSelect?.component] &&
                    avatar[componentSelect?.component]?.currentColor in
                      avatar[componentSelect?.component]?.colors
                      ? 'ring-2 ring-offset-2 ring-violet-600'
                      : ''
                  } cursor-pointer rounded-full `}>
                  {' '}
                </div>
              ))}
          </div>
        </div>

        <div className="mt-4 relative">
          <p className="text-sm font-medium">
            Metalness:{' '}
            <span>
              {Math.round(avatar[componentSelect?.component]?.metalness * 100) /
                100}{' '}
            </span>
          </p>
          <p
            onClick={() => {
              let copyAvatarComponent = avatar[componentSelect?.component];
              copyAvatarComponent.metalness =
                original.avatar[componentSelect?.component]?.metalness;
              setAvatar(val => ({
                ...val,
                [componentSelect?.component]: copyAvatarComponent,
              }));
            }}
            className={`absolute top-0 right-0 font-medium text-indigo-600 cursor-pointer`}>
            Reset{' '}
          </p>
          <input
            className="my-2 w-full border-pink-200 bg-purple-400 stroke-purple-400 "
            value={avatar[componentSelect?.component]?.metalness}
            onChange={event => {
              let component = avatar[componentSelect?.component];
              component.metalness = event.target.value;
              setAvatar(val => ({
                ...val,
                [componentSelect?.component]: component,
              }));
            }}
            min={0}
            max={2}
            step={0.01}
            type={'range'}
          />
        </div>

        <div className="mt-4 relative">
          <p className="text-sm font-medium">
            Roughness:{' '}
            <span>
              {Math.round(avatar[componentSelect?.component]?.roughness * 100) /
                100}{' '}
            </span>
          </p>
          <p
            onClick={() => {
              let copyAvatarComponent = avatar[componentSelect?.component];
              copyAvatarComponent.roughness =
                original.avatar[componentSelect?.component]?.roughness;
              setAvatar(val => ({
                ...val,
                [componentSelect?.component]: copyAvatarComponent,
              }));
            }}
            className={`absolute top-0 right-0 font-medium text-indigo-600 cursor-pointer`}>
            Reset{' '}
          </p>

          <input
            className="my-2 w-full border-pink-200 bg-purple-400 stroke-purple-400 "
            value={avatar[componentSelect?.component]?.roughness}
            onChange={event => {
              let component = avatar[componentSelect?.component];
              component.roughness = event.target.value;
              setAvatar(val => ({
                ...val,
                [componentSelect?.component]: component,
              }));
            }}
            min={0}
            max={2}
            step={0.01}
            type={'range'}
          />
        </div>
        <div
          className={`mt-8 relative ${
            environmentValue !== null ? 'visible' : 'hidden'
          } `}>
          <span className=" font-medium">{`Environment: ${environmentValue?.toUpperCase()}`}</span>
          <p
            onClick={() => {
              setEnvironmentValue(null);
            }}
            className={`absolute top-0 right-0 font-medium text-indigo-600 cursor-pointer`}>
            Remove{' '}
          </p>
        </div>

        <div
          className={`mt-8 relative ${
            environmentValue === null ? 'visible' : 'hidden'
          } `}>
          <span className=" font-medium">Lights:</span>
          <p
            onClick={() => {
              setLights([...original.lights]);
            }}
            className={`absolute top-0 right-0 font-medium text-indigo-600 cursor-pointer`}>
            Reset{' '}
          </p>

          <div className={`max-h-[220px] overflow-scroll`}>
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
                            min={-1000}
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
                            min={-1000}
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
                            min={-1000}
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

                  <div
                    onClick={() => {
                      if (showPositionSlider.key !== key + 1) {
                        setShowPositionSlider({
                          key: key + 1,
                          position: 'color',
                        });
                      } else {
                        setShowPositionSlider(false);
                      }
                    }}
                    style={{
                      '--tw-ring-color': light.color,
                    }}
                    className={`w-[24px] h-[24px] ${'ring-2 ring-offset-2 ring-violet-600'} cursor-pointer rounded-full flex juce items-center self-center `}>
                    <img src={colorWheel} className={`w-full h-full`} />
                    {showPositionSlider &&
                      showPositionSlider.key == key + 1 &&
                      showPositionSlider.position == 'color' && (
                        <div className=" mt-4 custom-color-picker w-[284px] right-[12px] flex absolute top-12 box-border bg-pink-200 z-[2] ">
                          <HexColorPicker
                            color={light.color}
                            onChange={event => {
                              let lightVal = lights;
                              lightVal[key] = {...light, color: event};
                              setLights([...lightVal]);
                              // setColor(event);
                              // setComponentColor(val => ({
                              //   ...val,
                              //   [componentSelect]: event,
                              // }));
                            }}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
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
