const fs = require('fs');
const path = require('path');
const { DEFAULT_ACHIEVEMENTS, DEFAULT_SHOP_ITEMS, DEFAULT_BOSSES, CLASSES, REAL_MONEY_PACKS, REAL_MONEY_REWARDS } = require('./defaultData');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = {
  users: [],
  profiles: [],
  goals: [],
  campaigns: [],
  chapters: [],
  quests: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  user_achievements: [],
  inventory: [],
  shop_items: DEFAULT_SHOP_ITEMS,
  real_money_packs: REAL_MONEY_PACKS,
  real_money_rewards: REAL_MONEY_REWARDS,
  real_money_transactions: [],
  bosses: [],
  xp_transactions: [],
  combat_logs: []
};

// Load database if exists
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const loaded = JSON.parse(raw);
      db = {
        ...db,
        ...loaded,
        achievements: DEFAULT_ACHIEVEMENTS,
        shop_items: DEFAULT_SHOP_ITEMS
      };
      console.log('📦 Database loaded successfully with', db.users.length, 'users');
    } else {
      saveDatabase();
      console.log('🌱 Initialized brand new database at', DB_FILE);
    }
  } catch (err) {
    console.error('⚠️ Error loading database, falling back to initial state:', err);
    saveDatabase();
  }
}

// Atomic save
function saveDatabase() {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('❌ Failed to save database:', err);
  }
}

loadDatabase();

module.exports = {
  db,
  saveDatabase,
  CLASSES
};
