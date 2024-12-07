import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
export declare class ChatMessage {
    sender: mongoose.Schema.Types.ObjectId;
    receiver: mongoose.Schema.Types.ObjectId;
    content: string;
    timestamp: Date;
    chatRoomId: mongoose.Schema.Types.ObjectId;
    isActive: boolean;
    isGroupChat: boolean;
    groupName?: string;
    participants?: mongoose.Types.ObjectId[];
}
export type ChatMessageDocument = HydratedDocument<ChatMessage>;
export declare const ChatMessageSchema: mongoose.Schema<ChatMessage, mongoose.Model<ChatMessage, any, any, any, mongoose.Document<unknown, any, ChatMessage> & ChatMessage & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ChatMessage, mongoose.Document<unknown, {}, mongoose.FlatRecord<ChatMessage>> & mongoose.FlatRecord<ChatMessage> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
