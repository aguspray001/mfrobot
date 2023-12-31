import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import Graphic from '@spectrum-icons/workflow/Graphic';
import useSimulateController from '../../../hooks/useSimulateController';
import { useFormApi, useFormState } from 'informed';
import useApp from '../../../hooks/useApp';
import { Arm } from '../../3D/Arm';
import { Canvas } from '@react-three/fiber';
import { round } from '../../../../lib/round';
import NumberInput from '../../Informed/NumberInput';
import Switch from '../../Informed/Switch';
import RadioGroup from '../../Informed/RadioGroup';
import {
  ActionButton,
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Text,
  Well,
} from '@adobe/react-spectrum';
import useRobotController from '../../../hooks/useRobotController';
import useRobotKinematics from '../../../hooks/useRobotKinematics';
import useSimulateState from '../../../hooks/useSimulateState';
import { useOverFlowHidden } from '../../../hooks/useOverflowHidden';
import { getXYZ, getZXZ } from '../../../utils/getEulers';
// import { URDFRobot } from '../../3D/URDFRobot';

const DEG45 = Math.PI / 4;

const Control = ({ controlRef, virtualCam }) => {
  const [inputValue, setInputValue] = useState({x:null, y:null, z:null})
  const { values } = useFormState();
  const formApi = useFormApi();
  const { updateRobot, setBallRef } = useRobotController();
  const { endPosition } = useRobotKinematics();
  const { config, dataOpen } = useApp();
  const { zeroPosition } = config;
  
  const robotUpdate = () => {
    const { goToX, goToY, goToZ, orientation } = formApi.getFormState().values;

    // get rotations from orientation
    const [r1, r2, r3] = getZXZ(orientation);

    // Update the robot
    updateRobot(goToX, goToY, goToZ, r1, r2, r3);
  };

  const robotUpdateFromArray = () => {
    const presetRobot = localStorage.getItem('preset-robot');
    if (presetRobot) {
      const jsonPresetRobot = JSON.parse(presetRobot);
      // for(let i=0; i<jsonPresetRobot.length-1; i++){
      //   const { goToX, goToY, goToZ, orientation, x, y, z } = jsonPresetRobot[i];
      //   const [r1, r2, r3] = getZXZ(orientation);

      //   let distanceWaypoints = round(jsonPresetRobot[i+1].goToX - jsonPresetRobot[i].goToX, 10);
      //   console.log(distanceWaypoints);
      //   while (distanceWaypoints !== 0) {
      //     // console.log(jsonPresetRobot[i].goToX !== jsonPresetRobot[i+1].goToX)
      //     // updateRobot(jsonPresetRobot[i].goToX+=0.1, 0, 0, r1, r2, r3);
      //     console.log(distanceWaypoints)
      //     distanceWaypoints-=0.1;
      //     // setBallRef.current([x, y, z, r1, r2, r3]);
      //   }
      // }

      jsonPresetRobot.forEach((preset, index) => {
        // Update the robot
        setTimeout(function () {
          // console.log(preset);
          const { goToX, goToY, goToZ, orientation, x, y, z } = preset;
          // get rotations from orientation
          const [r1, r2, r3] = getZXZ(orientation);
          console.log(preset)
          while (preset[index].goToX !== preset[index+1].goToX) {
            console.log(preset[index].goToX !== preset[index+1].goToX)
            updateRobot(preset[index]+=1, 0, 0, r1, r2, r3);
            // setBallRef.current([x, y, z, r1, r2, r3]);
          }
        }, 100 * index);
      });
    }
  };

  function checkPositiveNegative(arr) {
    const symbol = [];
    const negativeValues = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > 0) {
        symbol.push(true);
      } else if (arr[i] < 0) {
        symbol.push(false);
      }
    }

    return symbol;
  }

  const robotUpdatePresets = () => {
    const presetRobot = localStorage.getItem('preset-robot');
    if (presetRobot) {
      const data = {
        diffX: null,
        diffY: null,
        diffZ: null,
      };

      const jsonPresetRobot = JSON.parse(presetRobot);
      for (let i = 0; i < jsonPresetRobot.length - 1; i++) {
        // console.log(jsonPresetRobot[i+1].goToX - jsonPresetRobot[i].goToX)
        data.diffX = jsonPresetRobot[i + 1]?.goToX - jsonPresetRobot[i]?.goToX;
        data.diffY = jsonPresetRobot[i + 1]?.goToY - jsonPresetRobot[i]?.goToY;
        data.diffZ = jsonPresetRobot[i + 1]?.goToZ - jsonPresetRobot[i]?.goToZ;
        data.orientationRobot = jsonPresetRobot[i].orientation;

        const maxIteration = Math.max([
          Math.abs(data.diffX),
          Math.abs(data.diffY),
          Math.abs(data.diffZ),
        ]);
        const symbol = checkPositiveNegative([data.diffX, data.diffY, data.diffZ]);

        for (let j = 0; j <= maxIteration; j++) {
          if (jsonPresetRobot[i].goToX !== jsonPresetRobot[i + 1].goToX) {
            symbol[0] === true ? (jsonPresetRobot[i].goToX += 1) : (jsonPresetRobot[i].goToX -= 1);
          }
          if (jsonPresetRobot[i].goToY !== jsonPresetRobot[i + 1].goToY) {
            symbol[1] === true ? (jsonPresetRobot[i].goToY += 1) : (jsonPresetRobot[i].goToY -= 1);
          }
          if (jsonPresetRobot[i].goToZ !== jsonPresetRobot[i + 1].goToZ) {
            symbol[2] === true ? (jsonPresetRobot[i].goToZ += 1) : (jsonPresetRobot[i].goToZ -= 1);
          }

          // setTimeout(function () {
            // get rotations from orientation
            const [r1, r2, r3] = getZXZ(data.orientationRobot);
            updateRobot(
              jsonPresetRobot[i].goToX,
              jsonPresetRobot[i].goToY,
              jsonPresetRobot[i].goToZ,
              r1,
              r2,
              r3,
            );
            // setBallRef.diffent([x, y, z, r1, r2, r3]);
          // }, 150 * index);
        }
        console.log('preset :', data);
      }
    }
  };

  const savePreset = (value) => {
    const key = 'preset-robot';
    const presetRobot = localStorage.getItem(key);
    // console.log(presetRobot);
    const newValue = value;
    newValue.goToX = endPosition.x;
    newValue.goToY = endPosition.y;
    newValue.goToZ = endPosition.z;

    setInputValue(newValue);

    if (presetRobot) {
      // add new value
      const jsonPresetRobot = JSON.parse(presetRobot);
      jsonPresetRobot.push(newValue);
      localStorage.setItem(key, JSON.stringify(jsonPresetRobot));
    } else {
      console.log('data not found in LS');
      localStorage.setItem(key, JSON.stringify([newValue]));
    }
  };

  const reset = () => {
    localStorage.removeItem("preset-robot");
    formApi.reset();
    // formApi.setTheseValues({
    //   x: zeroPosition[0],
    //   y: zeroPosition[1],
    //   z: zeroPosition[2],
    //   r1: 0,
    //   r2: 0,
    //   r3: 0,
    // });

    // Get pos
    const { x, y, z, r1, r2, r3 } = formApi.getFormState().values;

    setBallRef.current([x, y, z, r1, r2, r3]);

    controlRef.current.reset();
  };

  const skeleton = () => {
    formApi.setTheseValues({
      x: zeroPosition[0],
      y: zeroPosition[1],
      z: zeroPosition[2],
      r1: 0,
      r2: 0,
      r3: 0,
      mainGrid: false,
      jointGrid: true,
      hide: false,
      showCylinder: true,
      showArrows: true,
      showLinks: false,
      hideNegatives: true,
      showLines: true,
    });

    // Get pos
    const { x, y, z, r1, r2, r3 } = formApi.getFormState().values;

    // Update the robot
    updateRobot(x, y, z, r1, r2, r3);

    virtualCam.current.position.set(70, 80, 70);
    controlRef.current.target.set(0, 50, 0);
  };

  return (
    <>
      <Flex
        direction="row"
        width={600}
        justifyContent="space-between"
        alignItems="end"
        gap="size-100"
      >
        <ActionButton type="button" onPress={reset} minWidth="70px">
          Reset
        </ActionButton>
        <ActionButton title="Skeleton" onPress={() => skeleton()}>
          <Graphic />
        </ActionButton>
        <NumberInput
          name="goToX"
          label={`X: ${round(inputValue.x || 0, 1000)}`}
          step={0.1}
          initialValue={round(inputValue.x || 0, 1000)}
          maxWidth="100px"
        />
        <NumberInput
          name="goToY"
          label={`Y: ${round(inputValue.y || 0, 1000)}`}
          step={0.1}
          initialValue={round(inputValue.y || 0, 1000)}
          maxWidth="100px"
        />
        <NumberInput
          name="goToZ"
          label={`Z: ${round(inputValue.z || 0, 1000)}`}
          step={0.1}
          initialValue={round(inputValue.z || 0, 1000)}
          maxWidth="100px"
        />
        <ActionButton
          title="Go"
          aria-label="Go"
          type="button"
          onPress={robotUpdate}
          minWidth="60px"
        >
          Go
        </ActionButton>
        <ActionButton
          title="Save"
          aria-label="Save"
          type="button"
          onPress={() => savePreset(values)}
          minWidth="100px"
        >
          Save
        </ActionButton>
        <ActionButton
          title="Test"
          aria-label="Test"
          type="button"
          onPress={robotUpdateFromArray}
          minWidth="100px"
        >
          Test
        </ActionButton>
        {/* <Switch name="animate" label="Animate" initialValue /> */}
      </Flex>
      <br />
      <RadioGroup
        initialValue="x"
        orientation="horizontal"
        name="orientation"
        aria-label="Select Oriantaion"
        options={[{ label: 'X', value: 'x' }]}
        // options={[
        //   { label: 'X', value: 'x' },
        //   { label: '-X', value: '-x' },
        //   { label: 'Y', value: 'y' },
        //   { label: '-Y', value: '-y' },
        //   { label: 'Z', value: 'z' },
        //   { label: '-Z', value: '-z' },
        // ]}
      />
    </>
  );
};

function Info() {
  let [state, setState] = React.useState(false);

  return (
    <Flex alignItems="center" gap="size-100">
      <ContextualHelp variant="info" onOpenChange={(isOpen) => setState(isOpen)}>
        <Heading>How to control the arm</Heading>
        <Content>
          <Text>
            Use the arrow keys to control the X and Y position of the ball. Up and down will change
            the Y, Left and write will change the X. To move the Z axis hold the space key and use
            the up and down arrows.
          </Text>
          <br />
          <br />
          <Text>
            You can also use the sliders on the left panel to control each joint individually.
          </Text>
          <br />
          <br />
          <Text>
            To rotate the euler angles ( change orientation of the end effector ), use the a,s,d,w
            keys.
          </Text>
          <br />
          <br />
          <Text>
            In addition you can plug in a gamepad controller and use the joysticks to move the arm.
          </Text>
        </Content>
      </ContextualHelp>
      <Text>How to control the arm</Text>
    </Flex>
  );
}

export const Robot = () => {
  const { config, orbitEnabled, toggleOrbital, orbitControl, cameraControl, dataOpen } = useApp();

  const { values, errors, initialValues } = useFormState();
  const formApi = useFormApi();
  const simulateController = useSimulateController();
  const robotController = useRobotController();
  const { endPosition } = useRobotKinematics();
  const simulateState = useSimulateState();

  const { j0, j1, j2, j3, j4, j5, v0, v1, v2, v3, v4, v5 } = values;

  const angles = [j0, j1, j2, j3, j4, j5];

  const { units } = config;

  const controlRef = useRef();
  const virtualCam = useRef();

  orbitControl.current = controlRef;
  cameraControl.current = virtualCam;

  // When a vertex length changes update the appropriate frame
  const frames = useMemo(() => {
    const frms = initialValues.frames;
    for (let i = 1; i < frms.length; i++) {
      const frame = frms[i];
      // Get length to next frame and along what axis
      let v = frame.x;
      let along = 'x';
      if (Math.abs(frame.y) > Math.abs(v)) {
        v = frame.y;
        along = 'y';
      }
      if (Math.abs(frame.z) > Math.abs(v)) {
        v = frame.z;
        along = 'z';
      }
      // Update that value to equal the vertex value
      if (values[`v${i - 1}`]) {
        frame[along] = v < 0 ? -values[`v${i - 1}`] : values[`v${i - 1}`];
      }
    }

    return frms;
  }, [v0, v1, v2, v3, v4, v5]);

  return (
    <>
      <div className="robot-info angles" style={{ width: '560px' }}>
        {angles.map((a, i) => (
          <div key={`angle-${i}`}>
            <strong>{`J${i + 1}: `}</strong>
            {`${round(a, 100)}°`}
          </div>
        ))}
      </div>

      {/* Reminder .. I use endPosition because this shows FORWARD kinematics not the set values */}
      <div className="robot-info location" style={{ width: '270px' }}>
        <div>
          <strong>X: </strong>
          {round(endPosition.x)} {units}
        </div>
        <div>
          <strong>Y: </strong>
          {round(endPosition.y)} {units}
        </div>
        <div>
          <strong>Z: </strong>
          {round(endPosition.z)} {units}
        </div>
        {/* <div>
          <strong>R1: </strong>
          {round(values.r1, 1000)}
        </div>
        <div>
          <strong>R2: </strong>
          {round(values.r2, 1000)}
        </div>
        <div>
          <strong>R3: </strong>
          {round(values.r3, 1000)}
        </div> */}
      </div>

      <Control controlRef={controlRef} virtualCam={virtualCam} />
      <br />
      {/* WIDTH {window.innerWidth} / HEIGHT {window.innerHeight} */}
      <Info />
      <Canvas>
        <PerspectiveCamera
          ref={virtualCam}
          makeDefault={true}
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          far={10000}
          near={0.1}
          position={[70, 80, 70]}
          zoom={window.innerWidth < 780 || dataOpen ? 1 : 1.4}
        />
        <OrbitControls enabled={orbitEnabled} ref={controlRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Arm
            simulateController={simulateController}
            simulateState={simulateState}
            robotController={robotController}
            config={config}
            values={values}
            errors={errors}
            formApi={formApi}
            toggleOrbital={toggleOrbital}
            frames={frames}
          />
          {/* <URDFRobot /> */}
        </Suspense>
      </Canvas>
    </>
  );
};
