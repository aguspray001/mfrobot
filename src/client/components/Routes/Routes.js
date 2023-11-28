import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';

// Components
import { Cookbook } from '../Pages/Cookbook/Cookbook';
import { Robot } from '../Pages/Robot/Robot';
import { Motor } from '../Pages/Motor/Motor';
import { NotFound } from '../Pages/NotFound/NotFound';
import { Framer } from '../Pages/Framer/Framer';
import { Builder } from '../Pages/Builder/Builder';
import { Gamepad } from '../Pages/Gamepad/Gamepad';
import { CameraViewer } from '../Pages/CameraViewer/CameraViewer';
import { CameraId } from '../Pages/CameraId/CameraId';
import QRCodeScanner from '../Pages/QRCodeScanner/QRCodeScanner';
import { RobotPreset } from '../Pages/RobotPreset/RobotPreset';

// Routes ------------------------------------------------------------

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Robot />} />
      <Route path="/motor" element={<Motor />} />
      <Route path="/cookbook" element={<Cookbook />} />
      <Route path="/framer" element={<Framer />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/gamepad" element={<Gamepad />} />
      <Route path="/camera-viewer" element={<CameraViewer />} />
      <Route path="/qrcode" element={<QRCodeScanner />} />
      <Route path="/robot-preset" element={<RobotPreset />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
