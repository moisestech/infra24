const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ooliteTheme = {
  id: '73339522-c672-40ac-a464-e027e9c99d13', // Oolite's organization ID
  name: 'Oolite Arts',
  colors: {
    primary: '#47abc4',
    secondary: '#2c5f6f',
    accent: '#6bb6c7',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1a202c',
    textSecondary: '#4a5568',
    border: '#e2e8f0',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#47abc4',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: '0.5rem',
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function updateOoliteTheme() {
  try {
    console.log('Updating Oolite theme...');
    
    const { data, error } = await supabase
      .from('organizations')
      .update({ 
        theme: ooliteTheme,
        updated_at: new Date().toISOString()
      })
      .eq('slug', 'oolite')
      .select();

    if (error) {
      console.error('Error updating Oolite theme:', error);
      return;
    }

    console.log('✅ Oolite theme updated successfully!');
    console.log('Updated organization:', data[0]);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

updateOoliteTheme();
