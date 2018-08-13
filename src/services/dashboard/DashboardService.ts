import { ChatPlugService } from '../Service'
import DashboardConfig from './DashboardConfig'

export default class ApiService extends ChatPlugService<DashboardConfig> {
  async initialize() {
    if (!this.config.bindToAPIServer) {
      throw new Error('Standalone dashboard server not yet implemented')
    }
  }

  async terminate() {}
}
