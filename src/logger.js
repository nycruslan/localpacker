import chalk from 'chalk';

const prefix = chalk.blue('[localpacker]');

const log = {
  info: (message) => console.log(`${prefix} ${chalk.green(message)}`),
  warn: (message) => console.log(`${prefix} ${chalk.yellow(message)}`),
  error: (message) => console.error(`${prefix} ${chalk.red(message)}`),
  success: (message) => console.log(`${prefix} ${chalk.green.bold(message)}`),
};

export default log;
