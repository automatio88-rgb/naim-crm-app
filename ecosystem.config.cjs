module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      env: { NODE_ENV: 'production' },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
