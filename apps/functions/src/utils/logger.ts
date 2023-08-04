function log(message?: any, ...args: any[]) {
  console.log(`${process.env.APP_ENV === 'local' ? '\n' : ''}\n${message}`, args);
}

export const logger = {
  log,
};
