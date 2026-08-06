// Supabase REST Client for Project: ranjeetserious8-commits's Project
// Project ID: bfqrmgmnzmgdzboamjhd

export const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'bfqrmgmnzmgdzboamjhd';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bfqrmgmnzmgdzboamjhd.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0hnx4dQZs8gvSA6ayOIYVg_bDD-e9E5';

const getHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation,resolution=merge-duplicates'
});

// Shift user profile data to Supabase (Project ID: bfqrmgmnzmgdzboamjhd)
export const syncUserProfileToSupabase = async (profileData) => {
  const username = profileData.username || profileData.gmail || 'rnejet3';
  const payload = {
    username: username,
    first_name: profileData.firstName || '',
    surname: profileData.surname || '',
    gmail: profileData.gmail || '',
    avatar_url: profileData.avatarUrl || '',
    wallet_balance: profileData.normalWalletBalance || 0,
    updated_at: new Date().toISOString()
  };

  // Local storage backup
  try {
    localStorage.setItem('deepmarket_supabase_user_profile', JSON.stringify(payload));
  } catch (e) {
    // ignore
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([payload])
    });
    const data = await res.json();
    return { data, status: res.status };
  } catch (err) {
    console.warn('Supabase REST sync notice (falling back to local state):', err.message);
    return { error: err };
  }
};

// Fetch user profile data from Supabase (Project ID: bfqrmgmnzmgdzboamjhd)
export const fetchUserProfileFromSupabase = async (username = 'rnejet3') => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?username=eq.${username}&select=*`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        return {
          username: item.username,
          firstName: item.first_name,
          surname: item.surname,
          gmail: item.gmail,
          avatarUrl: item.avatar_url,
          normalWalletBalance: item.wallet_balance
        };
      }
    }
  } catch (err) {
    console.warn('Supabase fetch notice:', err.message);
  }

  // Fallback to local storage
  const saved = localStorage.getItem('deepmarket_supabase_user_profile');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        username: parsed.username,
        firstName: parsed.first_name,
        surname: parsed.surname,
        gmail: parsed.gmail,
        avatarUrl: parsed.avatar_url,
        normalWalletBalance: parsed.wallet_balance
      };
    } catch (e) {
      // ignore
    }
  }
  return null;
};

// Sync order transactions to Supabase
export const syncOrderToSupabase = async (orderData) => {
  const payload = {
    order_id: orderData.id || orderData.orderNumber,
    suite_name: orderData.suiteName,
    total_paid: orderData.totalPaid || orderData.priceInr,
    payment_method: orderData.paymentMethod,
    status: orderData.status,
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([payload])
    });
    const data = await res.json();
    return { data, status: res.status };
  } catch (err) {
    console.warn('Supabase order sync notice:', err.message);
    return { error: err };
  }
};

// Auto seed initial sample user profiles & orders to Supabase dashboard
export const autoSeedSupabaseData = async () => {
  try {
    const sampleProfiles = [
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
        gmail: 'rahul.mehta@gmail.com',
        avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        wallet_balance: 2500,
        updated_at: new Date().toISOString()
      },
      {
        username: 'sneha_p',
        first_name: 'Sneha',
        surname: 'Patel',
        gmail: 'sneha.patel@gmail.com',
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

    await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sampleProfiles)
    });

    await fetch(`${SUPABASE_URL}/rest/v1/user_orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sampleOrders)
    });
  } catch (err) {
    console.warn('Auto-seed notice:', err.message);
  }
};
