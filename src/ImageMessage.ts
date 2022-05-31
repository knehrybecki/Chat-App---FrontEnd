import { TextMessage } from "./types";

// export type ImageMessage = {
//     result: string,
//     clientId: string,
//     message?: never
// }

export interface ImageMessage extends TextMessage {
    result: string;

}
