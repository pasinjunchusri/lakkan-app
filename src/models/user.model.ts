export interface IUser {
    name: string;
    username: string;
    password?: string,
    email: string;
    gender?: string;
    brithday?: any;
    language?: string;
    phone?: number;
    website?: string;
    status?: string;
}

export interface IUserFollow {
    userId: string,
}