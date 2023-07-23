import React, {useState} from 'react';
import logo from '../assets/images/logo.png';
import download from '../assets/images/download.png';
import icon from '../assets/images/icon.png';
import light from '../assets/images/light.png';

function Header({click, setClick, environmentValue, setEnvironmentValue}) {
  const [lightIcon, setLightIcon] = useState();
  const [environment, setEnvironment] = useState();

  const presetsObj = {
    apartment: 'lebombo_1k.hdr',
    city: 'potsdamer_platz_1k.hdr',
    dawn: 'kiara_1_dawn_1k.hdr',
    forest: 'forest_slope_1k.hdr',
    lobby: 'st_fagans_interior_1k.hdr',
    night: 'dikhololo_night_1k.hdr',
    park: 'rooitou_park_1k.hdr',
    studio: 'studio_small_03_1k.hdr',
    sunset: 'venice_sunset_1k.hdr',
    warehouse: 'empty_warehouse_01_1k.hdr',
  };

  const environmentSettings = [
    {
      name: 'Apartment',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Apartment'.toLowerCase()]
      } `,
    },
    {
      name: 'City',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['City'.toLowerCase()]
      } `,
    },
    {
      name: 'Dawn',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Dawn'.toLowerCase()]
      } `,
    },
    {
      name: 'Forest',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Forest'.toLowerCase()]
      } `,
    },
    {
      name: 'Lobby',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Lobby'.toLowerCase()]
      } `,
    },
    {
      name: 'Night',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Night'.toLowerCase()]
      } `,
    },
    {
      name: 'Park',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Park'.toLowerCase()]
      } `,
    },
    {
      name: 'Studio',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Studio'.toLowerCase()]
      } `,
    },
    {
      name: 'Sunset',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Sunset'.toLowerCase()]
      } `,
    },
    {
      name: 'Warehouse',
      url: `https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/${
        presetsObj['Warehouse'.toLowerCase()]
      } `,
    },
  ];
  return (
    <div className="w-full flex h-[56px] px-[16px] py-[13px] shadow-md justify-between ">
      <img src={logo} />
      <div className="flex py-[2px] ">
        <div className="relative">
          <img
            onClick={() => {
              setClick('environment');
              setEnvironment(!environment);
              setLightIcon(0);
            }}
            className={`mx-2 cursor-pointer rounded-full p-2 w-[32px] h-[32px] ${
              environment ? 'bg-gray-200' : ''
            } `}
            src={icon}
          />
          <div
            className={`w-[180px] bg-pink-200 z-[2] absolute top-[36px] rounded-sm ${
              environment ? 'visible' : 'hidden'
            } `}>
            <p
              className="font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm"
              onClick={() => {
                setClick('pointLight');
                setEnvironment(!environment);
              }}>
              Point Light{' '}
            </p>
            <p
              className="font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm"
              onClick={() => {
                setClick('spotLight');
                setEnvironment(!environment);
              }}>
              Spot Light{' '}
            </p>
            <p
              className="font-medium px-4 py-2 hover:bg-white bg-gray-200 cursor-pointer text-sm"
              onClick={() => {
                setClick('ambientLight');
                setEnvironment(!environment);
              }}>
              Ambient Light{' '}
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            onClick={() => {
              setClick('light');
              setLightIcon(!lightIcon);
              setEnvironment(0);
            }}
            className={`mx-2 cursor-pointer rounded-full p-2 w-[32px] h-[32px] ${
              lightIcon ? 'bg-gray-200' : ''
            } `}
            src={light}
          />

          <div
            className={`w-[180px] bg-pink-200 z-[2] absolute top-[36px] rounded-sm ${
              lightIcon ? 'visible' : 'hidden'
            } `}>
            {environmentSettings.map(val => (
              <p
                className={`font-medium px-4 py-2 hover:bg-white ${
                  environmentValue === val.name.toLowerCase()
                    ? ' bg-white '
                    : ' bg-gray-200 '
                }cursor-pointer text-sm`}
                onClick={() => {
                  setEnvironmentValue(val.name.toLowerCase());
                  setLightIcon(!lightIcon);
                }}>
                {val.name}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => {
            setClick('download');
          }}
          className="flex items-center justify-between bg-indigo-400 h-[40px] w-[120px] self-center px-4 rounded cursor-pointer">
          <span className="self-center">
            <img src={download} />
          </span>
          <span className="text-sm font-medium text-white self-center ">
            Download
          </span>
        </button>
      </div>
    </div>
  );
}

export default Header;
