import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';

export const useAddClass = create(
  persist(
    immer((set) => ({
      error: undefined, 
      getEnumLevelValues: async (): Promise<string[] | null> => {
        const { data, error } = await supabase.rpc('get_enum_level_values');
          
          if (error) {
            console.error(error);
          } else {
            console.log('getEnumLevelValues: ', data);
          }
        return data;
      },
      getEnumGenreValues: async (enum_name: string): Promise<string[] | null> => {
        const { data, error } = await supabase.rpc('get_enum_genre_values');
          
          if (error) {
            console.error(error);
          } else {
            console.log('getEnumGenreValues: ', data); 
          }
          return data;
      },
      addClass: async (classData: IClass): Promise<IClass | null> => {
        const { data, error } = await supabase
            .from('classes')
            .insert([classData])  
            .single(); 
            
        if (error) {
            console.error("Error adding session:", error);
            return null;  
        }    
        return data;  
      },
    })),
    {
      name: 'add_session',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
