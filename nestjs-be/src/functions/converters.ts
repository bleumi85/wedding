import { LogLevel } from '@nestjs/common';

export function convertStringToLogLevelArray(logLevelsString: string): LogLevel[] {
  const levels = logLevelsString.split(',').map((level) => level as LogLevel);

  return Array.from(new Set(levels));
}
