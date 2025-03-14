"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context";
import { TAnswer, TAnswerHistory, TOption, TQuestion } from "@/models";
import { EUserRole } from "@/enum";
import { mockQuestions } from "@/data";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { AddEditQuestion } from "./add-edit-question.component";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  PowerIcon,
  Trash,
  User,
} from "lucide-react";

export default function AdminQuestions() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newOptions, setNewOptions] = useState<TOption[]>(
    Array(4)
      .fill(null)
      .map((_, i) => ({ id: i + 1, text: "" }))
  );
  const [correctAnswerId, setCorrectAnswerId] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<TAnswerHistory[]>([]);
  const [viewingAnswers, setViewingAnswers] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role !== EUserRole.Admin) router.push("/");
  }, [user, router]);

  useEffect(() => {
    const storedQuestions = JSON.parse(
      localStorage.getItem("questions") ?? "[]"
    );
    const storedAnswers = JSON.parse(localStorage.getItem("answers") ?? "[]");

    if (storedQuestions.length === 0) {
      localStorage.setItem("questions", JSON.stringify(mockQuestions));
      setQuestions(mockQuestions);
    }
    setQuestions(storedQuestions);
    setAnswers(storedAnswers);
  }, []);

  const saveToLocalStorage = (updatedQuestions: TQuestion[]) => {
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
  };

  const addOrUpdateQuestion = () => {
    if (!newQuestion.trim() || newOptions.some((opt) => !opt.text.trim()))
      return;

    const updatedQuestions = editingId
      ? questions.map((q) =>
          q.id === editingId
            ? {
                ...q,
                question: newQuestion,
                options: newOptions,
                correctAnswerId,
              }
            : q
        )
      : [
          ...questions,
          {
            id: Date.now(),
            question: newQuestion,
            options: newOptions,
            correctAnswerId,
          },
        ];

    saveToLocalStorage(updatedQuestions);
    setEditingId(null);
    resetForm();
  };

  const deleteQuestion = (id: number) =>
    saveToLocalStorage(questions.filter((q) => q.id !== id));

  const editQuestion = (question: TQuestion) => {
    setEditingId(question.id);
    setNewQuestion(question.question);
    setNewOptions(question.options);
    setCorrectAnswerId(question.correctAnswerId);
  };

  const resetForm = () => {
    setNewQuestion("");
    setNewOptions(
      Array(4)
        .fill(null)
        .map((_, i) => ({ id: i + 1, text: "" }))
    );
    setCorrectAnswerId(1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-end">
          <p className="capitalize flex">
            <User /> {user?.username}{" "}
          </p>
          <Button
            onClick={() => logout()}
            variant="link"
            className="cursor-pointer"
          >
            <PowerIcon /> Logout
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="p-4 w-full max-w-4xl mx-auto">
            <Dialog>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-4">Manage Questions</h2>
                <DialogTrigger asChild onClick={() => resetForm()}>
                  <Button variant="default" className="cursor-pointer">
                    Add Question
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent className="sm:max-w-[625px] p-7">
                <AddEditQuestion
                  newQuestion={newQuestion}
                  setNewQuestion={setNewQuestion}
                  newOptions={newOptions}
                  setNewOptions={setNewOptions}
                  correctAnswerId={correctAnswerId}
                  setCorrectAnswerId={setCorrectAnswerId}
                  editingId={editingId}
                  addOrUpdateQuestion={addOrUpdateQuestion}
                />
              </DialogContent>

              {questions?.toReversed().map((q) => (
                <Card
                  key={q.id}
                  className="border p-2 mb-2 flex justify-between items-center gap-2"
                >
                  <CardContent className="w-full flex justify-between items-center gap-2">
                    <div>
                      <p className="font-semibold text-xl mb-1">
                        Question: {q.question}
                      </p>
                      <ul>
                        {q.options.map((opt, index) => (
                          <li
                            key={opt.id}
                            className={
                              opt.id === q.correctAnswerId
                                ? "text-green-600"
                                : ""
                            }
                          >
                            {index + 1}. {opt.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => editQuestion(q)}
                          className="bg-yellow-500 text-white p-2 rounded-lg mr-2 cursor-pointer"
                        >
                          <Edit size={20} />
                        </button>
                      </DialogTrigger>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="bg-red-500 text-white p-2 rounded-lg cursor-pointer"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </CardContent>

                  <Button
                    variant="link"
                    className="justify-start cursor-pointer underline"
                    onClick={() =>
                      setViewingAnswers(viewingAnswers === q.id ? null : q.id)
                    }
                  >
                    {viewingAnswers === q.id ? (
                      <>
                        Hide Answers <ChevronUp />
                      </>
                    ) : (
                      <>
                        View Answers <ChevronDown />
                      </>
                    )}
                  </Button>
                  {viewingAnswers === q.id && (
                    <div className="mt-2 p-2 bg-gray-100 rounded w-full">
                      <h3 className="text-sm font-semibold">
                        User Answer History:
                      </h3>
                      {(() => {
                        const questionAnswers =
                          answers.find((ans) => ans.questionId === q.id)
                            ?.answers || [];
                        const groupedAnswers = questionAnswers.reduce(
                          (acc, ans) => {
                            if (!acc[ans.userId]) acc[ans.userId] = [];
                            acc[ans.userId].push(ans);
                            return acc;
                          },
                          {} as Record<number, TAnswer[]>
                        );

                        return Object.keys(groupedAnswers).length > 0 ? (
                          <ul>
                            {Object.entries(groupedAnswers).map(
                              ([userId, userAnswers]) => (
                                <li key={userId} className="mb-2">
                                  <p className="font-semibold text-blue-600">
                                    Answer By -{" "}
                                    {userAnswers[0].userName || userId}:
                                  </p>
                                  <ul className="ml-4">
                                    {userAnswers.toReversed().map((ans) => (
                                      <li
                                        key={ans.timestamp}
                                        className="text-gray-500 text-xs"
                                      >
                                        {new Date(
                                          ans.timestamp
                                        ).toLocaleString()}{" "}
                                        - Selected Option:{" "}
                                        {ans.selectedOptionId}{" "}
                                        {ans.isCorrect ? (
                                          <span className="text-green-500">
                                            Correct
                                          </span>
                                        ) : (
                                          <span className="text-red-500">
                                            Incorrect
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-500">
                            No answers yet.
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </Card>
              ))}
            </Dialog>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
