export interface IChatMessage {
    id?: string,
    channelId: string,
    message: string;
    user: string;
    image?: any;
    sound?: any;
    file?: any;
    location?: any;
    url?: any;
    save?: any;
}


export interface IChatMessageCache {
    _id: string;
    message: string;
    user: any;
    channel: string;
    createdAt: any;
}