// Preset initial game data: Achievements, Items, Bosses, and Campaign Templates
module.exports = {
  DEFAULT_ACHIEVEMENTS: [
    {
      id: "ach_first_quest",
      name: "First Blood",
      description: "Complete your very first real-life quest.",
      icon: "⚔️",
      requirement_type: "quests_completed",
      requirement_value: 1,
      reward_xp: 50,
      reward_gold: 25,
      rarity: "bronze"
    },
    {
      id: "ach_quest_10",
      name: "Adventurer Novice",
      description: "Complete 10 quests in your journey.",
      icon: "📜",
      requirement_type: "quests_completed",
      requirement_value: 10,
      reward_xp: 150,
      reward_gold: 75,
      rarity: "bronze"
    },
    {
      id: "ach_quest_25",
      name: "Hero in Training",
      description: "Complete 25 quests across all campaigns.",
      icon: "🎖️",
      requirement_type: "quests_completed",
      requirement_value: 25,
      reward_xp: 300,
      reward_gold: 150,
      rarity: "silver"
    },
    {
      id: "ach_level_5",
      name: "Vanguard Awakening",
      description: "Reach Character Level 5.",
      icon: "⭐",
      requirement_type: "level",
      requirement_value: 5,
      reward_xp: 200,
      reward_gold: 100,
      rarity: "silver"
    },
    {
      id: "ach_level_10",
      name: "Elite Crusader",
      description: "Reach Character Level 10.",
      icon: "🌟",
      requirement_type: "level",
      requirement_value: 10,
      reward_xp: 500,
      reward_gold: 250,
      rarity: "gold"
    },
    {
      id: "ach_streak_3",
      name: "Spark of Discipline",
      description: "Maintain a 3-day active quest streak.",
      icon: "🔥",
      requirement_type: "streak",
      requirement_value: 3,
      reward_xp: 100,
      reward_gold: 50,
      rarity: "bronze"
    },
    {
      id: "ach_streak_7",
      name: "Unbroken Will",
      description: "Maintain a 7-day active quest streak.",
      icon: "🛡️",
      requirement_type: "streak",
      requirement_value: 7,
      reward_xp: 250,
      reward_gold: 150,
      rarity: "silver"
    },
    {
      id: "ach_streak_30",
      name: "Legend of Routine",
      description: "Maintain a 30-day legendary streak.",
      icon: "👑",
      requirement_type: "streak",
      requirement_value: 30,
      reward_xp: 1000,
      reward_gold: 500,
      rarity: "legendary"
    },
    {
      id: "ach_boss_first",
      name: "Dragon Slayer",
      description: "Defeat your first epic boss monster.",
      icon: "🐉",
      requirement_type: "bosses_defeated",
      requirement_value: 1,
      reward_xp: 500,
      reward_gold: 300,
      rarity: "gold"
    },
    {
      id: "ach_gold_500",
      name: "Treasure Hunter",
      description: "Amass a fortune of 500 gold coins.",
      icon: "🪙",
      requirement_type: "gold",
      requirement_value: 500,
      reward_xp: 150,
      reward_gold: 50,
      rarity: "bronze"
    }
  ],

  DEFAULT_SHOP_ITEMS: [
    {
      id: "item_streak_shield",
      name: "Streak Shield",
      type: "consumable",
      rarity: "rare",
      price: 150,
      icon: "🛡️",
      description: "Automatically prevents streak reset if you miss a single day. Consumed on save.",
      effect: "streak_protection"
    },
    {
      id: "item_xp_potion",
      name: "Elixir of Focus",
      type: "consumable",
      rarity: "uncommon",
      price: 100,
      icon: "🧪",
      description: "Grants +50% bonus XP on the next 3 completed quests.",
      effect: "xp_boost"
    },
    {
      id: "item_quest_reroll",
      name: "Fate Reroll Scroll",
      type: "consumable",
      rarity: "common",
      price: 50,
      icon: "🎟️",
      description: "Allows swapping out a daunting daily quest for an alternative challenge.",
      effect: "reroll_quest"
    },
    {
      id: "item_pet_dragon",
      name: "Baby Coding Wyrm",
      type: "pet",
      rarity: "legendary",
      price: 500,
      icon: "🐉",
      description: "A loyal mini-dragon companion that breathes motivational embers on your dashboard.",
      effect: "cosmetic_companion"
    },
    {
      id: "item_pet_cat",
      name: "Scholar Cat",
      type: "pet",
      rarity: "rare",
      price: 350,
      icon: "🐱",
      description: "An erudite feline wearing tiny glasses that sits by your study quests.",
      effect: "cosmetic_companion"
    },
    {
      id: "item_pet_fox",
      name: "Focus Kitsune",
      type: "pet",
      rarity: "epic",
      price: 450,
      icon: "🦊",
      description: "A nimble spirit fox that wards off social media distractions.",
      effect: "cosmetic_companion"
    },
    {
      id: "item_title_architect",
      name: "Title: 'The Relentless'",
      type: "cosmetic",
      rarity: "epic",
      price: 300,
      icon: "🏷️",
      description: "Display the prestigious title 'The Relentless' under your character name.",
      effect: "title"
    }
  ],

  REAL_MONEY_PACKS: [
    {
      id: "pack_starter_500",
      name: "Apprentice Coin Pouch",
      priceInr: 49,
      goldAmount: 500,
      bonusShields: 1,
      icon: "🪙",
      badge: "Popular",
      description: "Get 500 Gold Coins + 1 Free Streak Shield to power up your daily journey."
    },
    {
      id: "pack_scholar_1200",
      name: "Scholar Treasure Chest",
      priceInr: 99,
      goldAmount: 1200,
      bonusShields: 2,
      bonusPotion: 1,
      icon: "💰",
      badge: "+20% Bonus",
      description: "Get 1,200 Gold Coins + 2 Streak Shields + 1 Elixir of Focus for exam preparation."
    },
    {
      id: "pack_topper_2800",
      name: "Topper Grand Vault",
      priceInr: 199,
      goldAmount: 2800,
      bonusShields: 5,
      petUnlocked: "🐉 Baby Coding Wyrm",
      icon: "👑",
      badge: "+40% Extra Gold",
      description: "Get 2,800 Gold Coins + 5 Streak Shields + instant Baby Dragon companion pet!"
    },
    {
      id: "pack_inter_8000",
      name: "Inter Sovereign Apex Vault",
      priceInr: 499,
      goldAmount: 8000,
      bonusShields: 10,
      titleUnlocked: "The Apex Sovereign",
      icon: "💎",
      badge: "Best Value",
      description: "Get 8,000 Gold Coins + 10 Shields + VIP Apex Sovereign Title + Maximum Perks!"
    }
  ],

  REAL_MONEY_REWARDS: [
    {
      id: "redeem_voucher_50",
      name: "₹50 Amazon / Flipkart Gift Voucher",
      goldCost: 500,
      realValueInr: 50,
      type: "voucher",
      icon: "🎁",
      description: "Redeem 500 hard-earned study gold coins for a ₹50 digital e-gift card."
    },
    {
      id: "redeem_books_100",
      name: "₹100 Academic Books / Stationary Voucher",
      goldCost: 1000,
      realValueInr: 100,
      type: "voucher",
      icon: "📚",
      description: "Purchase textbooks, notebooks, and pens with your real quest progression."
    },
    {
      id: "redeem_upi_250",
      name: "₹250 Direct UPI Cash Transfer",
      goldCost: 2500,
      realValueInr: 250,
      type: "upi_cash",
      icon: "⚡",
      description: "Direct instant payout to your PhonePe / GPay / Paytm UPI ID."
    },
    {
      id: "redeem_upi_500",
      name: "₹500 Direct UPI Cash Transfer",
      goldCost: 5000,
      realValueInr: 500,
      type: "upi_cash",
      icon: "💸",
      description: "Reward your academic grit with a ₹500 direct bank UPI transfer."
    }
  ],

  DEFAULT_BOSSES: [
    {
      id: "boss_dragon_procrastination",
      name: "Procrastination Dragon",
      subtitle: "The Dread of Tomorrow",
      avatar: "🐉",
      maxHp: 1000,
      currentHp: 1000,
      description: "Feeds on delays, excuses, and unread tabs. Every completed quest inflicts severe damage to slay the beast!",
      rewardXp: 1000,
      rewardGold: 500,
      badge: "Dragon Slayer",
      status: "active"
    },
    {
      id: "boss_distraction_monster",
      name: "Distraction Behemoth",
      subtitle: "Devourer of Deep Work",
      avatar: "📱",
      maxHp: 1500,
      currentHp: 1500,
      description: "Spawns notification swarms and infinite doom-scrolls. Deal heavy hits through focused work quests.",
      rewardXp: 1500,
      rewardGold: 750,
      badge: "Focus Sovereign",
      status: "locked"
    },
    {
      id: "boss_exam_wyrm",
      name: "Syllabus Wyrm",
      subtitle: "Guardian of the Final Grade",
      avatar: "📚",
      maxHp: 2000,
      currentHp: 2000,
      description: "A colossal beast composed of unread textbooks and pending assignments. Overcome it chapter by chapter.",
      rewardXp: 2000,
      rewardGold: 1000,
      badge: "Academic Apex",
      status: "locked"
    }
  ],

  CLASSES: {
    warrior: {
      name: "Warrior",
      icon: "⚔️",
      title: "Iron Champion",
      description: "Driven by discipline and physical stamina. Gains bonus rewards on habit and fitness quests.",
      statBonus: { discipline: 10, fitness: 8 }
    },
    mage: {
      name: "Mage",
      icon: "🧙",
      title: "Arcane Scholar",
      description: "Driven by curiosity, study, and deep concentration. Gains bonus rewards on research and education quests.",
      statBonus: { knowledge: 12, creativity: 6 }
    },
    engineer: {
      name: "Engineer",
      icon: "💻",
      title: "Tech Artisan",
      description: "Masters code, architectures, and systems. Gains bonus rewards on technical build quests.",
      statBonus: { technical: 12, discipline: 6 }
    },
    rogue: {
      name: "Rogue",
      icon: "🗡️",
      title: "Shadow Operative",
      description: "Swift, resourceful, and thrives in high-pressure deadline challenges.",
      statBonus: { discipline: 8, creativity: 10 }
    },
    explorer: {
      name: "Explorer",
      icon: "🧭",
      title: "Pathfinder",
      description: "Curious world-traveler building multidisciplinary skills and community connections.",
      statBonus: { social: 10, knowledge: 8 }
    }
  }
};
