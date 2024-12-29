import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/supabase_config/supabase'; 
import Navigation from './src/navigation/navigation';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); 
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); 
    });
  }, []);
  
  return (
    <Navigation />
  );
}
