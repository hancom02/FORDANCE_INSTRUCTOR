import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkasnzwgahkgoczktpfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXNuendnYWhrZ29jemt0cGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjEzMDMsImV4cCI6MjA0NjczNzMwM30.qzoF0VafeuIavRmpTsxzAzZvY7C-vZccexQ4b1MUIKI';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const uploadFile = async (folder: string, file: File) => {
    const { data, error } = await supabase.storage
        .from(folder)
        .upload(file.name, file);

    if (error) {
        throw error;
    }

    return data;
};

const getFileUrl = async (folder: string, fileName: string) => {
    const { publicURL, error } = supabase.storage
        .from(folder)
        .getPublicUrl(fileName);

    if (error) {
        throw error;
    }

    return publicURL;
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