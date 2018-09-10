export enum SocketEvent {
  ServiceStatusUpdate = 'serviceStatusUpdate',
}

export class SocketPacket {
  mutation?: string
  action?: string
  namespace?: string
  data: any
}
