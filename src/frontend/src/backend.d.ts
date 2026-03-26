import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Contact {
    id: bigint;
    owner: Principal;
    name: string;
    category: ContactCategory;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface MeetingNote {
    id: bigint;
    date: string;
    summary: string;
    contactId: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum ContactCategory {
    other = "other",
    personal = "personal",
    professional = "professional",
    natural = "natural"
}
export interface backendInterface {
    createContact(name: string, category: ContactCategory): Promise<bigint>;
    createMeetingNote(contactId: bigint, date: string, summary: string): Promise<bigint>;
    getContactsByUser(owner: Principal): Promise<Array<Contact>>;
    getContactsByUserAndCategory(owner: Principal, category: ContactCategory): Promise<Array<Contact>>;
    getMeetingNotesByContact(contactId: bigint): Promise<Array<MeetingNote>>;
    login(name: string): Promise<void>;
    summarizeText(text: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateMeetingNote(id: bigint, summary: string): Promise<void>;
}
