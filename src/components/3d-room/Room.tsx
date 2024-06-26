/*
Splitted 3D Model using: https://github.com/pmndrs/gltfjsx
*/

import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSpring } from "@react-spring/three";
import { Html, Stage } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import clsx from "clsx";
import { useControls } from "leva";
import { Mesh } from "three";
import useLocalStorage from "use-local-storage";

import { AboutLabel } from "./AboutLabel";
import { furnitureColors } from "./furnitureColors";
import { InfoBanner } from "./InfoBanner";
import { ModelParentGroup } from "./ModelGroup";

export function RoomModel(props: JSX.IntrinsicElements["group"]) {
  const fanBladesRef = useRef<Mesh>();
  const [fanBladeSpeedMultiplier, setFanBladeSpeedMultiplier] = useState(1);
  const { springBladeMultiplier } = useSpring({
    springBladeMultiplier: fanBladeSpeedMultiplier,
    config: {
      duration: 1000,
    },
  });

  const positions = useControls(
    "Positions",
    {
      about: {
        x: -4.01,
        y: 0.4,
        z: 0,
      },
    },
    {
      collapsed: true,
    }
  );
  const materialColors = useControls("Material Colors", furnitureColors, {
    collapsed: true,
  });

  const navigate = useNavigate();
  const { gl, scene, camera } = useThree();
  const [_renderImage, setRenderImage] = useLocalStorage("renderImage", "");
  const [_cameraPosition, setCameraPosition] = useLocalStorage<number[]>(
    "cameraPosition",
    []
  );
  useFrame(() => {
    if (!fanBladesRef.current) return;
    fanBladesRef.current.rotation.z += 0.06 * springBladeMultiplier.get();
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const cameraPos = searchParams.get("pos");

    if (cameraPos) {
      const cameraPosArray = cameraPos.split(",").map((pos) => parseFloat(pos));
      if (cameraPosArray.length !== 3) return;
      camera.position.fromArray(cameraPosArray);
    }

    // reset search params
    setSearchParams({});
  }, []);

  const logInToPC = (e) => {
    e.stopPropagation();
    gl.render(scene, camera);
    const dataURL = gl.domElement.toDataURL();
    setRenderImage(dataURL);
    setCameraPosition(camera.position.toArray());
    navigate("/info");
  };

  return (
    <Stage
      shadows={{
        type: "contact",
        blur: 2,
        opacity: 0.4,
      }}
      intensity={1}
      preset="portrait"
      environment={null}
      adjustCamera={1.5}
    >
      <Html
        wrapperClass="banner"
        className="w-screen h-screen"
        zIndexRange={[11, 20]}
      >
        <InfoBanner />
      </Html>
      <Html
        zIndexRange={[31, 40]}
        position={[positions.about.x, positions.about.y, positions.about.z]}
        rotation={[0, -Math.PI / 2, 0]}
        occlude
        transform
        scale={0.5}
      >
        <AboutLabel />
      </Html>
      <group {...props} dispose={null}>
        <ModelParentGroup
          floatIntensity={0}
          groupKey="Base"
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Room",
                clickedColor: materialColors.wallColor,
                clickedContent: "It's just the wall and floor. 🧱",
                showComingSoonLabel: true,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Tiles",
                clickedColor: materialColors.floorColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Bin",
                clickedColor: materialColors.binColor,
                position: [-3.238, 0.7, -3.282],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Rack",
                clickedColor: materialColors.rackColor,
                position: [-3.256, 3.233, -1.357],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey="Bed"
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Bed_Sheet",
                clickedColor: materialColors.bedSheetColor,
                clickedContent:
                  "Smart developers recharge with a \nday-time sleep. 🌞",
                position: [2.325, 1.688, -0.908],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Bed_Pillow",
                clickedColor: materialColors.bedPillowColor,
                position: [2.473, 1.925, -0.311],
                rotation: [-Math.PI, 0.657, -Math.PI],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Bed_Pillow_Small",
                clickedColor: materialColors.bedPillowColor,
                position: [1.404, 1.846, 1.352],
                rotation: [-Math.PI, 1.299, -Math.PI],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Bed_Frame",
                clickedColor: materialColors.bedFrameColor,
                position: [2.347, 1.494, -0.872],
              },
            },
            {
              childType: "group",
              props: {
                groupKey: "Phone",
                position: [2.479, 1.758, 1.078],
                rotation: [0, -0.194, 0],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube037",
                      clickedColor: materialColors.phoneColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube037_1",
                      clickedColor: materialColors.phoneColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube037_2",
                      clickedColor: materialColors.phoneColor,
                    },
                  },
                ],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey="Chair"
          position={[-0.707, 1.979, 1.904]}
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Chair_Back",
                clickedColor: materialColors.chairCushionColor,
                clickedContent: "🏆 Achievement unlocked:\nComfort Level 100",
                contentTheme: "dark",
              },
            },

            {
              childType: "group",
              props: {
                groupKey: "Chair_Bottom",
                position: [-0.615, -0.508, 0],
                rotation: [0, -1.571, 0],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Chair_Cushion_Bottom",
                      clickedColor: materialColors.chairCushionColor,
                    },
                  },
                  {
                    childType: "group",
                    props: {
                      groupKey: "Chair_Wheels",
                      position: [0, -0.196, -0.152],
                      rotation: [0, 1.571, 0],
                      elements: [
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Chair_Bottom_Cylinder",
                            clickedColor: materialColors.chairMetalColor,
                          },
                        },
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Chair_Wheels_Holder",
                            clickedColor: materialColors.chairMetalColor,
                            position: [0, -0.499, 0],
                          },
                        },
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Chair_Wheels001",
                            clickedColor: materialColors.chairWheelColor,
                            position: [0.882, -0.653, 0.002],
                          },
                        },
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Chair_Wheels002",
                            clickedColor: materialColors.chairWheelColor,
                            position: [0.271, -0.653, 0.839],
                          },
                        },
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Chair_Wheels003",
                            clickedColor: materialColors.chairWheelColor,
                            position: [0.274, -0.653, -0.838],
                          },
                        },
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Chair_Wheels004",
                            clickedColor: materialColors.chairWheelColor,
                            position: [-0.712, -0.653, -0.52],
                          },
                        },
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Chair_Wheels005",
                            clickedColor: materialColors.chairWheelColor,
                            position: [-0.715, -0.653, 0.517],
                          },
                        },
                      ],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Chair_Handle_Stands",
                      clickedColor: materialColors.chairHandleColor,
                      position: [0.061, 0, 0],
                      rotation: [0, 1.571, 0],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Chair_Handles",
                      clickedColor: materialColors.chairHandleColor,
                      position: [-0.79, 0.329, 0.032],
                      rotation: [0, 1.571, 0],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Chair_Plate",
                      clickedColor: materialColors.chairMetalColor,
                      position: [0, -0.149, -0.152],
                      rotation: [0, 1.571, 0],
                    },
                  },
                ],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Chair_Pillow_Bottom",
                clickedColor: materialColors.chairPillowColor,
                position: [0.225, 1.308, 0],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Chair_Pillow_Top",
                clickedColor: materialColors.chairPillowColor,
                position: [-0.148, -0.285, 0],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey={["Computer", "1"]}
          floatIntensity={0}
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Table",
                clickedColor: materialColors.tableColor,
                position: [0.044, 0, 0.783],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "CPU",
                clickedColor: materialColors.computerFrameColor,
                position: [-2.955, 1.008, 3.21],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey={["Computer", "2"]}
          elements={[
            {
              childType: "group",
              props: {
                groupKey: "Monitor",
                position: [-3.22, 2.848, 2.971],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube001",
                      clickedColor: materialColors.computerFrameColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube001_1",
                      clickedColor: materialColors.monitorScreenColor,
                      clickedContent: (
                        <>
                          <span>
                            Don't worry, it's not judging your code...or is it?
                            💻
                          </span>
                          <br />
                          <button
                            className="p-2 px-4 mt-2 bg-gray-800 text-white rounded-full z-[100] cursor-pointer"
                            onClick={logInToPC}
                          >
                            Log into this PC
                          </button>
                        </>
                      ),
                    },
                  },
                ],
              },
            },
            {
              childType: "group",
              props: {
                groupKey: "Mouse",
                position: [-2.737, 2.078, 1.212],
                rotation: [0, 0.337, 0],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube004",
                      clickedColor: materialColors.computerFrameColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube004_1",
                      clickedColor: materialColors.mouseLightColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Mouse_Wheel",
                      clickedColor: materialColors.computerFrameColor,
                      position: [-0.061, -0.004, 0],
                    },
                  },
                ],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Mouse_Pad",
                clickedColor: materialColors.mousePadColor,
                position: [-2.67, 2.057, 1.117],
              },
            },
            {
              childType: "group",
              props: {
                groupKey: "Speaker_A",
                position: [-3.239, 2.164, 3.556],
                rotation: [0, 0.542, 0],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube005",
                      clickedColor: materialColors.computerFrameColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube005_1",
                      clickedColor: materialColors.speakerCanvasColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube023",
                      clickedColor: materialColors.speakerButtonColor,
                      position: [0.077, -0.08, 0.061],
                      rotation: [0, 0, 0.242],
                      scale: [0.085, 0.114, 0.102],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube030",
                      clickedColor: materialColors.speakerButtonColor,
                      position: [0.077, -0.08, 0.032],
                      rotation: [0, 0, 0.242],
                      scale: [0.085, 0.114, 0.102],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube031",
                      clickedColor: materialColors.speakerButtonColor,
                      position: [0.081, -0.079, 0.009],
                      rotation: [0, 0, 0.242],
                      scale: [0.01, 0.029, 0.026],
                    },
                  },
                ],
              },
            },
            {
              childType: "group",
              props: {
                groupKey: "Speaker_B",
                position: [-3.535, 2.164, 1.459],
                rotation: [0, -0.315, 0],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube005",
                      clickedColor: materialColors.computerFrameColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube005_1",
                      clickedColor: materialColors.speakerCanvasColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube023",
                      clickedColor: materialColors.speakerButtonColor,
                      position: [0.077, -0.08, 0.061],
                      rotation: [0, 0, 0.242],
                      scale: [0.085, 0.114, 0.102],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube030",
                      clickedColor: materialColors.speakerButtonColor,
                      position: [0.077, -0.08, 0.032],
                      rotation: [0, 0, 0.242],
                      scale: [0.085, 0.114, 0.102],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube031",
                      clickedColor: materialColors.speakerButtonColor,
                      position: [0.081, -0.079, 0.009],
                      rotation: [0, 0, 0.242],
                      scale: [0.01, 0.029, 0.026],
                    },
                  },
                ],
              },
            },
            {
              childType: "group",
              props: {
                groupKey: "Keyboard",
                position: [-2.737, 2.074, 2.217],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Keyboard",
                      clickedColor: materialColors.keyboardColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Keyboard_lights",
                      clickedColor: materialColors.computerFrameColor,
                      position: [-0.051, 0.017, -0.37],
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Keys",
                      clickedColor: materialColors.computerFrameColor,
                      position: [0.042, 0.017, -0.502],
                    },
                  },
                ],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey="Mug"
          floatIntensity={0}
          elements={[
            {
              childType: "group",
              props: {
                groupKey: "Cup",
                position: [-2.692, 2.053, 3.406],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Circle",
                      clickedColor: materialColors.mugColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Circle_1",
                      clickedColor: materialColors.coffeeColor,
                    },
                  },
                ],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Mug_Hold",
                clickedColor: materialColors.cupHolderColor,
                clickedContent: "Caffeine: The programmer's fuel. ☕",
                contentTheme: "dark",
                position: [-2.692, 2.05, 3.406],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey="TouchGrass"
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Touch_Grass",
                position: [-2.955, 0.512, 1.681],
                clickedColor: materialColors.matLettersColor,
              },
            },
            {
              childType: "group",
              props: {
                groupKey: "Mat_Plain",
                position: [-2.955, 0.475, 1.681],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube016_1",
                      clickedColor: materialColors.matColor,
                      clickedContent: "Go Touch Grass! 🌱",
                      contentTheme: "dark",
                    },
                  },
                ],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Mat_Grass",
                clickedColor: materialColors.grassColor,
                outlineOpacity: 0,
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey="Cupboard"
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Cupboard_Frame",
                clickedColor: materialColors.cupboardColor,
                contentTheme: "dark",
                position: [-1.186, 3.455, -3.061],
                clickedContent: "No skeletons here, just old code. 🪶",
                showComingSoonLabel: true,
              },
            },
            {
              childType: "group",
              props: {
                groupKey: "Cupboard_Dors",
                position: [-2.705, 3.206, -2.399],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube025",
                      clickedColor: materialColors.cupboardColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Cube025_1",
                      clickedColor: materialColors.cupboardMetalColor,
                    },
                  },
                ],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Cupboard_Key_Hole",
                clickedColor: materialColors.cupboardMetalColor,
                position: [-1.038, 2.585, -2.399],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Cupboard_Key",
                clickedColor: materialColors.cupboardKeyColor,
                position: [-1.038, 2.585, -2.398],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Cupboard_Legs",
                clickedColor: materialColors.cupboardMetalColor,
                position: [-1.186, 3.455, -3.061],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey="Bin"
          onClick={() => {}}
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Bin",
                clickedColor: "#fff",
                position: [-3.238, 0.7, -3.282],
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Rack",
                clickedColor: "#fff",
                position: [-3.256, 3.233, -1.357],
              },
            },
          ]}
        />
        <ModelParentGroup
          groupKey="Fan"
          floatIntensity={0}
          elements={[
            {
              childType: "group",
              props: {
                groupKey: "FanHead",
                position: [2.532, 3.114, 2.892],
                elements: [
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Fan_Brain",
                      clickedColor: materialColors.fanBodyColor,
                    },
                  },
                  {
                    childType: "mesh",
                    props: {
                      modelKey: "Fan_Blades",
                      position: [-0.255, 0.482, -0.034],
                      rotation: [0, 1.436, 0],
                      clickedColor: materialColors.fanBladeColor,
                      clickedContent:
                        "Cooling down \nhot fixes and coffees. 🌀",
                      clickedContentInfo:
                        fanBladeSpeedMultiplier >= 2
                          ? "Feeling a chill? Lower the fan speed."
                          : fanBladeSpeedMultiplier <= 1
                          ? "Temp rising? Increase the fan speed."
                          : undefined,
                      ref: fanBladesRef,
                      clickedButtons: (
                        <div className="flex gap-1 mt-2 items-center justify-center">
                          <div
                            className={clsx(
                              "p-1 px-4 rounded-md text-white ring-black/60 transition-all duration-300",
                              fanBladeSpeedMultiplier == 0 && "ring-2"
                            )}
                            onClick={() => setFanBladeSpeedMultiplier(0)}
                            style={{
                              backgroundColor:
                                materialColors.fanBtnOffHoverColor,
                            }}
                          >
                            0
                          </div>
                          <div
                            className={clsx(
                              "p-1 px-4 rounded-md text-white ring-black/60 transition-all duration-300",
                              fanBladeSpeedMultiplier == 1 && "ring-2"
                            )}
                            onClick={() => setFanBladeSpeedMultiplier(1)}
                            style={{
                              backgroundColor: materialColors.fanBtn1HoverColor,
                            }}
                          >
                            1
                          </div>
                          <div
                            className={clsx(
                              "p-1 px-4 rounded-md text-white ring-black/60 transition-all duration-300",
                              fanBladeSpeedMultiplier == 2 && "ring-2"
                            )}
                            onClick={() => setFanBladeSpeedMultiplier(2)}
                            style={{
                              backgroundColor: materialColors.fanBtn2HoverColor,
                            }}
                          >
                            2
                          </div>
                          <div
                            className={clsx(
                              "p-1 px-4 rounded-md text-white ring-black/60 transition-all duration-300",
                              fanBladeSpeedMultiplier == 3 && "ring-2"
                            )}
                            onClick={() => setFanBladeSpeedMultiplier(3)}
                            style={{
                              backgroundColor: materialColors.fanBtn3HoverColor,
                            }}
                          >
                            3
                          </div>
                        </div>
                      ),
                    },
                  },
                  {
                    childType: "group",
                    props: {
                      groupKey: "Fan_Grid",
                      position: [-0.255, 0.475, -0.034],
                      rotation: [Math.PI / 2, 0, -1.436],
                      elements: [
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Cylinder009",
                            clickedColor: materialColors.fanBodyColor,
                            outlineOpacity: 0,
                          },
                        },
                        {
                          childType: "mesh",
                          props: {
                            modelKey: "Cylinder009_1",
                            clickedColor: materialColors.fanBodyColor,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },

            {
              childType: "mesh",
              props: {
                modelKey: "Fan_Body",
                position: [2.64, 3.06, 2.907],
                clickedColor: materialColors.fanBodyColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Fan_Stand",
                position: [2.644, 0.793, 2.907],
                clickedColor: materialColors.fanBodyColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Fan_Legs",
                position: [2.644, 0.521, 2.907],
                clickedColor: materialColors.fanBodyColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Buttons_Plate",
                position: [2.564, 2.002, 2.894],
                clickedColor: materialColors.fanPlateColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Fan_Knob",
                position: [2.555, 2.106, 2.894],
                clickedColor: materialColors.fanButtonColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Btn_1",
                position: [2.547, 1.97, 2.889],
                clickedColor: materialColors.fanButtonColor,
                individualHoveredColor: materialColors.fanBtn1HoverColor,
                outlineOpacity: 0,
                onClick: () => {
                  setFanBladeSpeedMultiplier(1);
                },
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Btn_2",
                position: [2.547, 1.97, 2.889],
                clickedColor: materialColors.fanButtonColor,
                individualHoveredColor: materialColors.fanBtn2HoverColor,
                outlineOpacity: 0,
                onClick: () => {
                  setFanBladeSpeedMultiplier(2);
                },
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Btn_3",
                position: [2.547, 1.97, 2.889],
                clickedColor: materialColors.fanButtonColor,
                individualHoveredColor: materialColors.fanBtn3HoverColor,
                outlineOpacity: 0,
                onClick: () => {
                  setFanBladeSpeedMultiplier(3);
                },
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Btn_Off",
                position: [2.547, 1.97, 2.889],
                clickedColor: materialColors.fanButtonColor,
                individualHoveredColor: materialColors.fanBtnOffHoverColor,
                outlineOpacity: 0,
                onClick: () => {
                  setFanBladeSpeedMultiplier(0);
                },
              },
            },
          ]}
        />
        <ModelParentGroup
          floatIntensity={0}
          groupKey="Bulb"
          elements={[
            {
              childType: "mesh",
              props: {
                modelKey: "Bulb",
                position: [0.15, 6.323, 0.15],
                scale: 3.531,
                hoveredContent: "Click to turn on the light.",
                clickedColor: materialColors.bulbColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Bulb_Holder",
                position: [0.15, 6.391, 0.15],
                clickedColor: materialColors.bulbWireColor,
              },
            },
            {
              childType: "mesh",
              props: {
                modelKey: "Bulb_Wire",
                position: [0.15, 8.242, 0.15],
                scale: [0.008, 0.046, 0.008],
                clickedColor: materialColors.bulbWireColor,
              },
            },
          ]}
        />
      </group>
    </Stage>
  );
}
