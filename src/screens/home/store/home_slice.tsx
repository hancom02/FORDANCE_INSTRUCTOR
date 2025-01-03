import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useInstructorData = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getClassByInstructor: async (instructorId: string): Promise<IClass[] | null> => {
        try {
          console.log('Fetching sessions for instructor:', instructorId);

          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('*')
            .match({ instructor_id: instructorId });      
          if (classError) {
            console.error('Error:', classError.message);
            set((state) => {
              state.error = classError.message;
            });            
            throw new Error(classError.message);
          }
          return classData as Class[];
        } catch (err) {
          throw new Error(err.message);
        }
      },
      getSessionByInstructor: async (instrutorId: string): Promise<ISession[] | null> => {
        try {
          console.log('Fetching sessions for instructor:', instrutorId);

          const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('instructor_id', instrutorId)
            .neq('status', EStatus.Deleted)
            .neq('status', EStatus.Rejected);
            
          if (sessionError) {
            console.error('Error:', sessionError.message);
            set((state) => {
              state.error = sessionError.message;
            });
            throw new Error(sessionError.message);
          }
          return sessionData as ISession[];
        } catch (err) {
          throw new Error(err.message);
        }
      },
    })),
    {
      name: 'instructor-data',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
