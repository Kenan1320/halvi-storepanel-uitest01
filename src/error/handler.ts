import { AppError } from "./app-error";
import { toast } from "react-toastify";

export function HandleError(
  error: AppError | any,
  showPopup: boolean = true
): any {
  switch (error.status) {
    case 400:
      if (error?.data) {
        console.log("error.data", typeof error.data.message === "string");
        if (typeof error.data.message === "string") {
          toast.error(error.data.message);
        } else {
          const errorsArray = [];
          const errors = new BadRequestException(error.data.message);
          const parsedErrors = errors.getParsed();
          for (const error in parsedErrors) {
            errorsArray.push(errors.getError(error));
          }
          if (showPopup) {
            toast.error(errorsArray.join("\n"));
          }
        }
      } else {
        toast.error("Unknown error occurred");
        return {
          errors: ["Unknown error."],
          fieldErrors: [],
        };
      }
      break;
    case 401:
      toast.error("Unauthorized access. Please login again.");
      break;
    default:
      if (showPopup) {
        toast.error(error?.data?.message ?? "An error has occurred.");
      }
      return {
        errors: [error?.data?.message ?? "Unknown error occurred."],
        data: error?.data,
        fieldsErrors: [],
      };
  }
}

export function showError(error:any){
  toast.error(error?.message ?? "An error has occurred.");
}

export class BadRequestException extends Error {
  data?: { property?: string; message: string[] }[];
  constructor(responseData: any, message: string = "Bad request") {
    super(message);
    this.data = responseData;
  }

  getError(fieldName: string): string {
    const error = this.data?.find((e) => e.property === fieldName);
    return error?.message?.join(", ") || "";
  }

  getParsed(): { [key: string]: string } {
    const parsed: { [key: string]: string } = {};
    this.data?.forEach((e) => {
      parsed[e.property || ""] = e.message.join(", ");
    });
    return parsed;
  }
}
