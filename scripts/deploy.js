import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.production' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

function execCommand(command, options = {}) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { 
      stdio: 'inherit',
      cwd: options.cwd || projectRoot,
      ...options 
    });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

async function deploy() {
  try {
    console.log('Starting deployment process...');

    // Build the application
    console.log('\nBuilding application...');
    execCommand('npm run build');

    // Create deployment archive
    console.log('\nCreating deployment archive...');
    execCommand('tar -czf deploy.tar.gz dist/ server/ package.json package-lock.json ecosystem.config.js .env.production nginx.conf');

    // Copy files to server
    console.log('\nCopying files to server...');
    execCommand(`scp deploy.tar.gz root@${process.env.SERVER_IP}:/tmp/`);

    // Execute deployment commands on server
    console.log('\nConfiguring server...');
    const serverCommands = `
      cd /var/www/auditunity && \
      tar xzf /tmp/deploy.tar.gz && \
      rm /tmp/deploy.tar.gz && \
      npm install --production && \
      pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production && \
      pm2 save && \
      chown -R www-data:www-data /var/www/auditunity && \
      chmod -R 755 /var/www/auditunity && \
      chmod -R 775 /var/www/auditunity/uploads && \
      nginx -t && systemctl reload nginx
    `;

    execCommand(`ssh root@${process.env.SERVER_IP} "${serverCommands}"`);

    console.log('\nDeployment completed successfully!');
    console.log(`Your application is now live at https://www.${process.env.DOMAIN}`);

  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();