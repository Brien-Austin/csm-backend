import http from 'http';
import https from 'https';
import { logger } from '../utils/logger';

export class HealthPingService {
  private static pingIntervalTimer: NodeJS.Timeout | null = null;

  static startSelfPingCron(pingIntervalMinutes: number = 10): void {
    const isAlreadyRunning = Boolean(HealthPingService.pingIntervalTimer);
    if (isAlreadyRunning) {
      return;
    }

    const targetHealthUrl = process.env.RENDER_EXTERNAL_URL
      ? `${process.env.RENDER_EXTERNAL_URL}/health`
      : `http://localhost:${process.env.PORT || 4000}/health`;

    const intervalMilliseconds = pingIntervalMinutes * 60 * 1000;

    logger.info(`⏰ Starting Health Self-Ping Cron every ${pingIntervalMinutes} minutes [Target: ${targetHealthUrl}]`);

    HealthPingService.pingIntervalTimer = setInterval(() => {
      HealthPingService.executePing(targetHealthUrl);
    }, intervalMilliseconds);
  }

  static stopSelfPingCron(): void {
    const isTimerActive = Boolean(HealthPingService.pingIntervalTimer);
    if (isTimerActive && HealthPingService.pingIntervalTimer) {
      clearInterval(HealthPingService.pingIntervalTimer);
      HealthPingService.pingIntervalTimer = null;
      logger.info('🛑 Health Self-Ping Cron stopped.');
    }
  }

  private static executePing(targetUrl: string): void {
    const isHttps = targetUrl.startsWith('https');
    const httpModule = isHttps ? https : http;

    httpModule
      .get(targetUrl, (response) => {
        const isSuccessfulStatus = response.statusCode === 200;
        if (isSuccessfulStatus) {
          logger.info(`💚 Health ping successful [URL: ${targetUrl}, Code: ${response.statusCode}]`);
        } else {
          logger.warn(`⚠️ Health ping returned non-200 code [URL: ${targetUrl}, Code: ${response.statusCode}]`);
        }
      })
      .on('error', (error) => {
        logger.error(`❌ Health ping request failed [URL: ${targetUrl}]:`, error.message);
      });
  }
}
