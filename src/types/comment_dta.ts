interface ICommentDta {
    id?: string;
    user_id: string;
    session_id: string;
    created_at: string;
    content: string
    img_url: string;
    video_url: string;
    parent_comment_id?: string;
}