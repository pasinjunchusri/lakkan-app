export interface IGallery {
    id?: string,
    title?: string,
    privacity: string,
    photo: any,
    address?: any,
    location?: any,
    save?: any
}

export interface IGalleryFollow {
    userId: string;
    galleryId: string;
}