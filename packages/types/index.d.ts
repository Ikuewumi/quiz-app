import { Model } from "mongoose";
import { z } from "zod";
export declare namespace DocumentTypes {
    interface User extends Types.TimeData, AuthTypes.BasicUser, UserTypes.UserMetadata {
    }
    interface Token extends Types.TimeData {
        token: string;
    }
    interface History extends Types.TimeData, HistoryTypes.History {
    }
    interface Tag extends Types.TimeData, TagTypes.Tag {
    }
    interface Test extends Types.TimeData {
        name: string;
    }
    interface Quiz extends Types.TimeData, QuizTypes.fullQuiz {
    }
    interface Question extends Types.TimeData {
        data: Array<QuizTypes.Question>;
    }
    interface Answer extends Types.TimeData {
        data: Array<QuizTypes.Answer>;
    }
    interface Q<T> {
        qId: string;
        data: Array<T>;
    }
}
export declare namespace UserTypes {
    interface UserMetadata extends Types.TimeData {
        name: string;
        email: string;
        admin: boolean;
        description: string;
        image: string;
        bookmarks: Array<string>;
    }
    interface ClientUserMetadata {
        name: string;
        email: string;
        admin: boolean;
        description: string;
        image: string;
        bookmarks: Array<string>;
        _id: string;
        id: string;
    }
}
export declare namespace MessageTypes {
    interface Msg {
        message: string;
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
        id?: string;
        _id?: string;
    }
}
export declare namespace QuizTypes {
    interface Time {
        m?: number;
        s?: number;
    }
    interface Sid {
        sid: string;
    }
    interface Qid {
        qid: string;
    }
    interface Q {
        q: string;
        info?: string;
        options: Array<string>;
        image?: string;
    }
    interface Question extends Sid, Q {
    }
    interface Answer extends Sid {
        answer: string;
    }
    interface QuizMetadata {
        title: string;
        description: string;
        image: string;
        tags: Array<string>;
        bookmarks?: number;
        showCorrection?: boolean;
        drafted?: boolean;
    }
    type Mode = 'easy' | 'medium' | 'hard';
    interface fullQuiz extends QuizMetadata {
        aid: string;
        questions: Question[];
        answers: Answer[];
    }
    interface ScoreData {
        score: number;
        total: number;
    }
    interface MarkedQuiz {
        scoreData: ScoreData;
        quizDoc: DocumentTypes.Quiz;
    }
}
export declare namespace HistoryTypes {
    interface History {
        aid: string;
        qid: string;
        data: QuizTypes.ScoreData;
        title: string;
        timestamp: number;
        uid: string;
    }
}
export declare namespace TagTypes {
    interface Tag {
        tags: Array<string>;
    }
}
export declare namespace ApiTypes {
    interface PaginatedData<T> {
        data: T[];
        count: number;
        page: number;
        maxPageCount: number;
        pageCount: number;
    }
}
export declare namespace ZodTypes {
    const zUserMetadata: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        image: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        image?: string;
        description?: string;
    }, {
        name?: string;
        image?: string;
        description?: string;
    }>;
}
