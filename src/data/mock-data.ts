import { TUser, TQuestion, TAnswer } from "@/models"
import { EUserRole } from "@/enum";

export const mockUsers: TUser[] = [
    { id: 1, username: 'admin', password: 'admin', role: EUserRole.Admin },
    { id: 2, username: 'jon', password: 'jon', role: EUserRole.User },
    { id: 3, username: 'smith', password: 'smith', role: EUserRole.User },
];

export const mockQuestions: TQuestion[] = [
    {
      id: 1,
      question: "Which of the following best describes JavaScript?",
      options: [
        { id: 1, text: "A statically typed, compiled programming language." },
        { id: 2, text: "A dynamically typed, interpreted programming language." },
        { id: 3, text: "A database management system." },
        { id: 4, text: "An operating system." }
      ],
      correctAnswerId: 2
    },
    {
      id: 2,
      question: "What does HTML stand for?",
      options: [
        { id: 1, text: "Hyper Transfer Markup Language" },
        { id: 2, text: "Hyper Text Markup Language" },
        { id: 3, text: "High-level Text Management Language" },
        { id: 4, text: "Hyperlink and Text Markup Language" }
      ],
      correctAnswerId: 2
    },
    {
      id: 3,
      question: "Which CSS property is used to change text color?",
      options: [
        { id: 1, text: "background-color" },
        { id: 2, text: "font-style" },
        { id: 3, text: "text-color" },
        { id: 4, text: "color" }
      ],
      correctAnswerId: 4
    },
    {
      id: 4,
      question: "Which of the following is a JavaScript framework?",
      options: [
        { id: 1, text: "Laravel" },
        { id: 2, text: "Django" },
        { id: 3, text: "React" },
        { id: 4, text: "Flask" }
      ],
      correctAnswerId: 3
    },
    {
      id: 5,
      question: "What does SQL stand for?",
      options: [
        { id: 1, text: "Structured Query Language" },
        { id: 2, text: "System Query List" },
        { id: 3, text: "Standard Question Language" },
        { id: 4, text: "Server Query Language" }
      ],
      correctAnswerId: 1
    }
];

export const mockAnswers: TAnswer[] = [];