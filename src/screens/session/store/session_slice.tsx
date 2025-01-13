import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { Alert } from 'react-native';

export const useSession = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getSession: async (session_id: string): Promise<ISession | null> => {
        try {
          console.log('Fetching sessions for instructor:', session_id);

          const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', session_id)
            .single()
            
          if (sessionError) {
            console.error('Error:', sessionError.message);
            set((state) => {
              state.error = sessionError.message;
            });
            throw new Error(sessionError.message);
          }
          return sessionData as ISession;
        } catch (err) {
          throw new Error(err.message);
        }
      },
      getAllClass: async (instructorId: string): Promise<IClass[] | null> => {
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
        //   console.log('getClass:', classData);
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
      fetchClass: async (class_id: string): Promise<IClass | null> => {
        try {
            const {data, error} = await supabase
            .from('classes')
            .select('id, class_name, level, genre')
            .eq('id', class_id)
            .single()

            if (error) {
                throw new Error(error.message);
            }
            console.log('data class: ', data);
            return data as IClass;
        } catch (err) {
            throw new Error(err.message);
        }        
      },
      fetchJoinedData: async (session_id: string): Promise<IJoin[] | null> => {
        try {
          const {data, error} = await supabase
          .from('users_sessions_joined')
          .select('*')
          .eq('session_id', session_id)

          if (error) {
              throw new Error(error.message);
          }
          console.log('student joined: ', data);
          return data as IJoin[];
        } catch (err) {
            throw new Error(err.message);
        }   
      },
      fetchComments: async (session_id: string): Promise<IComment[] | null> => {
        try {
          const {data: cmtDta, error: cmtError} = await supabase
          .from('comments')
          .select('*')
          .eq('session_id', session_id)

          if (cmtError) {
              throw new Error(cmtError.message);
          }
          console.log('comments from table comments: ', cmtDta);

          const commentsWithUserInfo: IComment[] = [];
          for (const comment of cmtDta) {
              const { data: userData, error: userError } = await supabase
                  .from('users')
                  .select('username, avatar_url')
                  .eq('id', comment.user_id)
                  .single();

              if (userError) {
                  throw new Error(userError.message);
              }
              const commentWithUser: IComment = {
                  ...comment, 
                  username: userData?.username || '', 
                  avatar_url: userData?.avatar_url || '', 
              };
              commentsWithUserInfo.push(commentWithUser);
          }
          console.log('comments with user infor: ', commentsWithUserInfo);

          return commentsWithUserInfo;
        } catch (err) {
            throw new Error(err.message);
        }   
      },
      updateSession: async (
        session_id: string, 
        session_name: string, 
        level: string, 
        genre: string,
        video_url: string,
        thumbnail_url: string,
      ): Promise<ISession | null> => {
        const { data, error } = await supabase
            .from('sessions')
            .update({
              session_name: session_name,
              level: level,
              genre: genre,
              video_url: video_url,
              thumbnail_url: thumbnail_url
            })  
            .eq('id', session_id)
            .single(); 
            
        if (error) {
            console.error("Error adding session:", error);
            Alert.alert('Error adding session: ', error);
            return null;  
        }    
        return data;  
      },    
    })),
    {
      name: 'session',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
