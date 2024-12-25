"use client";
import questions from "@/public/questions.json";
import QuestionBox from "@/components/ui/questionBox";
import { preferenceSchema } from "@/src/validationSchemas/preferenceSchema";
import { ValidationError } from "yup";
import { useState, useRef, useEffect } from "react";
import { InView } from "react-intersection-observer";
import { updateUserPreference } from "@/src/controllers/UserController";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import PreferenceAlertDialog from "@/components/ui/PreferenceAlertDialog";

export default function Page() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [questionBoxMargin, setQuestionBoxMargin] = useState<number>(0);
  const [visibleSection, setVisibleSection] = useState(
    questions[0].id.toString()
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  const setInView = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      const id = entry.target.getAttribute("id");
      if (id) {
        setVisibleSection(id);
      }
    }
  };

  const onClickLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (scrollableContainerRef.current) {
      const container = scrollableContainerRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };
  const onClickRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (scrollableContainerRef.current) {
      const container = scrollableContainerRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const updatePadding = () => {
      if (scrollableContainerRef.current) {
        const containerWidth = scrollableContainerRef.current.clientWidth;
        setQuestionBoxMargin((containerWidth - 700) / 2);
      }
    };
    updatePadding();
    window.addEventListener("resize", updatePadding);

    return () => {
      window.removeEventListener("resize", updatePadding);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setErrors({});
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string | string[] } = {};

    formData.forEach((value, key) => {
      if (formValues[key]) {
        if (Array.isArray(formValues[key])) {
          formValues[key].push(value as string);
        } else {
          formValues[key] = [formValues[key] as string, value as string];
        }
      } else {
        formValues[key] = value instanceof File ? value.name : value;
      }
    });

    try {
      const result = await preferenceSchema.validate(formValues, {
        abortEarly: false,
      });
      setOpenDialog(true);
      await updateUserPreference(result);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors = error.inner.reduce(
          (acc: { [key: string]: string }, curr) => {
            acc[curr.path || "unknown"] = curr.message;
            return acc;
          },
          {}
        );
        setErrors(newErrors);
        if (Object.keys(newErrors)) {
          const firstErrorId = Object.keys(newErrors)[0];
          const element = document.getElementById(firstErrorId);
          if (element) {
            if (scrollableContainerRef.current) {
              scrollableContainerRef.current.style.scrollSnapType = "none";
            }

            element.scrollIntoView({ behavior: "smooth", inline: "center" });
            
            setTimeout(() => {
              if (scrollableContainerRef.current) {
                scrollableContainerRef.current.style.scrollSnapType = "";
              }
            }, 1000);
          }
        }
      }
    }
  };

  return (
    <div className="max-w-[1200px] flex flex-col justify-center h-screen px-[16px] md:mx-auto md:p-0">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4">
          <div
            ref={scrollableContainerRef}
            className="w-full overflow-hidden flex flex-row snap-x snap-mandatory"
          >
            {questions.map((q) => (
              <InView onChange={setInView} threshold={0.5} key={q.id}>
                {({ ref }) => {
                  return (
                    <QuestionBox
                      ref={ref}
                      id={q.id.toString()}
                      className="max-w-[700px] w-full snap-center mx-4"
                      question={q}
                      errors={errors}
                      style={{
                        marginLeft:
                          questionBoxMargin >= 0 ? questionBoxMargin : "1em",
                        marginRight:
                          questionBoxMargin >= 0 ? questionBoxMargin : "1em",
                      }}
                    />
                  );
                }}
              </InView>
            ))}
          </div>
          <div className="w-full flex justify-end  max-w-[700px] gap-4">
            <button
              className="px-4 py-2 border-2 border-black rounded-md"
              onClick={onClickLeft}
            >
              previous
            </button>
            {visibleSection === questions.length.toString() ? (
              <button
                type="submit"
                className="px-4 py-2 border-2 border-black rounded-md"
              >
                Submit
              </button>
            ) : (
              <button
                className="px-4 py-2 border-2 border-black rounded-md"
                onClick={onClickRight}
              >
                next
              </button>
            )}
            <PreferenceAlertDialog open={openDialog} submitted={submitted} />
          </div>
        </div>
      </form>

      <span>{`${visibleSection} / ${questions.length}`}</span>
    </div>
  );
}
