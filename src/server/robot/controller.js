import { MotorMessenger } from './motor-messenger.js';
import { ClientMessenger } from './client-messenger.js';

import logger from 'winston';

export class Controller {
  constructor({ io }) {
    logger.info('controller - constructing controller');
    // Set our io
    this.io = io;
    // Map to keep track of motors
    this.motors = {};
    // Map to keep track of robots
    this.robots = {};
    // Create motor messsenger so we can talk to buckets
    this.motorMessenger = new MotorMessenger(io);
    // Create client messsenger so we can talk to clients
    this.clientMessenger = new ClientMessenger(io);
    // Bind to bucket events
    this.subscribeToMotorMessenger();
    // Bind to client events
    this.subscribeToClientMessenger();
  }

  /* -------------- Client Shit -------------- */

  clientConnect() {
    logger.info('controller -  client connected');
    this.clientMessenger.send('motors', this.motors);
    this.clientMessenger.send('robots', this.robots);
  }

  subscribeToClientMessenger() {
    this.clientMessenger.on('connect', (...args) => this.clientConnect(...args));
  }

  /* -------------- Motor Shit -------------- */

  motorConnect(id, socket) {
    logger.info(`controller - motor ${id} connected`);

    // Register that motor via its motor id
    this.motors[id] = {
      id: id,
      socketId: socket.id,
    };

    // Let the clients know of this new motor registration
    this.clientMessenger.send('motors', this.motors);
  }

  motorDisconnect(id) {
    logger.info(`controller - motor ${id} disconnected`);
    delete this.motors[id];
    this.clientMessenger.send('motors', this.motors);
  }

  motorState(id, state) {
    logger.info(`controller - motor ${id}:`, state);
    this.clientMessenger.send('motor', state);
  }

  subscribeToMotorMessenger() {
    this.motorMessenger.on('connect', (...args) => this.motorConnect(...args));
    this.motorMessenger.on('disconnect', (...args) => this.motorDisconnect(...args));
    this.motorMessenger.on('state', (...args) => this.motorState(...args));
  }
}
