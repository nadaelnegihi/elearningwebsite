export declare class CreateQuizDto {
    moduleId: string;
    createdBy: string;
    numQuestions: number;
    questionTypes: 'MCQ' | 'True/False' | 'Both';
    studentId: string;
}
