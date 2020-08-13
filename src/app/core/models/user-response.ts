export interface UserResponse {
    token: {
        expiresIn: number;
        generatedIn: number;
        key: string;
    };
    user: {
        access_group: string,
        activated: number,
        created_at: string,
        id: number,
        image_profile: string,
        login: string,
        social_name: string
    };
}
