import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useProfile = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getProfile: async (uuid: string): Promise<IInstructor | null> => {
        try {
            const {data, error} = await supabase
            .from('users')
            .select('*')
            .eq('id', uuid)
            .single()

            if (error) {
                throw new Error(error.message);
            }
            console.log('Profile infor: ', data);  
            return data;
        } catch (err) {
            throw new Error(err.message);
        }
      },
      updateProfile: async (
        uuid: string, 
        name: string, 
        avatar_url: string, 
        prize: string, 
        introduce: string,
        ): Promise<IInstructor | null> =>  {
        try {
            const {data, error} = await supabase
            .from('users')
            .update({
                name,           
                avatar_url,     
                prize,          
                introduce,
            })
            .eq('id', uuid)

            if (error) {
                throw new Error(error.message);
            }
            console.log('Profile infor: ', data);  
            return data;
        } catch (err) {
            throw new Error(err.message);
        }
      },
    })),
    {
      name: 'profile',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
