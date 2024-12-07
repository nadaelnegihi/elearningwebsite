import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyBackup() {
    this.logger.log('Starting daily MongoDB backup...');
    await this.performBackup();
  }

  private async performBackup() {
    try {        
      const backupPath = path.join(__dirname, '..', '..', '..', 'backups', new Date().toISOString().split(":")[0]);      
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }

      const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/elearningweb';
      const command = `mongodump --uri="${uri}" --out="${backupPath}"`;

      await this.executeCommand(command);

      this.logger.log(`Backup successfully saved at ${backupPath}`);
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
    }
  }

  private executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Command error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          this.logger.warn(`Command warnings: ${stderr}`);
        } else {
          this.logger.log(`Command output: ${stdout}`);
        }
        resolve();
      });
    });
  }
}
