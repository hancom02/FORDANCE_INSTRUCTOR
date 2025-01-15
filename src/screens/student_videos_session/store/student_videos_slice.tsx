import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { Alert } from 'react-native';

export const useStudentVideo = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,
      insertFeedback: async (instructor_id: string, feedbackList: IJoin[]): Promise<IJoin[] | null> =>  {
        try {
            const { data, error } = await supabase
                .from('users_sessions_joined') 
                .upsert(feedbackList); 
    
            if (error) {
                throw new Error(error.message); 
            }
    
            return data; 
        } catch (error) {
            console.error('Error inserting feedback:', error);
            throw error; 
        }
      },   
    })),
    {
      name: 'session',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
