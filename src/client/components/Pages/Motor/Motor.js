import { useFieldState, useFormApi, useFormState } from 'informed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useApp from '../../../hooks/useApp';
import InputSlider from '../../Informed/InputSlider';
import Alert from '@spectrum-icons/workflow/Alert';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useRobotState from '../../../hooks/useRobotState';

export const Motor = () => {
  const { socket } = useApp();

  const formApi = useFormApi();

  const controlRef = useRef();

  const { robotStates, connected } = useRobotState();

  // Ref to use in functions for if robot is connected
  const connectedRef = useRef();
  connectedRef.current = connected;

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');

  // Get the selected motor state
  const motorState =
    robotStates[robotId] && robotStates[robotId]?.motors[motorId]
      ? robotStates[robotId].motors[motorId]
      : {};

  const motorSetPos = useCallback(({ value }) => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorSetPos', robotId, motorId, value);
    }
  }, []);

  const motorResetErrors = useCallback(({ value }) => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorResetErrors', robotId, motorId);
    }
  }, []);

  const motorEnable = useCallback(({ value }) => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorEnable', robotId, motorId);
    }
  }, []);

  const motorHome = useCallback(({ value }) => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorHome', robotId, motorId);
    }
  }, []);

  const robotHome = useCallback(({ value }) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current) {
      socket.emit('robotHome', robotId);
    }
  }, []);

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Motor Controller</h1>
        {!connected ? <Alert.default aria-label="Negative Alert" color="negative" /> : null}
      </Flex>
      <InputSlider
        name="motorPos"
        label="Set Position"
        onValueChange={motorSetPos}
        type="number"
        minValue={-180}
        maxValue={180}
        initialValue={0}
        step={1}
        trackGradient="rgb(107,18,10)"
      />
      <Flex direction="row" justifyContent="space-between" gap="size-100">
        <Flex
          width="size-2400"
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="size-300"
        >
          <ActionButton width="size-2400" onPress={motorHome}>
            Home
          </ActionButton>
          <ActionButton width="size-2400" onPress={robotHome}>
            Robot Home
          </ActionButton>
        </Flex>
        <Flex direction="column" alignItems="center" gap="size-100">
          <svg width="500" height="500">
            <g transform={`rotate(${motorSetPos ?? 0} 250 250)`}>
              <circle
                cx="250"
                cy="250"
                r="200"
                fill="grey"
                stroke="rgb(107,18,10)"
                strokeWidth="20"
              />
              <circle ref={controlRef} cx="250" cy="100" r="20" fill="black" />
            </g>
          </svg>
        </Flex>
        <Flex
          width="size-2400"
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="size-300"
        >
          <ActionButton width="size-2400" onPress={motorResetErrors}>
            Reset Errors
          </ActionButton>
          <ActionButton width="size-2400" onPress={motorEnable}>
            Enable Motor
          </ActionButton>
        </Flex>
      </Flex>
      <div>
        <pre>{JSON.stringify(motorState, null, 2)}</pre>
      </div>
    </>
  );
};
