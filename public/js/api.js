// Frontend API Client for Real-Life Quest
const API_BASE = '/api';

class ApiService {
  constructor() {
    this.userId = localStorage.getItem('rlq_user_id') || 'user_demo_1';
    this.userApiKey = localStorage.getItem('rlq_gemini_key') || '';
  }

  setUserId(id) {
    this.userId = id;
    localStorage.setItem('rlq_user_id', id);
  }

  setGeminiApiKey(key) {
    this.userApiKey = key;
    localStorage.setItem('rlq_gemini_key', key);
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': this.userId,
      ...(options.headers || {})
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Network request failed');
    }
    return data;
  }

  // Auth
  async register(username, email, heroClass, avatar) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, heroClass, avatar })
    });
    if (res.user) this.setUserId(res.user.id);
    return res;
  }

  async login(username) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
    if (res.user) this.setUserId(res.user.id);
    return res;
  }

  async loadDemo() {
    const res = await this.request('/auth/demo', {
      method: 'POST'
    });
    if (res.user) this.setUserId(res.user.id);
    return res;
  }

  // Profile
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(updates) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Campaigns
  async generateCampaign(goalData) {
    return this.request('/campaigns/generate', {
      method: 'POST',
      body: JSON.stringify({
        ...goalData,
        userApiKey: this.userApiKey
      })
    });
  }

  async getCampaigns() {
    return this.request('/campaigns');
  }

  async getCampaignDetails(campaignId) {
    return this.request(`/campaigns/${campaignId}`);
  }

  // Quests
  async getTodayQuests() {
    return this.request('/quests/today');
  }

  async startQuest(questId) {
    return this.request(`/quests/${questId}/start`, { method: 'POST' });
  }

  async completeQuest(questId, notes = '') {
    return this.request(`/quests/${questId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  async createCustomQuest(questData) {
    return this.request('/quests', {
      method: 'POST',
      body: JSON.stringify(questData)
    });
  }

  // Boss
  async getActiveBoss() {
    return this.request('/bosses/active');
  }

  // Achievements
  async getAchievements() {
    return this.request('/achievements');
  }

  // Shop & Inventory
  async getShop() {
    return this.request('/shop');
  }

  async getInventory() {
    return this.request('/inventory');
  }

  async buyItem(itemId) {
    return this.request('/shop/buy', {
      method: 'POST',
      body: JSON.stringify({ itemId })
    });
  }

  // AI Game Master
  async chatGameMaster(message) {
    return this.request('/ai/game-master', {
      method: 'POST',
      body: JSON.stringify({
        message,
        userApiKey: this.userApiKey
      })
    });
  }

  // Telangana State Board Syllabus
  async getTelanganaClasses() {
    return this.request('/telangana/classes');
  }

  async getTelanganaSyllabus(classId) {
    return this.request(`/telangana/syllabus/${classId}`);
  }

  async generateTelanganaCampaign(data) {
    return this.request('/telangana/generate-campaign', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Real Money Treasury & Extra Gold
  async getRealMoneyStore() {
    return this.request('/real-money/store');
  }

  async buyGoldPack(packId, paymentMethod = 'UPI (PhonePe/GPay)') {
    return this.request('/real-money/buy-gold', {
      method: 'POST',
      body: JSON.stringify({ packId, paymentMethod })
    });
  }

  async redeemRealReward(rewardId, upiId = '') {
    return this.request('/real-money/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId, upiId, email: upiId })
    });
  }

  async getRealMoneyTransactions() {
    return this.request('/real-money/transactions');
  }

  // Reset
  async resetData() {
    return this.request('/settings/reset', { method: 'POST' });
  }

  // Study Topic & Challenge Quiz
  async getTopicStudy(topicTitle, subject, classId) {
    return this.request('/study/topic', {
      method: 'POST',
      body: JSON.stringify({ topicTitle, subject, classId })
    });
  }

  async submitQuiz(data) {
    return this.request('/study/submit-quiz', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getStudyLog() {
    return this.request('/study/log');
  }
}

window.api = new ApiService();
