export interface CommandBlock {
  label?: string;
  command: string;
  language?: string; // "bash" | "sql" | "lua" | "powershell" | "ini"
}

export interface StepData {
  id: string;
  phase: number;
  phaseTitle: string;
  stepNumber: number;
  title: string;
  description: string;
  commands?: CommandBlock[];
  warnings?: string[];
  notes?: string[];
  tips?: string[];
}

export const PHASES = [
  { number: 1, title: "Virtual Machine Setup", icon: "Monitor" },
  { number: 2, title: "Server Installation", icon: "Download" },
  { number: 3, title: "Database Setup", icon: "Database" },
  { number: 4, title: "Server Configuration", icon: "Settings" },
  { number: 5, title: "Running & Managing", icon: "Play" },
  { number: 6, title: "Updating & Maintenance", icon: "RefreshCw" },
];

export const STEPS: StepData[] = [
  // ──────────────────────────────────────────────
  // Phase 1: Virtual Machine Setup
  // ──────────────────────────────────────────────
  {
    id: "download-debian",
    phase: 1,
    phaseTitle: "Virtual Machine Setup",
    stepNumber: 1,
    title: "Download Debian 11",
    description:
      "You need Debian 11 with the Cinnamon desktop environment specifically. Download the live ISO image from the official Debian archive. This is the foundation OS for your SWGEmu server.",
    commands: [
      {
        label: "Download URL:",
        command:
          "https://cdimage.debian.org/cdimage/archive/11.11.0-live/amd64/iso-hybrid/debian-live-11.11.0-amd64-cinnamon.iso",
      },
    ],
    notes: [
      "You can install on bare metal or a virtual machine (VirtualBox/VMware). This guide assumes VirtualBox.",
      "You'll also need a legally obtained original Star Wars Galaxies game copy for the game data files (.tre files) needed later.",
    ],
  },
  {
    id: "create-vm",
    phase: 1,
    phaseTitle: "Virtual Machine Setup",
    stepNumber: 2,
    title: "Create VirtualBox VM",
    description:
      "Create a new virtual machine in VirtualBox with optimal settings for running the SWGEmu server. Pay close attention to RAM, CPU, storage, and network settings — these directly impact server performance and connectivity.",
    commands: [
      {
        label: "General:",
        command: "Type: Linux, Version: Debian 11 Bullseye (64-bit)",
      },
      {
        label: "Motherboard:",
        command:
          "12GB RAM minimum, 24GB optimal. Boot order: Hard disk first after install.",
      },
      {
        label: "Processor:",
        command:
          "4 cores minimum, 8 recommended. Do not exceed 75% of host cores. Execution Cap: 100%.",
      },
      {
        label: "Acceleration:",
        command:
          "Enable VT-x/AMD-V, Enable Nested Paging, Paravirtualization: KVM",
      },
      {
        label: "Display:",
        command:
          "Video Memory: 128 MB (max), Graphics Controller: VMSVGA, Enable 3D Acceleration",
      },
      {
        label: "Storage:",
        command:
          'SATA Controller (not IDE), Check "Solid-state Drive" if host uses SSD, Fixed Size disk (min 80GB), Enable Host I/O Cache',
      },
      {
        label: "Network:",
        command: "Bridged Adapter",
      },
      {
        label: "Hard Disk Type:",
        command: "VDI (VirtualBox Disk Image)",
      },
    ],
    warnings: [
      "Make sure VT-x/AMD-V is enabled in your BIOS/UEFI settings before creating the VM.",
    ],
    tips: [
      "Fixed size disks perform better than dynamically allocated ones, but take up the full space on your host immediately.",
    ],
  },
  {
    id: "install-debian",
    phase: 1,
    phaseTitle: "Virtual Machine Setup",
    stepNumber: 3,
    title: "Install Debian 11",
    description:
      "Boot the VM from the ISO and follow the Debian installer. Select the Cinnamon desktop environment when prompted. Set up your username and password during installation.",
    notes: [
      "Remember the username and password you set during installation - you'll need them throughout this guide.",
    ],
    tips: [
      "If the installer asks about disk partitioning, 'Guided - use entire disk' is the simplest option for a VM.",
    ],
  },
  {
    id: "guest-additions",
    phase: 1,
    phaseTitle: "Virtual Machine Setup",
    stepNumber: 4,
    title: "Install Guest Additions",
    description:
      "Install VirtualBox Guest Additions for better performance, shared clipboard, and display scaling.",
    commands: [
      {
        label: "Update system packages first:",
        command: "sudo apt update && sudo apt upgrade -y",
        language: "bash",
      },
      {
        label: "Install required build packages:",
        command:
          "sudo apt install build-essential dkms linux-headers-$(uname -r) -y",
        language: "bash",
      },
      {
        label:
          "Insert the Guest Additions CD (VirtualBox menu: Devices → Insert Guest Additions CD Image), then run:",
        command: "sudo sh /media/cdrom/VBoxLinuxAdditions.run",
        language: "bash",
      },
      {
        label: "Reboot to apply changes:",
        command: "sudo reboot",
        language: "bash",
      },
    ],
    warnings: [
      "You may need to add your user account to /etc/sudoers before running sudo commands. Log in as root and edit /etc/sudoers if necessary.",
    ],
    notes: [
      "The Guest Additions CD mount path may vary. Try /media/cdrom0 or /media/cdrom1 if /media/cdrom doesn't work.",
    ],
  },
  {
    id: "optimize-system",
    phase: 1,
    phaseTitle: "Virtual Machine Setup",
    stepNumber: 5,
    title: "Optimize System",
    description:
      "Tune the Debian system for better server performance by adjusting swappiness and disabling unnecessary services.",
    commands: [
      {
        label:
          "Reduce swappiness (default is 60, we want 10 for better RAM usage):",
        command:
          "echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf\nsudo sysctl -p",
        language: "bash",
      },
      {
        label: "List enabled services to find ones you can disable:",
        command:
          "systemctl list-unit-files --type=service | grep enabled",
        language: "bash",
      },
      {
        label: "Disable unnecessary services (example):",
        command: "sudo systemctl disable <service_name>",
        language: "bash",
      },
    ],
    tips: [
      "Keep VirtualBox updated, close unnecessary host applications, and monitor host system performance to maintain good VM responsiveness.",
      "Limit snapshot usage as they can degrade performance over time.",
    ],
  },

  // ──────────────────────────────────────────────
  // Phase 2: Server Installation
  // ──────────────────────────────────────────────
  {
    id: "update-system",
    phase: 2,
    phaseTitle: "Server Installation",
    stepNumber: 6,
    title: "Update System",
    description:
      "Make sure your system is fully up to date before installing server dependencies.",
    commands: [
      {
        command: "sudo apt update && sudo apt upgrade -y",
        language: "bash",
      },
    ],
  },
  {
    id: "install-dependencies",
    phase: 2,
    phaseTitle: "Server Installation",
    stepNumber: 7,
    title: "Install Dependencies",
    description:
      "Install all required development packages for building SWGEmu Core3.",
    commands: [
      {
        label: "Install all required packages:",
        command:
          "sudo apt install -y build-essential git cmake zlib1g-dev liblua5.3-dev \\\nlibboost-all-dev libssl-dev libdb5.3-dev default-jdk libmariadb-dev libmariadb-dev-compat",
        language: "bash",
      },
    ],
    notes: [
      "Package purposes: build-essential (compiler/linker), git (repo cloning), cmake (build config), zlib1g-dev (compression), liblua5.3-dev (Lua scripting), libboost-all-dev (Boost C++ libraries), libssl-dev (SSL/encryption), libdb5.3-dev (Berkeley DB), default-jdk (Java), libmariadb-dev (MariaDB client libraries)",
    ],
    warnings: [
      "Do not substitute different versions of these packages. SWGEmu Core3 is built against these specific library versions on Debian 11.",
    ],
  },
  {
    id: "clone-core3",
    phase: 2,
    phaseTitle: "Server Installation",
    stepNumber: 8,
    title: "Clone Core3",
    description:
      "Clone the official SWGEmu Core3 repository and switch to the unstable branch.",
    commands: [
      {
        label: "Clone the repository:",
        command: "cd ~\ngit clone https://github.com/swgemu/Core3.git",
        language: "bash",
      },
      {
        label: "Switch to the unstable branch:",
        command: "cd Core3\ngit checkout unstable",
        language: "bash",
      },
      {
        label: "Verify you're on the correct branch:",
        command: "git branch",
        language: "bash",
      },
    ],
    notes: [
      "The output of git branch should show '* unstable' - this confirms you're on the right branch.",
    ],
  },
  {
    id: "build-core3",
    phase: 2,
    phaseTitle: "Server Installation",
    stepNumber: 9,
    title: "Build Core3",
    description:
      "Configure and compile the server. This will take a while depending on your system specs.",
    commands: [
      {
        label: "Create the build directory:",
        command: "cd ~/Core3/MMOCoreORB\nmkdir build\ncd build",
        language: "bash",
      },
      {
        label: "Configure the build with CMake:",
        command: "cmake -DCMAKE_BUILD_TYPE=Release ..",
        language: "bash",
      },
      {
        label: "Compile using all available CPU cores:",
        command: "make -j$(nproc)",
        language: "bash",
      },
    ],
    notes: [
      "The -DCMAKE_BUILD_TYPE=Release flag optimizes the code for performance. The '..' tells CMake to look in the parent directory for CMakeLists.txt.",
      "make -j$(nproc) uses all available CPU cores for faster compilation. This can still take 15-45 minutes depending on your hardware.",
    ],
    warnings: [
      "If the build fails, check that all dependencies from the previous step were installed correctly.",
    ],
  },

  // ──────────────────────────────────────────────
  // Phase 3: Database Setup
  // ──────────────────────────────────────────────
  {
    id: "install-mariadb",
    phase: 3,
    phaseTitle: "Database Setup",
    stepNumber: 10,
    title: "Install MariaDB",
    description:
      "Install the MariaDB database server and secure the installation.",
    commands: [
      {
        label: "Install MariaDB server:",
        command: "sudo apt install -y mariadb-server",
        language: "bash",
      },
      {
        label: "Run the security setup wizard:",
        command: "sudo mysql_secure_installation",
        language: "bash",
      },
    ],
    notes: [
      "During mysql_secure_installation, answer the prompts as follows:\n- Set root password: Yes (choose a strong password)\n- Remove anonymous users: Yes\n- Disallow remote root login: Yes\n- Remove test database: Yes\n- Reload privilege tables: Yes",
    ],
  },
  {
    id: "create-database",
    phase: 3,
    phaseTitle: "Database Setup",
    stepNumber: 11,
    title: "Create Database & User",
    description:
      "Create the SWGEmu database and a dedicated user account with appropriate permissions.",
    commands: [
      {
        label: "Connect to MariaDB as root:",
        command: "sudo mariadb -u root -p",
        language: "bash",
      },
      {
        label: "Create the database, user, and grant permissions:",
        command:
          "CREATE DATABASE swgemu;\nCREATE USER 'swgemu'@'localhost' IDENTIFIED BY 'your_password';\nGRANT ALL PRIVILEGES ON swgemu.* TO 'swgemu'@'localhost';\nFLUSH PRIVILEGES;\nEXIT;",
        language: "sql",
      },
    ],
    warnings: [
      "Replace 'your_password' with a strong, unique password. Remember this password - you'll need it for the server configuration.",
    ],
  },
  {
    id: "import-schema",
    phase: 3,
    phaseTitle: "Database Setup",
    stepNumber: 12,
    title: "Import Schema",
    description:
      "Import the database schema files that define the SWGEmu tables and data.",
    commands: [
      {
        label: "Import the main schema:",
        command:
          "cd ~/Core3/MMOCoreORB/sql\nmysql -u swgemu -p swgemu < swgemu.sql",
        language: "bash",
      },
      {
        label: "Import the data tables:",
        command: "mysql -u swgemu -p swgemu < datatables.sql",
        language: "bash",
      },
    ],
    notes: [
      "You'll be prompted for the password you set in the previous step.",
    ],
  },
  {
    id: "install-dbeaver",
    phase: 3,
    phaseTitle: "Database Setup",
    stepNumber: 13,
    title: "Install DBeaver (Optional)",
    description:
      "DBeaver is a free GUI database manager that makes it easier to view and edit your SWGEmu database. This step is optional but recommended.",
    commands: [
      {
        label: "Install wget if not already installed:",
        command: "sudo apt update\nsudo apt install -y wget",
        language: "bash",
      },
      {
        label: "Download DBeaver:",
        command:
          "wget --no-check-certificate https://dbeaver.io/files/dbeaver-ce_latest_amd64.deb",
        language: "bash",
      },
      {
        label: "Install DBeaver:",
        command: "sudo apt install -y ./dbeaver-ce_latest_amd64.deb",
        language: "bash",
      },
      {
        label: "Launch DBeaver:",
        command: "dbeaver",
        language: "bash",
      },
    ],
    notes: [
      "When connecting DBeaver to your database, use these settings:\n- Host: localhost\n- Port: 3306\n- Database: swgemu\n- Username: swgemu\n- Password: (the password you set earlier)",
    ],
    tips: [
      "DBeaver will be useful later for setting admin privileges and configuring your galaxy IP address.",
    ],
  },

  // ──────────────────────────────────────────────
  // Phase 4: Server Configuration
  // ──────────────────────────────────────────────
  {
    id: "configure-server",
    phase: 4,
    phaseTitle: "Server Configuration",
    stepNumber: 14,
    title: "Configure config.lua",
    description:
      "Edit the main server configuration file with your database credentials and server settings.",
    commands: [
      {
        label: "Open config.lua in a text editor:",
        command: "nano ~/Core3/MMOCoreORB/bin/conf/config.lua",
        language: "bash",
      },
      {
        label: "Update the database settings to match your setup:",
        command:
          'DBHost = "127.0.0.1",\nDBPort = 3306,\nDBName = "swgemu",\nDBUser = "swgemu",\nDBPass = "your_password",',
        language: "lua",
      },
      {
        label: "Set a unique security secret:",
        command: 'DBSecret = "your_unique_secret",',
        language: "lua",
      },
      {
        label: "Set the login version string:",
        command: 'LoginRequiredVersion = "20050408-18:00",',
        language: "lua",
      },
      {
        label:
          "Mantis bug tracker config (leave commented out unless you use Mantis):",
        command:
          '-- MantisHost = "127.0.0.1",\n-- MantisPort = 3306,\n-- MantisName = "swgemu",\n-- MantisUser = "swgemu",\n-- MantisPass = "123456",\n-- MantisPrfx = "mantis_",',
        language: "lua",
      },
    ],
    notes: [
      "Save and exit nano with Ctrl+X, then Y, then Enter.",
    ],
    warnings: [
      "Replace 'your_password' with the actual database password you set earlier. Replace 'your_unique_secret' with a random string.",
    ],
  },
  {
    id: "game-data-files",
    phase: 4,
    phaseTitle: "Server Configuration",
    stepNumber: 15,
    title: "Game Data Files",
    description:
      "Copy the required .tre files from your original Star Wars Galaxies game installation to the server. Required files: data_sku1_00.tre, data_sku1_01.tre, data_texture_00.tre, patch_00.tre.",
    commands: [
      {
        label: "Create the default data directory:",
        command: "mkdir -p ~/Desktop/SWGEmu/",
        language: "bash",
      },
      {
        label:
          "Copy your .tre files to this directory, then set permissions:",
        command: "chmod 644 ~/Desktop/SWGEmu/*.tre",
        language: "bash",
      },
      {
        label:
          "If you want to use a custom directory instead, create it and update config.lua:",
        command:
          "mkdir -p ~/SWGEmuTreFiles/\nnano ~/Core3/MMOCoreORB/bin/conf/config.lua",
        language: "bash",
      },
      {
        label: "Add this line to config.lua for a custom path:",
        command:
          'DataPath = "/home/your_username/SWGEmuTreFiles/",',
        language: "lua",
      },
    ],
    warnings: [
      "You must have a legally obtained copy of the original Star Wars Galaxies game to get these .tre files. The server cannot run without them.",
    ],
    notes: [
      "The default directory is ~/Desktop/SWGEmu/. If you place your .tre files there, no config.lua changes are needed.",
    ],
  },
  {
    id: "firewall-setup",
    phase: 4,
    phaseTitle: "Server Configuration",
    stepNumber: 16,
    title: "Firewall Setup",
    description:
      "Configure firewall rules to allow game traffic through. You need to configure both the Linux firewall on the server and any host firewalls.",
    commands: [
      {
        label: "Install and configure UFW (Linux firewall):",
        command:
          "sudo apt install -y ufw\nsudo ufw allow 44419/tcp\nsudo ufw allow 44419/udp\nsudo ufw allow 44453/tcp\nsudo ufw allow 44453/udp\nsudo ufw allow 44455/tcp\nsudo ufw allow 44455/udp\nsudo ufw allow 44462/tcp\nsudo ufw allow 44462/udp\nsudo ufw allow 44463/tcp\nsudo ufw allow 44463/udp\nsudo ufw enable",
        language: "bash",
      },
      {
        label: "Check firewall status:",
        command: "sudo ufw status",
        language: "bash",
      },
      {
        label:
          "Windows host firewall (run in PowerShell as Administrator):",
        command:
          '# Inbound rules\nNew-NetFirewallRule -DisplayName "SWGEmu 44419" -Direction Inbound -LocalPort 44419 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44419 UDP" -Direction Inbound -LocalPort 44419 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44453" -Direction Inbound -LocalPort 44453 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44453 UDP" -Direction Inbound -LocalPort 44453 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44455" -Direction Inbound -LocalPort 44455 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44455 UDP" -Direction Inbound -LocalPort 44455 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44462" -Direction Inbound -LocalPort 44462 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44462 UDP" -Direction Inbound -LocalPort 44462 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44463" -Direction Inbound -LocalPort 44463 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu 44463 UDP" -Direction Inbound -LocalPort 44463 -Protocol UDP -Action Allow\n\n# Outbound rules\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44419" -Direction Outbound -LocalPort 44419 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44419 UDP" -Direction Outbound -LocalPort 44419 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44453" -Direction Outbound -LocalPort 44453 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44453 UDP" -Direction Outbound -LocalPort 44453 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44455" -Direction Outbound -LocalPort 44455 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44455 UDP" -Direction Outbound -LocalPort 44455 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44462" -Direction Outbound -LocalPort 44462 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44462 UDP" -Direction Outbound -LocalPort 44462 -Protocol UDP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44463" -Direction Outbound -LocalPort 44463 -Protocol TCP -Action Allow\nNew-NetFirewallRule -DisplayName "SWGEmu Out 44463 UDP" -Direction Outbound -LocalPort 44463 -Protocol UDP -Action Allow',
        language: "powershell",
      },
    ],
    warnings: [
      "If your VM uses NAT network mode instead of Bridged Adapter, you'll also need to add port forwarding rules in VirtualBox VM settings (Settings → Network → Advanced → Port Forwarding) for all the ports above.",
    ],
    notes: [
      "Ports used: 44419 (login), 44453 (zone), 44455 (ping), 44462 (status), 44463 (web)",
    ],
  },

  // ──────────────────────────────────────────────
  // Phase 5: Running & Managing
  // ──────────────────────────────────────────────
  {
    id: "start-server",
    phase: 5,
    phaseTitle: "Running & Managing",
    stepNumber: 17,
    title: "Start the Server",
    description:
      "Launch the SWGEmu server for the first time.",
    commands: [
      {
        label: "Navigate to the server binary directory and start:",
        command: "cd ~/Core3/MMOCoreORB/bin\n./core3",
        language: "bash",
      },
      {
        label: "To stop the server:",
        command: "Press Ctrl+C or type 'exit' and press Enter",
      },
    ],
    notes: [
      "The server will output a lot of initialization messages on first start. Wait until you see the login prompt or 'server started' message before trying to connect.",
    ],
    tips: [
      "Check the logs directory for troubleshooting: ls -l ~/Core3/MMOCoreORB/log",
    ],
  },
  {
    id: "admin-setup",
    phase: 5,
    phaseTitle: "Running & Managing",
    stepNumber: 18,
    title: "Admin Setup",
    description:
      "Grant yourself admin privileges in the game by modifying the database and client configuration.",
    commands: [
      {
        label:
          "In DBeaver or MariaDB CLI, set admin level to 15 (full admin) for your account in the accounts table:",
        command:
          "UPDATE accounts SET admin_level = 15 WHERE username = 'your_username';",
        language: "sql",
      },
      {
        label:
          "On your game client PC, edit the users.cfg file and add these lines:",
        command:
          "[ClientGame]\n0fd345d9 = TRUE\n[ClientUserInterface]\ndebugExamine = TRUE",
        language: "ini",
      },
    ],
    notes: [
      "admin_level 15 gives full administrative access. The users.cfg changes enable the admin UI in the game client.",
    ],
    warnings: [
      "The users.cfg file is on your game CLIENT machine, not on the server.",
    ],
  },
  {
    id: "galaxy-ip",
    phase: 5,
    phaseTitle: "Running & Managing",
    stepNumber: 19,
    title: "Galaxy IP Configuration",
    description:
      "Set your server's public IP address in the database so clients can connect.",
    commands: [
      {
        label: "Find your public IP address:",
        command: "curl ifconfig.me",
        language: "bash",
      },
      {
        label:
          "Update the galaxy table with your IP (in DBeaver or MariaDB CLI):",
        command:
          "UPDATE galaxy SET address = 'YOUR_PUBLIC_IP' WHERE name = 'Core3';",
        language: "sql",
      },
    ],
    notes: [
      "You can also visit whatismyipaddress.com to find your public IP.",
      "For local/LAN play only, you can use your machine's local IP address instead.",
    ],
    warnings: [
      "After changing the galaxy IP, you must restart the server for it to take effect.",
    ],
  },
  {
    id: "database-backup",
    phase: 5,
    phaseTitle: "Running & Managing",
    stepNumber: 20,
    title: "Database Backup & Restore",
    description:
      "Regularly back up your database to prevent data loss.",
    commands: [
      {
        label: "Create a backup:",
        command: "mysqldump -u swgemu -p swgemu > swgemu_backup.sql",
        language: "bash",
      },
      {
        label: "Restore from a backup:",
        command: "mysql -u swgemu -p swgemu < swgemu_backup.sql",
        language: "bash",
      },
    ],
    tips: [
      "Create backups before making major changes, updating the server, or modifying the database schema.",
      "Consider setting up automated daily backups with a cron job.",
    ],
  },

  // ──────────────────────────────────────────────
  // Phase 6: Updating & Maintenance
  // ──────────────────────────────────────────────
  {
    id: "pull-updates",
    phase: 6,
    phaseTitle: "Updating & Maintenance",
    stepNumber: 21,
    title: "Pull Updates",
    description:
      "Pull the latest changes from the official SWGEmu repository.",
    commands: [
      {
        label: "Navigate to the Core3 directory and pull:",
        command: "cd ~/Core3/MMOCoreORB\ngit pull",
        language: "bash",
      },
      {
        label:
          "If you get a 'dubious ownership' error, fix it with:",
        command:
          "git config --global --add safe.directory /home/swgemu/Core3\ngit pull",
        language: "bash",
      },
      {
        label: "Check for merge conflicts:",
        command: "git status",
        language: "bash",
      },
      {
        label:
          "If there are conflicts, resolve them by editing the conflicted files, removing conflict markers, then:",
        command:
          'git add path/to/conflicted/file\ngit commit -m "Resolve merge conflicts between local changes and remote updates"',
        language: "bash",
      },
    ],
    notes: [
      "Conflict markers look like:\n<<<<<<< HEAD\nYour local changes\n=======\nRemote changes\n>>>>>>> [commit hash]\n\nEdit the file to keep the changes you want and remove all marker lines.",
    ],
    warnings: [
      "Always back up your config.lua and database before pulling updates.",
    ],
  },
  {
    id: "rebuild-server",
    phase: 6,
    phaseTitle: "Updating & Maintenance",
    stepNumber: 22,
    title: "Rebuild Server",
    description:
      "After pulling updates, you need to rebuild the server binary.",
    commands: [
      {
        label: "Delete the old build directory:",
        command: "rm -rf ~/Core3/MMOCoreORB/build",
        language: "bash",
      },
      {
        label: "Create a fresh build directory and compile:",
        command:
          "mkdir ~/Core3/MMOCoreORB/build\ncd ~/Core3/MMOCoreORB/build\ncmake -DCMAKE_BUILD_TYPE=Release ..\nmake -j$(nproc)",
        language: "bash",
      },
    ],
    warnings: [
      "Be very careful with the rm -rf command. Make sure you're deleting the correct directory. Double-check the path before pressing Enter.",
    ],
    tips: [
      "Back up your config.lua before rebuilding:\ncp ~/Core3/MMOCoreORB/bin/conf/config.lua ~/Core3/MMOCoreORB/bin/conf/config.lua.bak",
    ],
  },
  {
    id: "best-practices",
    phase: 6,
    phaseTitle: "Updating & Maintenance",
    stepNumber: 23,
    title: "Best Practices",
    description:
      "Tips for maintaining your SWGEmu server long-term using Git branching, stashing, and regular backups.",
    commands: [
      {
        label: "Create a feature branch for your custom changes:",
        command: "git checkout -b my-feature-branch",
        language: "bash",
      },
      {
        label: "Switch back to unstable when needed:",
        command: "git checkout unstable",
        language: "bash",
      },
      {
        label: "Merge your feature branch into unstable:",
        command:
          "git checkout unstable\ngit pull\ngit merge my-feature-branch",
        language: "bash",
      },
      {
        label: "Stash temporary changes:",
        command: "git stash\n# ... do other work ...\ngit stash pop",
        language: "bash",
      },
      {
        label: "View commit history:",
        command: "git log --oneline",
        language: "bash",
      },
      {
        label: "View uncommitted changes:",
        command: "git diff",
        language: "bash",
      },
      {
        label: "Back up your database before major changes:",
        command: "mysqldump -u swgemu -p swgemu > swgemu-backup.sql",
        language: "bash",
      },
    ],
    tips: [
      "Make frequent, small commits with descriptive messages to track changes effectively.",
      "Pull updates regularly from the official repo to reduce complex merge conflicts.",
      "Use .gitignore to exclude files you don't want tracked (logs, local configs).",
    ],
    notes: [
      "Consider using feature branches for any substantial customization work. This keeps the unstable branch clean for pulling official updates.",
    ],
  },
];
