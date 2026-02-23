<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class Deploy extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deploy 
                            {--skip-git : Skip git commit and push}
                            {--skip-frontend : Skip frontend build}
                            {--skip-migrations : Skip database migrations}
                            {--install-deps : Install npm dependencies (skipped by default)}
                            {--message= : Custom commit message}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deploy project to server: commit, push to git, update server, build frontend, run migrations, clear cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting deployment process...');
        $this->newLine();

        $report = [
            'git' => null, // null = skipped, true = success, false = error
            'server_update' => false,
            'dependencies' => null, // null = skipped (npm), true = success, false = error
            'frontend' => null,
            'migrations' => null,
            'cache' => false,
        ];

        // Step 1: Git commit and push
        if (!$this->option('skip-git')) {
            $this->info('📦 Step 1: Git commit and push');
            $report['git'] = $this->handleGit();
            $this->newLine();
        } else {
            $this->warn('⏭️  Skipping git commit and push');
            $this->newLine();
        }

        // Step 2: Update server from git
        $this->info('🔄 Step 2: Updating server from git');
        $report['server_update'] = $this->updateServer();
        $this->newLine();

        // Step 3: Install dependencies
        $this->info('📚 Step 3: Installing dependencies');
        $depsResult = $this->installDependencies();
        $report['dependencies'] = $depsResult;
        $this->newLine();

        // Step 4: Build frontend
        if (!$this->option('skip-frontend')) {
            $this->info('🎨 Step 4: Building frontend');
            $report['frontend'] = $this->buildFrontend();
            $this->newLine();
        } else {
            $this->warn('⏭️  Skipping frontend build');
            $this->newLine();
        }

        // Step 5: Run migrations
        if (!$this->option('skip-migrations')) {
            $this->info('🗄️  Step 5: Running database migrations');
            $report['migrations'] = $this->runMigrations();
            $this->newLine();
        } else {
            $this->warn('⏭️  Skipping database migrations');
            $this->newLine();
        }

        // Step 6: Clear cache
        $this->info('🧹 Step 6: Clearing cache');
        $report['cache'] = $this->clearCache();
        $this->newLine();

        // Final report
        $this->displayReport($report);

        return Command::SUCCESS;
    }

    /**
     * Handle git commit and push
     */
    private function handleGit(): bool
    {
        // Check if there are changes
        $status = shell_exec('git status --porcelain');
        if (empty(trim($status))) {
            $this->warn('   No changes to commit');
            return true;
        }

        // Show status
        $this->line('   Changes detected:');
        $this->line('   ' . str_replace("\n", "\n   ", trim($status)));

        // Ask for commit message
        $message = $this->option('message');
        if (!$message) {
            $message = $this->ask('   Enter commit message', 'Deploy: ' . date('Y-m-d H:i:s'));
        }

        // Add all changes
        $this->line('   Adding changes...');
        exec('git add .', $output, $returnCode);
        if ($returnCode !== 0) {
            $this->error('   ❌ Failed to add changes');
            return false;
        }

        // Commit
        $this->line('   Committing changes...');
        $commitMessage = escapeshellarg($message);
        exec("git commit -m {$commitMessage}", $output, $returnCode);
        if ($returnCode !== 0) {
            $this->error('   ❌ Failed to commit');
            return false;
        }

        // Push
        $this->line('   Pushing to remote...');
        exec('git push origin main', $output, $returnCode);
        if ($returnCode !== 0) {
            $this->error('   ❌ Failed to push to remote');
            $this->line('   Output: ' . implode("\n", $output));
            return false;
        }

        $this->info('   ✅ Git commit and push completed');
        return true;
    }

    /**
     * Run a command on the deploy server via SSH (non-interactive, with timeout).
     * Prevents hanging on host key or password prompts.
     *
     * @return array{output: array, returnCode: int}
     */
    private function runSsh(string $remoteCommand): array
    {
        $host = env('DEPLOY_HOST', 'root@85.198.64.93');
        $opts = '-o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new';
        $command = sprintf('ssh %s %s %s 2>&1', $opts, escapeshellarg($host), escapeshellarg($remoteCommand));
        $output = [];
        $returnCode = -1;
        exec($command, $output, $returnCode);

        return ['output' => $output, 'returnCode' => $returnCode];
    }

    /**
     * Update server from git
     */
    private function updateServer(): bool
    {
        $host = env('DEPLOY_HOST', 'root@85.198.64.93');
        $path = env('DEPLOY_PATH', '/var/www/livegrid.ru');

        $this->line("   Connecting to {$host}...");
        $this->line("   Project path: {$path}");

        $result = $this->runSsh("cd {$path} && git pull origin main");
        $output = $result['output'];
        $returnCode = $result['returnCode'];

        if ($returnCode !== 0) {
            $this->error('   ❌ Failed to update server');
            $this->line('   Output: ' . implode("\n", $output));
            return false;
        }

        $outputStr = implode("\n", $output);
        if (strpos($outputStr, 'Already up to date') !== false) {
            $this->info('   ✅ Server already up to date');
        } else {
            $this->info('   ✅ Server updated successfully');
            $this->line('   ' . $outputStr);
        }

        return true;
    }

    /**
     * Install dependencies
     */
    private function installDependencies(): ?bool
    {
        $path = env('DEPLOY_PATH', '/var/www/livegrid.ru');

        $this->line('   Installing PHP dependencies...');
        $result = $this->runSsh("cd {$path} && composer install --no-dev --optimize-autoloader");
        $output = $result['output'];
        $returnCode = $result['returnCode'];

        if ($returnCode !== 0) {
            $this->warn('   ⚠️  Composer install had issues');
            $this->line('   ' . implode("\n", array_slice($output, -5)));
        } else {
            $this->info('   ✅ PHP dependencies installed');
        }

        // Check if frontend directory exists (use runSsh to avoid shell_exec hang)
        $this->line('   Checking frontend dependencies...');
        $result = $this->runSsh("test -d {$path}/frontend && echo exists || echo not_exists");
        $checkResult = trim(implode("\n", $result['output']));

        if ($checkResult === 'exists') {
            if ($this->option('install-deps')) {
                $this->line('   Installing frontend dependencies...');
                $result = $this->runSsh("cd {$path}/frontend && timeout 120 npm install");
                $output = $result['output'];
                $returnCode = $result['returnCode'];

                if ($returnCode !== 0) {
                    $this->warn('   ⚠️  NPM install had issues');
                    $this->line('   ' . implode("\n", array_slice($output, -5)));
                    return false;
                }
                $this->info('   ✅ Frontend dependencies installed');
                return true;
            }
            $this->line('   ℹ️  Skipping npm install (use --install-deps to install)');
            return null;
        }

        $this->line('   ℹ️  Frontend directory not found, skipping');
        return null;
    }

    /**
     * Build frontend
     */
    private function buildFrontend(): bool
    {
        $host = env('DEPLOY_HOST', 'root@85.198.64.93');
        $path = env('DEPLOY_PATH', '/var/www/livegrid.ru');

        $this->line('   Building frontend...');
        $command = "ssh {$host} \"cd {$path}/frontend && npm run build 2>&1\"";
        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            $this->error('   ❌ Frontend build failed');
            $this->line('   ' . implode("\n", array_slice($output, -10)));
            return false;
        }

        // Show build summary
        $outputStr = implode("\n", $output);
        if (preg_match('/✓ built in ([\d.]+)s/', $outputStr, $matches)) {
            $this->info("   ✅ Frontend built successfully in {$matches[1]}s");
        } else {
            $this->info('   ✅ Frontend built successfully');
        }

        // Show file sizes
        if (preg_match_all('/(assets\/[^\s]+)\s+([\d.]+)\s+kB/', $outputStr, $matches, PREG_SET_ORDER)) {
            $this->line('   Build output:');
            foreach (array_slice($matches, -3) as $match) {
                $this->line("     {$match[1]}: {$match[2]} kB");
            }
        }

        return true;
    }

    /**
     * Run migrations
     */
    private function runMigrations(): bool
    {
        $path = env('DEPLOY_PATH', '/var/www/livegrid.ru');

        $this->line('   Running migrations...');
        $result = $this->runSsh("cd {$path} && php artisan migrate --force");
        $output = $result['output'];
        $returnCode = $result['returnCode'];

        if ($returnCode !== 0) {
            $this->error('   ❌ Migrations failed');
            $this->line('   ' . implode("\n", array_slice($output, -10)));
            return false;
        }

        $outputStr = implode("\n", $output);
        if (strpos($outputStr, 'Nothing to migrate') !== false) {
            $this->info('   ✅ Database is up to date');
        } else {
            $this->info('   ✅ Migrations completed');
            $this->line('   ' . implode("\n", array_slice($output, -5)));
        }

        return true;
    }

    /**
     * Clear cache
     */
    private function clearCache(): bool
    {
        $path = env('DEPLOY_PATH', '/var/www/livegrid.ru');

        $commands = [
            'config:cache' => 'Configuration cache',
            'route:cache' => 'Route cache',
            'view:clear' => 'View cache',
            'cache:clear' => 'Application cache',
        ];

        foreach ($commands as $command => $description) {
            $this->line("   Clearing {$description}...");
            $result = $this->runSsh("cd {$path} && php artisan {$command}");
            $returnCode = $result['returnCode'];

            if ($returnCode === 0) {
                $this->info("   ✅ {$description} cleared");
            } else {
                $this->warn("   ⚠️  Failed to clear {$description}");
            }
        }

        return true;
    }

    /**
     * Display deployment report
     */
    private function displayReport(array $report): void
    {
        $this->newLine();
        $this->info('📊 Deployment Report');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        $statuses = [
            'git' => 'Git commit & push',
            'server_update' => 'Server update',
            'dependencies' => 'Dependencies',
            'frontend' => 'Frontend build',
            'migrations' => 'Migrations',
            'cache' => 'Cache clear',
        ];

        foreach ($statuses as $key => $label) {
            $value = $report[$key];
            if ($value === null) {
                $status = '⏭️ ';
            } elseif ($value === true) {
                $status = '✅';
            } else {
                $status = '❌';
            }
            $this->line("   {$status} {$label}");
        }

        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Check if there are any actual errors (false values, not null)
        $allSuccess = !in_array(false, array_filter($report, fn($v) => $v !== null));
        if ($allSuccess) {
            $this->newLine();
            $this->info('🎉 Deployment completed successfully!');
            $this->info('🌐 Project is live and up to date on the server');
        } else {
            $this->newLine();
            $this->error('⚠️  Deployment completed with some errors');
            $this->error('Please check the output above for details');
        }
    }
}
