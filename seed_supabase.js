// Seed script for Supabase Project bfqrmgmnzmgdzboamjhd

const SUPABASE_URL = 'https://bfqrmgmnzmgdzboamjhd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0hnx4dQZs8gvSA6ayOIYVg_bDD-e9E5';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation,resolution=merge-duplicates'
};

const sampleUserProfiles = [
  {
    username: 'rnejet3',
    first_name: 'Ranjeet',
    surname: 'Singh',
    gmail: 'ranjeet.master3@gmail.com',
    avatar_url: '/assets/avatars/men1.jpg',
    wallet_balance: 5000,
    updated_at: new Date().toISOString()
  },
  {
    username: 'rahul_m',
    first_name: 'Rahul',
    surname: 'Mehta',
    gmail: 'rahul.m@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    wallet_balance: 2500,
    updated_at: new Date().toISOString()
  },
  {
    username: 'sneha_p',
    first_name: 'Sneha',
    surname: 'Patel',
    gmail: 'sneha.p@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    wallet_balance: 10000,
    updated_at: new Date().toISOString()
  }
];

const sampleOrders = [
  {
    order_id: 'DM-98402',
    suite_name: 'Shadow Suite (₹11,920 Card Balance)',
    total_paid: 1430,
    payment_method: 'Instant Demo UPI',
    status: 'Completed',
    timestamp: new Date().toISOString()
  },
  {
    order_id: 'DM-98401',
    suite_name: 'Carding Masterclass Special Training Course',
    total_paid: 400,
    payment_method: 'Instant Demo UPI',
    status: 'Completed',
    timestamp: new Date().toISOString()
  },
  {
    order_id: 'DM-98399',
    suite_name: 'Ananya Gold Mastercard',
    total_paid: 1900,
    payment_method: 'Crypto (LTC)',
    status: 'Pending Admin Approval',
    timestamp: new Date().toISOString()
  }
];

async function seedData() {
  console.log("🌱 Feeding sample data into Supabase Project bfqrmgmnzmgdzboamjhd...");

  // 1. Seed user_profiles
  try {
    const resProfiles = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(sampleUserProfiles)
    });
    console.log("User Profiles Seed Status:", resProfiles.status, resProfiles.statusText);
    const bodyProfiles = await resProfiles.text();
    console.log("User Profiles Response:", bodyProfiles);
  } catch (err) {
    console.error("Profiles Seed Error:", err.message);
  }

  // 2. Seed user_orders
  try {
    const resOrders = await fetch(`${SUPABASE_URL}/rest/v1/user_orders`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(sampleOrders)
    });
    console.log("User Orders Seed Status:", resOrders.status, resOrders.statusText);
    const bodyOrders = await resOrders.text();
    console.log("User Orders Response:", bodyOrders);
  } catch (err) {
    console.error("Orders Seed Error:", err.message);
  }
}

seedData();
