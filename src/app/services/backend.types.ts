export type postType = {
    SK: string;
    created_at: number;
    photo_key: string;
    text: string;
    user: { username_original: string, photo_key: string };
}

export type getAllPostResponse = {
    LastEvaluatedKey: {
        PK: { S: string },
        SK: { S: string },
        created_at: { S: string }
    };
    Items: postType[];
};

export type commentType = {
    SK: string;
    created_at: number;
    text: string;
    user: { username_original: string, photo_key: string };
}

export type getAllCommentsResponse = {
    LastEvaluatedKey: any;
    Items: commentType[];
}

export type checkResponse = {
    iat: number;
    username: string;
}

export type profileResponse = {
    user: {
        username_original: string;
        created_at: number;
        photo_key: string;
    }
}

export type registerResponse = {
    token: string
}

export type createPostResponse = {
    post_uuid: string
}