import { useState } from "react";

interface AccordianCommonProps {
  children: any;
  name: string;
  className?: string;
  shouldExpand?: boolean;
}

export const AccordianCommon = (props: AccordianCommonProps) => {
  const { children, name, shouldExpand = false } = props;

  const [expanded, setExpanded] = useState<boolean>(shouldExpand);

  return (
    <>
      <div>
        <div className="rounded mb-2 border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
          <h2 className="mb-0">
            <button
              className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white"
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {name}
              <span
                className={`ml-auto h-5 w-5 shrink-0 ${
                  expanded ? "" : "rotate-[-180deg]"
                } fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
          </h2>
          <div className={`${expanded ? "visible" : "hidden"}`}>
            <div className="px-5 py-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};
