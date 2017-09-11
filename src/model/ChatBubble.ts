export interface ChatBubbleInterface {
    position?: string;
    uid?: string;
    img?: string;
    content?: string;
    senderName?: string;
    time?: string;
}

export class ChatBubble implements ChatBubbleInterface {
    position?: string;
    uid?: string;
    img?: string;
    content?: string;
    senderName?: string;
    time?: string;

    constructor(){

    }
}