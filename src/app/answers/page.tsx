"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context";
import { EUserRole } from "@/enum";
import { TAnswer, TAnswerHistory, TQuestion } from "@/models";
import { PowerIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function AnswerModule() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [answers, setAnswers] = useState<TAnswerHistory[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number | null>
  >({});
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    if (user?.role !== EUserRole.User) router.push("/");
  }, [user, router]);

  useEffect(() => {
    setQuestions(JSON.parse(localStorage.getItem("questions") ?? "[]"));
    setAnswers(JSON.parse(localStorage.getItem("answers") ?? "[]"));
  }, []);

  const saveAnswersToLocalStorage = (updatedAnswers: TAnswerHistory[]) => {
    setAnswers(updatedAnswers);
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));
  };

  const submitAnswer = (questionId: number) => {
    const selectedOptionId = selectedAnswers[questionId];
    if (selectedOptionId == null) return;

    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedOptionId === question.correctAnswerId;
    const updatedAnswers = [...answers];
    const existingAnswer = updatedAnswers.find(
      (ans) => ans.questionId === questionId
    );
    const newAnswer: TAnswer = {
      timestamp: Date.now(),
      selectedOptionId,
      isCorrect,
      userId: user?.id ?? 0,
      userName: user?.username ?? "Unknown",
    };

    if (existingAnswer) {
      existingAnswer.answers.push(newAnswer);
    } else {
      updatedAnswers.push({ questionId, answers: [newAnswer] });
    }
    saveAnswersToLocalStorage(updatedAnswers);
    setSubmittedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  const editAnswer = (questionId: number) => {
    setSubmittedAnswers((prev) => ({ ...prev, [questionId]: false }));
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
        </header>
        <div className="p-4 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Questions Answer</h2>

          {!questions.length && (
            <p className="text-left ">No questions available</p>
          )}
          {questions.toReversed().map((q) => (
            <Card key={q.id} className="border p-2 mb-2 gap-2">
              <CardContent>
                <p className="font-semibold text-xl mb-1">
                  Question: {q.question}
                </p>
                <ul>
                  {q.options.map((opt) => (
                    <li key={opt.id}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAnswers[q.id] === opt.id}
                          onChange={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt.id,
                            }))
                          }
                          disabled={submittedAnswers[q.id]}
                        />
                        <span className="ml-2">{opt.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {!submittedAnswers[q.id] ? (
                  <Button
                    variant="default"
                    className="mt-2 cursor-pointer"
                    onClick={() => submitAnswer(q.id)}
                  >
                    Submit
                  </Button>
                ) : (
                  <>
                    <p
                      className={`${
                        answers
                          .find((ans) => ans.questionId === q.id)
                          ?.answers.slice(-1)[0]?.isCorrect
                          ? "text-green-500"
                          : "text-red-500"
                      } py-2`}
                    >
                      {answers
                        .find((ans) => ans.questionId === q.id)
                        ?.answers.slice(-1)[0]?.isCorrect
                        ? "Correct Answer"
                        : "Wrong Answer"}
                    </p>
                    <Button
                      variant="default"
                      className="bg-yellow-500 hover:bg-yellow-500 cursor-pointer"
                      onClick={() => editAnswer(q.id)}
                    >
                      Edit Answer
                    </Button>
                  </>
                )}
                <h3 className="text-sm mt-2">Answer History:</h3>
                <ul>
                  {answers
                    .find((ans) => ans.questionId === q.id)
                    ?.answers.filter((ans) => ans.userId === user?.id)
                    .toReversed()
                    .map((ans) => (
                      <li key={ans.timestamp} className="text-gray-500 text-xs">
                        {new Date(ans.timestamp).toLocaleString()} - Option{" "}
                        {ans.selectedOptionId} -
                        {ans.isCorrect ? (
                          <span className="text-green-500">Correct</span>
                        ) : (
                          <span className="text-red-500">Incorrect</span>
                        )}
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
