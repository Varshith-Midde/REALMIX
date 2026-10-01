// Shop & Real Money Treasury View: Buy Buffs, Extra Gold Packs (₹ INR), and Cash Out Real Rewards

async function renderShopView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  const profile = window.state.profile;
  let shopItems = [];
  let userInventory = [];
  let realMoneyStore = null;
  let realMoneyTxs = [];

  try {
    const [shopRes, invRes, rmRes, txRes] = await Promise.all([
      window.api.getShop(),
      window.api.getInventory(),
      window.api.getRealMoneyStore(),
      window.api.getRealMoneyTransactions()
    ]);
    shopItems = shopRes.items || [];
    userInventory = invRes.inventory || [];
    realMoneyStore = rmRes;
    realMoneyTxs = txRes.transactions || [];
  } catch (err) {
    console.warn('Shop fetch error:', err);
  }

  const currentGold = profile?.gold || 0;
  const inrEquivalent = (currentGold * 0.10).toFixed(2);

  container.innerHTML = `
    <!-- HEADER -->
    <div class="section-header">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold-glow); font-weight: 700;">TREASURY & REAL WEALTH VAULT</div>
        <h2 class="section-title">🎒 Adventurer's Shop & Real Money Vault</h2>
        <div class="section-subtitle">Real-world effort has real value. Convert daily academic grit into real money rewards, or buy extra coin packs.</div>
      </div>
    </div>

    <!-- REAL MONEY WEALTH STATUS BANNER -->
    <div class="rpg-card rpg-card-gold" style="background: linear-gradient(135deg, rgba(40, 28, 10, 0.9), rgba(20, 16, 12, 0.9)); border: 1px solid var(--border-gold); margin-bottom: 2rem; padding: 1.5rem 1.75rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
        <div>
          <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-glow); font-weight: 700;">YOUR ACTIVE GOLD TREASURE</div>
          <div style="font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0.15rem 0;">
            🪙 ${currentGold} Gold
            <span style="font-size: 1.2rem; color: var(--gold-glow); margin-left: 0.5rem;">≈ ₹${inrEquivalent} INR</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Official Exchange Standard: <strong>100 Gold Coins = ₹10.00 INR</strong> (10 Gold = ₹1.00 INR)
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-gold" id="openBuyGoldModalBtn">
            💳 Buy Extra Gold (₹ INR)
          </button>
          <button class="btn-primary" id="openRedeemCashoutBtn" style="background: linear-gradient(135deg, #10b981, #059669);">
            💸 Cash Out / Redeem Rewards
          </button>
        </div>
      </div>
    </div>

    <!-- REAL MONEY EXTRA GOLD COIN PACKS -->
    <div style="margin-bottom: 2.5rem;">
      <div class="section-header" style="margin-bottom: 1rem;">
        <div>
          <h3 style="font-family: var(--font-rpg); font-size: 1.3rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🪙</span> Real Money Extra Gold Packs (₹ INR)
          </h3>
          <div style="font-size: 0.82rem; color: var(--text-muted);">Instant top-up to unlock streak shields, potions, and legendary companions.</div>
        </div>
      </div>

      <div class="shop-grid">
        ${(realMoneyStore?.packs || []).map(p => `
          <div class="shop-item-card" style="border-color: rgba(245, 158, 11, 0.35);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
                <div class="item-icon-box" style="font-size: 2rem;">${p.icon}</div>
                <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: var(--gold-glow);">${p.badge}</span>
              </div>
              <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem;">${p.name}</h4>
              <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 800; color: var(--gold-glow); margin-bottom: 0.4rem;">
                +${p.goldAmount} 🪙 <span style="font-size: 0.95rem; color: #fff;">for ₹${p.priceInr}</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.5rem;">${p.description}</p>
            </div>

            <button class="btn-gold btn-sm buy-gold-pack-btn" data-id="${p.id}" data-price="${p.priceInr}" data-gold="${p.goldAmount}" style="width: 100%; justify-content: center;">
              💳 Buy for ₹${p.priceInr} INR
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- REAL MONEY REWARDS REDEMPTION -->
    <div style="margin-bottom: 2.5rem;">
      <div class="section-header" style="margin-bottom: 1rem;">
        <div>
          <h3 style="font-family: var(--font-rpg); font-size: 1.3rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🎁</span> Redeem Earned Gold for Real Rewards
          </h3>
          <div style="font-size: 0.82rem; color: var(--text-muted);">Turn genuine study streaks & quest milestones into Amazon/Flipkart vouchers or direct UPI transfers.</div>
        </div>
      </div>

      <div class="shop-grid">
        ${(realMoneyStore?.rewards || []).map(r => {
          const canRedeem = currentGold >= r.goldCost;
          return `
            <div class="shop-item-card" style="border-color: rgba(16, 185, 129, 0.35);">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
                  <div class="item-icon-box" style="font-size: 2rem;">${r.icon}</div>
                  <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">₹${r.realValueInr} REAL VALUE</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem;">${r.name}</h4>
                <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 800; color: #34d399; margin-bottom: 0.4rem;">
                  Cost: ${r.goldCost} 🪙
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">${r.description}</p>
              </div>

              <button class="btn-primary btn-sm redeem-reward-btn" data-id="${r.id}" data-cost="${r.goldCost}" data-val="${r.realValueInr}" ${!canRedeem ? 'disabled style="opacity: 0.5; cursor: not-allowed; background: #374151;"' : 'style="background: linear-gradient(135deg, #10b981, #059669);"'}>
                ${canRedeem ? `💸 Claim ₹${r.realValueInr}` : `🔒 Need ${r.goldCost - currentGold} More Gold`}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- IN-GAME POWER-UPS & COMPANIONS (IN-GAME GOLD ONLY) -->
    <div style="margin-bottom: 2.5rem;">
      <h3 style="font-family: var(--font-rpg); font-size: 1.3rem; margin-bottom: 1rem;">🛡️ In-Game Buffs & Companions</h3>
      <div class="shop-grid">
        ${shopItems.map(item => {
          const canAfford = currentGold >= item.price;
          return `
            <div class="shop-item-card">
              <div>
                <div class="item-icon-box">${item.icon}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <h4 style="font-size: 1.05rem; font-weight: 700; color: #fff;">${item.name}</h4>
                  <span class="badge" style="font-size: 0.68rem; background: rgba(255,255,255,0.06); color: var(--gold-glow);">${item.rarity.toUpperCase()}</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">${item.description}</p>
              </div>

              <button class="btn-gold btn-sm buy-item-btn" data-id="${item.id}" ${!canAfford ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="width: 100%; justify-content: center;">
                🪙 Buy for ${item.price} Gold
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- REAL MONEY TRANSACTION LEDGER -->
    ${realMoneyTxs.length > 0 ? `
      <div class="rpg-card" style="margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-rpg); font-size: 1.15rem; margin-bottom: 0.75rem;">📜 Real Money & Payout Transaction Ledger</h3>
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${realMoneyTxs.slice(0, 5).map(tx => `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
              <div>
                <strong style="color: #fff;">${tx.type === 'buy_gold' ? '💳 Extra Gold Purchase' : '💸 Real Reward Cashout'}</strong>: ${tx.packName || tx.rewardName}
                <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(tx.timestamp).toLocaleString()} • Ref: ${tx.referenceCode || tx.id}</div>
              </div>
              <div style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: ${tx.type === 'buy_gold' ? 'var(--gold-glow)' : 'var(--success-green)'};">
                ${tx.type === 'buy_gold' ? `+${tx.goldCredited} 🪙 (₹${tx.amountInr})` : `-₹${tx.realValueInr} Disbursed`}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- INVENTORY BAG SECTION -->
    <div class="rpg-card">
      <h3 style="font-family: var(--font-rpg); font-size: 1.2rem; margin-bottom: 0.75rem;">🎒 Your Inventory Bag</h3>
      ${userInventory.length > 0 ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
          ${userInventory.map(inv => `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 2rem;">${inv.item?.icon || '📦'}</span>
              <div>
                <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">${inv.item?.name || 'Item'}</div>
                <div style="font-size: 0.78rem; color: var(--gold-glow);">Quantity: ×${inv.quantity}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <p style="color: var(--text-muted); font-size: 0.88rem;">Your inventory is empty. Purchase a Streak Shield or companion above with your quest gold!</p>
      `}
    </div>
  `;

  // Attach Handlers

  // 1. Buy Extra Gold Coins Modal / Instant Simulated Payment
  document.querySelectorAll('.buy-gold-pack-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const packId = e.currentTarget.getAttribute('data-id');
      const price = e.currentTarget.getAttribute('data-price');
      const gold = e.currentTarget.getAttribute('data-gold');

      const confirmed = confirm(`💳 Confirm Payment: Buy +${gold} Gold Coins for ₹${price} INR via UPI/Card?`);
      if (confirmed) {
        try {
          window.soundFx.playCoin();
          const res = await window.api.buyGoldPack(packId);
          window.soundFx.playLevelUp();
          window.spawnConfetti();
          alert(res.message);
          await window.state.refreshAll();
          renderShopView();
        } catch (err) {
          alert(err.message);
        }
      }
    });
  });

  // 2. Redeem Rewards & Cashout
  document.querySelectorAll('.redeem-reward-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const rewardId = e.currentTarget.getAttribute('data-id');
      const val = e.currentTarget.getAttribute('data-val');
      const cost = e.currentTarget.getAttribute('data-cost');

      const upiId = prompt(`💸 Real Money Cashout (₹${val} INR):\nEnter your UPI ID (e.g. yourname@oksbi / yourname@paytm) or Email for digital voucher:`);
      if (upiId) {
        try {
          window.soundFx.playCoin();
          const res = await window.api.redeemRealReward(rewardId, upiId);
          window.soundFx.playLevelUp();
          window.spawnConfetti();
          alert(res.message);
          await window.state.refreshAll();
          renderShopView();
        } catch (err) {
          alert(err.message);
        }
      }
    });
  });

  // 3. Regular In-game Item Purchase
  document.querySelectorAll('.buy-item-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const itemId = e.currentTarget.getAttribute('data-id');
      try {
        window.soundFx.playCoin();
        const res = await window.api.buyItem(itemId);
        alert(res.message);
        await window.state.refreshAll();
        renderShopView();
      } catch (err) {
        alert(err.message);
      }
    });
  });

  // Top header button triggers
  const openBuyBtn = document.getElementById('openBuyGoldModalBtn');
  if (openBuyBtn) {
    openBuyBtn.addEventListener('click', () => {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    });
  }

  const openRedeemBtn = document.getElementById('openRedeemCashoutBtn');
  if (openRedeemBtn) {
    openRedeemBtn.addEventListener('click', () => {
      window.scrollTo({ top: 750, behavior: 'smooth' });
    });
  }
}
