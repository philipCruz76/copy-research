"use client";

import {
  Citation,
  SearchResultInformation,
} from "@/app/lib/types/citations.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/lib/ui/tooltip";
import Link from "next/link";

type SearchResultCitationsProps = {
  index: number;
  source: string;
  searchResultInformation?: SearchResultInformation[] | null;
  citations?: Citation[];
};

const SearchResultCitations = ({
  index,
  source,
  searchResultInformation,
  citations,
}: SearchResultCitationsProps) => {
  if (searchResultInformation) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className=" select-none rounded-[0.3125rem] ml-[5px] text-center min-w-[16px] min-h-[16px]  px-[2px] bg-gray-300 dark:bg-zinc-700/80 hover:bg-cyan-500 dark:hover:bg-violet-500 cursor-pointer">
            <Link
              href={searchResultInformation[index].url}
              target="_blank"
              rel="nofollow noopener"
              className="whitespace-nowrap text-[12px] font-sans dark:text-white flex items-center justify-center"
            >
              {index + 1}
            </Link>
          </TooltipTrigger>
          <TooltipContent className="w-[320px] min-h-[160px] bg-white dark:bg-[#2d2f2f] rounded-lg border shadow-lg flex flex-col gap-2 text-black dark:text-white justify-start items-start p-4">
            <Link
              href={searchResultInformation[index].url}
              target="_blank"
              rel="nofollow noopener"
              className="text-sm  hover:text-cyan-600 w-full  font-bold"
            >
              {searchResultInformation[index].title}
            </Link>
            <span className="text-sm whitespace-pre-wrap font-sans line-clamp-4 italic">
              {citations?.[index].relevantText}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className=" select-none rounded-[0.3125rem] ml-[3px] text-center min-w-[16px] min-h-[16px]  px-[2px] bg-zinc-700/80 hover:bg-violet-500 cursor-pointer">
            <Link
              href={source}
              target="_blank"
              rel="nofollow noopener"
              className="whitespace-nowrap text-[12px] font-sans dark:text-white flex items-center justify-center"
            >
              {index + 1}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs text-textMain dark:text-min-w-[1rem] rounded-[0.3125rem] text-center align-middle font-mono text-[0.6rem] tabular-nums py-[0.1875rem] px-[0.3rem] hover:bg-super dark:hover:text-backgroundDark cursor-pointer hover:text-white border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-offsetPlus">
              {source}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default SearchResultCitations;
