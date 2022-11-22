import { Model } from "mongoose";
export declare namespace DocumentTypes {
    interface User extends Types.TimeData, AuthTypes.BasicUser {
        name: string;
        admin: boolean;
        description: string;
        image: string;
        bookmarks: Array<string>;
    }
    interface Token extends Types.TimeData {
        token: string;
    }
    interface Test extends Types.TimeData {
        name: string;
    }
    interface Quiz extends Types.TimeData, QuizTypes.QuizMetadata {
        aid: string;
        questions: string;
        answers: string;
    }
    interface Question extends Types.TimeData, QuizTypes.Qid {
        data: Array<QuizTypes.Question>;
    }
    interface Answer extends Types.TimeData, QuizTypes.Qid {
        data: Array<QuizTypes.Answer>;
    }
    interface Q<T> {
        qId: string;
        data: Array<T>;
    }
}
export declare namespace AuthTypes {
    interface BasicUser {
        email: string;
        password: string;
    }
    interface SignInUser extends AuthTypes.BasicUser {
        name: string;
    }
    interface LogInUser extends AuthTypes.BasicUser {
    }
    type Keys = {
        access: string;
        refresh: string;
    };
    type Tokens = {
        accessToken: string;
        refreshToken: string;
    };
    type DecodedToken = {
        id: string;
        email: string;
    };
}
export declare namespace PropsTypes {
    interface AuthLibraryConstructors {
        keys: AuthTypes.Keys;
        collections: {
            user: Model<DocumentTypes.User>;
            tokens: Model<DocumentTypes.Token>;
        };
    }
}
export declare namespace Types {
    interface TimeData {
        createdAt?: string;
        updatedAt?: string;
    }
}
export declare namespace QuizTypes {
    export interface Sid {
        sid: string;
    }
    export interface Qid {
        qid: string;
    }
    interface Q {
        q: string;
        info?: string;
        options: Array<string>;
    }
    export interface QuizMetadata {
        title: string;
        description: string;
        image: string;
        tags: Array<string>;
    }
    export interface ClientQuestion extends Q {
    }
    export interface Question extends Q, Sid, Qid {
    }
    export interface Answer extends Sid, Qid {
        answer: string;
    }
    export interface Quiz {
        qId: string;
        data: Array<Question>;
    }
    export interface ClientQuiz {
        time: number;
        questions: Question[];
        metadata: QuizMetadata;
        user: {
            name: string;
            email: string;
            aid: string;
        };
    }
    export interface Time {
        m: number | (number | string);
        s: number | (number | string);
    }
    export {};
}
