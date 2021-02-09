import cron from 'node-cron'
import models from 'models'

const { Role } = models

class RoleJob {
  /**
   * Get Role Task
   */
  public static getRole() {
    // Run this job every 30 minutes
    const task = cron.schedule('30 * * * *', async () => {
      const data = await Role.find()
      console.log('Running task check get role by id', { data })
    })

    return task
  }
}

export default RoleJob
