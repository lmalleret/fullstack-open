const app = require('./app') // la aplicación Express
const config = require('./utils/config')
const logger = require('./utils/logger')

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})