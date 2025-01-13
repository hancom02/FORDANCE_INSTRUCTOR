import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useClass = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getClass: async (class_id: string): Promise<IClass | null> => {
        try {
          console.log('Fetching class:', class_id);

          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('*')
            .eq('id', class_id)
            .single()
            
          if (classError) {
            console.error('Error:', classError.message);
            set((state) => {
              state.error = classError.message;
            });
            throw new Error(classError.message);
          }
          return classData as IClass;
        } catch (err) {
          throw new Error(err.message);
        }
      },
      getSessionOfClass: async (class_id: string, user_id: string): Promise<ISession[] | null> => {
        try {
          console.log('Fetching sessions for class:', class_id , 'uuid: ', user_id);

          const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('class_id', class_id)
            // .eq('instructor_id', user_id)
            ;
            
          if (sessionError) {
            console.error('Error:', sessionError.message);
            set((state) => {
              state.error = sessionError.message;
            });
            throw new Error(sessionError.message);
          }
          console.log('sessionData:', sessionData);
          return sessionData as ISession[];
        } catch (err) {
          throw new Error(err.message);
        }
      },
      updateClass: async (class_id: string, user_id: string, classDta: IClass): Promise<IClass | null> => {
        try {
            // Cập nhật dữ liệu cho lớp học
            const { data: classData, error: classError } = await supabase
                .from('classes')
                .update(classDta)
                .eq('id', class_id)
                .eq('instructor_id', user_id); 
    
            if (classError) {
                // Xử lý lỗi nếu có
                console.error('Error updating class:', classError);
                return null;
            }    
            return classData; 
        } catch (error) {
            console.error('Unexpected error:', error);
            throw new Error(err.message);
        }
    },
    })),
    {
      name: 'class',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
