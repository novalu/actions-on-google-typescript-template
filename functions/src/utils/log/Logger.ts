interface Logger {
  trace(body: any, extra?: any);

  debug(body: any, extra?: any);

  info(body: any, extra?: any);

  warn(body: any, extra?: any);

  error(body: any, extra?: any);

  fatal(body: any, extra?: any);
}

export { Logger };
