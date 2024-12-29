interface ISession {
    id?: string;  
    instructor_id: string;
    class_id: string;
    session_name: string;          
    video_url: string;
    created_at: string;    
    level: string;
    genre: string;
    thumbnail_url: string;
    duration: string;
    price: string;
    status: string;
    // expires_at: string;    
    [key: string]: any;    
  }
