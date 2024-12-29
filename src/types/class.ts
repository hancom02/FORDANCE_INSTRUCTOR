interface IClass {
    id?: string;  
    instructor_id: string;
    instructor_username: string;
    class_name: string;
    level: string;
    genre: string;
    image_cover_url: string;
    what_learn: string;    
    what_prepare: string;
    session_count: number;
    [key: string]: any;
}