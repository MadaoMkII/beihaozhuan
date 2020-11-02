// eslint-disable-next-line strict
const fs = require('fs');
const _ = require('lodash');
const BaseService = require('./baseService');
const exec = require('child_process').exec;
const dbOptions = {
  user: 'chestHospital',
  pass: 'hothothot2',
  host: 'wxwork.chesthospital.com',
  port: 3400,
  database: 'evaluation',
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: '/home/backup/', // i.e. /var/database-backup/
};
class EvaluationMissionService extends BaseService {

  /* return date object */
  async stringToDate(dateString) {
    return new Date(dateString);
  }
  /* return if variable is empty or not. */
  // async empty(mixedVar) {
  //   let i,
  //     len;
  //   const emptyValues = [ undefined, null, false, 0, '', '0' ];
  //   for (i = 0, len = emptyValues.length; i < len; i++) {
  //     if (mixedVar === emptyValues[i]) {
  //       return true;
  //     }
  //   }
  //   if (typeof mixedVar === 'object') {
  //     return !mixedVar.hasAttributes();
  //
  //   }
  //   return false;
  // }
  // Auto backup script
  async dbAutoBackUp() {
    const empty = function(mixedVar) {
      let i,
        len;
      const emptyValues = [ undefined, null, false, 0, '', '0' ];
      for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
          return true;
        }
      }
      if (typeof mixedVar === 'object') {
        return !mixedVar.hasAttributes();

      }
      return false;
    };
    // check for auto backup is enabled or disabled
    if (dbOptions.autoBackup === true) {
      const date = new Date();
      let beforeDate,
        oldBackupDir,
        oldBackupPath;
      const currentDate = date; // Current date
      const newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
      const newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
      // check for remove old backup after keeping # of days given in configuration
      if (dbOptions.removeOldBackup === true) {
        beforeDate = _.clone(currentDate);
        beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Subtract number of days to keep backup and remove old backup
        oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
        oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
      }
      const cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process
      exec(cmd, function(error, stdout, stderr) {

        if (!error) {
          console.log(stdout);
          // check for remove old backup after keeping # of days given in configuration
          if (dbOptions.removeOldBackup === true) {
            if (fs.existsSync(oldBackupPath)) {
              exec('rm -rf ' + oldBackupPath, function(err) {
                console.log(err);
              });
            }
          }
        }
      });
    }
  }
}
module.exports = EvaluationMissionService;
