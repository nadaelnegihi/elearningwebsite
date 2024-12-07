import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MongoClient } from 'mongodb';

@Injectable()
export class BackupDbService {
  private readonly logger = new Logger(BackupDbService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyBackup() {
    this.logger.log('Starting daily MongoDB backup to another db...');
    await this.backupToAnotherDatabase();
  }
  
  async backupToAnotherDatabase() {
    const sourceUri = process.env.SOURCE_MONGO_URI || 'mongodb://localhost:27017/elearningweb';
    const targetUri = process.env.TARGET_MONGO_URI || 'mongodb://localhost:27017/elearningweb-backup';

    const sourceClient = new MongoClient(sourceUri);
    const targetClient = new MongoClient(targetUri);

    try {
      await sourceClient.connect();
      await targetClient.connect();

      const sourceDb = sourceClient.db();
      const targetDb = targetClient.db();

      // Drop DB before backup new day
      await targetDb.dropDatabase();

      // List all collections in the source database
      const collections = await sourceDb.listCollections().toArray();
      this.logger.log(`Found ${collections.length} collections in source database.`);

      for (const collection of collections) {
        const collectionName = collection.name;

        // Get all documents from the source collection
        const documents = await sourceDb.collection(collectionName).find().toArray();

        if (documents.length > 0) {
          // Insert documents into the corresponding collection in the target database
          await targetDb.collection(collectionName).insertMany(documents);
          this.logger.log(`Backed up ${documents.length} documents from ${collectionName}`);
        } else {
          this.logger.log(`No documents to back up in ${collectionName}`);
        }
      }

      this.logger.log('Backup completed successfully.');
    } catch (error) {
      this.logger.error('Backup failed:', error.message);
    } finally {
      await sourceClient.close();
      await targetClient.close();
    }
  }
}
