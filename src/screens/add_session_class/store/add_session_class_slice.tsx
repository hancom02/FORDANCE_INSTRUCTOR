import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';

export const useAddSessionClass = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getClass: async (instructorId: string): Promise<IClass[] | null> => {
        try {
          console.log('Fetching sessions for instructor:', instructorId);

          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('id, class_name, level, genre')
            .match({ instructor_id: instructorId });    

          if (classError) {
            console.error('Error:', classError.message);
            set((state) => {
              state.error = classError.message;
            });            
            throw new Error(classError.message);
          }
          console.log('getClass:', classData);
          return classData as IClass[];
        } catch (err) {
          throw new Error(err.message);
        }
      },
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
      addSession: async (session: ISession): Promise<ISession | null> => {
        const { data, error } = await supabase
            .from('sessions')
            .insert([session])  
            .single(); 
            
        if (error) {
            console.error("Error adding session:", error);
            return null;  
        }    
        return data;  
      },    
    })),
    {
      name: 'add_session_class',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
