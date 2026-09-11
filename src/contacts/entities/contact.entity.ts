export class Contact {
    id: string | undefined;
    name: string | undefined;
    email: string  | undefined;
    phone: string | undefined;
    notes?: string  | undefined;
    createdAt: Date | undefined;
    ownerId: string | undefined;
}