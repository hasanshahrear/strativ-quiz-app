import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOption } from "@/models";
import { Label } from "@radix-ui/react-label";

type TProps = {
  newQuestion: string;
  setNewQuestion: (value: string) => void;
  newOptions: TOption[];
  setNewOptions: (value: TOption[]) => void;
  correctAnswerId: number;
  setCorrectAnswerId: (value: number) => void;
  editingId: number | null;
  addOrUpdateQuestion: () => void;
};

export function AddEditQuestion({
  newQuestion,
  setNewQuestion,
  newOptions,
  setNewOptions,
  correctAnswerId,
  setCorrectAnswerId,
  editingId,
  addOrUpdateQuestion,
}: Readonly<TProps>) {
  return (
    <div className="mb-4">
      <div className="flex w-full gap-2 flex-col">
        <Label htmlFor="question" className="font-medium">
          Question
        </Label>
        <Input
          type="text"
          id="question"
          className="border p-2 w-full mb-2 h-10"
          placeholder="Enter question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
      </div>
      {newOptions.map((option, index) => (
        <div key={option.id} className="flex w-full gap-2 flex-col">
          <Label htmlFor={`${index + 1}`} className="font-medium">{`Option ${
            index + 1
          }`}</Label>
          <Input
            id={`${index + 1}`}
            type="text"
            className="border p-2 w-full mb-2"
            placeholder={`Option ${index + 1}`}
            value={option.text}
            onChange={(e) => {
              const updatedOptions = [...newOptions];
              updatedOptions[index].text = e.target.value;
              setNewOptions(updatedOptions);
            }}
          />
        </div>
      ))}
      <div className="flex w-full gap-2 flex-col mb-4">
        <Label htmlFor="ca" className="font-medium">
          Correct Answer
        </Label>
        <Select
          value={String(correctAnswerId)}
          onValueChange={(e) => setCorrectAnswerId(Number(e))}
        >
          <SelectTrigger className="w-full !h-10">
            <SelectValue placeholder="Select an answer" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Correct Answer</SelectLabel>
              {newOptions.map((option, index) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  Correct Answer: Option {index + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DialogClose asChild>
        <Button
          onClick={() => {
            addOrUpdateQuestion();
          }}
          className="w-full cursor-pointer"
          variant="default"
        >
          {editingId ? "Update Question" : "Add Question"}
        </Button>
      </DialogClose>
    </div>
  );
}
