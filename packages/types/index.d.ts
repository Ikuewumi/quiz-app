import { Model } from "mongoose";
import { z } from "zod";
export declare namespace DocumentTypes {
    interface User extends Types.TimeData, AuthTypes.BasicUser, UserTypes.UserMetadata {
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
    interface Time extends Types.TimeData, QuizTypes.Time {
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
        timeToEnd: number;
        mode: Mode;
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
    interface QuizMetadata {
        title: string;
        description: string;
        image: string;
        tags: Array<string>;
        bookmarks?: number;
        showCorrection?: boolean;
        drafted?: boolean;
    }
    interface QMetadata extends Qid, QuizMetadata {
    }
    interface ClientQuestion extends Q {
    }
    interface Question extends Q, Sid, Qid {
    }
    interface Answer extends Sid, Qid {
        answer: string;
    }
    interface Quiz {
        qId: string;
        data: Array<Question>;
    }
    type Mode = "easy" | "medium" | "hard";
    interface ClientQuiz {
        time: number;
        mode?: Mode;
        questions: Question[];
        metadata: QMetadata;
        user: {
            name: string;
            email: string;
            aid: string;
        };
    }
    interface Time {
        m: number | (number | string);
        s: number | (number | string);
    }
    interface ClientAnswer {
        qid: string;
        data: Answer[];
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
