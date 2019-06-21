import ServiceInstance from "./ServiceInstance"

export default interface Log {
  id: number,
  logLevel: string,
  message: string,
  systemLog: boolean,
  createdAt: Date
}
