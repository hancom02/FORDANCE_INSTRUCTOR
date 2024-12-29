import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import { decode } from 'base64-arraybuffer'

const supabaseUrl = 'https://dkasnzwgahkgoczktpfe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXNuendnYWhrZ29jemt0cGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjEzMDMsImV4cCI6MjA0NjczNzMwM30.qzoF0VafeuIavRmpTsxzAzZvY7C-vZccexQ4b1MUIKI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const uploadFile = async (folder: string, file: File) => {
    const { data, error } = await supabase.storage
        .from(folder)
        .upload(file.name, decode('base64FileData'), {
        })

        // const avatarFile = event.target.files[0]
        // const { data, error } = await supabase
        //   .storage
        //   .from('avatars')
        //   .upload('public/avatar1.png', avatarFile, {
        //     cacheControl: '3600',
        //     upsert: false
        //   })


    if (error) {
        throw error;
    }

    return data;
};

const getFileUrl = async (folder: string, fileName: string) => {
    // const { publicURL, error } = supabase.storage
    //     .from(folder)
    //     .getPublicUrl(fileName);

    // if (error) {
    //     throw error;
    // }

    // return publicURL;
};

export const uploadImage = async (file: File) => {
    return await uploadFile('images', file);
};

export const uploadVideo = async (file: File) => {
    return await uploadFile('videos', file);
};

export const getImageUrl = async (fileName: string) => {
    return await getFileUrl('images', fileName);
};

export const getVideoUrl = async (fileName: string) => {
    return await getFileUrl('videos', fileName);
};