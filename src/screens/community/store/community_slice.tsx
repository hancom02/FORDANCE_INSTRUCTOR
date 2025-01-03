import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useComment = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getComment: async (session_id: string): Promise<IComment[] | null> => {
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
                // console.log('userData: ', userData);
  
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
      addComment: async (comment: ICommentDta): Promise<ICommentDta | null> => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert(
                    comment
                )
                .single();
            
            if (error) {
                console.error("Error adding comment:", error);
                return null;  
            }    
            return data;  
        } catch (err) {
            throw new Error(err.message);
        }
      },
    })),
    {
      name: 'comment',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
