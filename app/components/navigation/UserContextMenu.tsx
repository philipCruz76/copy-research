"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/lib/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "@/app/components/SvgIcon";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

type UserContextMenuProps = {
  userSession: Session;
  isCollapsed: boolean;
};

const UserContextMenu = ({
  userSession,
  isCollapsed,
}: UserContextMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex focus:outline-none items-center gap-2 group cursor-pointer justify-start w-full">
        <Image
          src={userSession.user?.image || "/icons/user-icon.svg"}
          alt=""
          width={28}
          height={28}
          className="rounded-full focus:ring-0 cursor-pointer min-w-[32px] min-h-[32px] text-black group-hover:opacity-80 group-hover:scale-105 transition-all duration-100"
        />
        {!isCollapsed && (
          <span className="text-sm font-medium text-black dark:text-white transition-colors duration-100">
            {userSession.user?.name}
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-black dark:text-white ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[190px]  scrollbar-thin">
        <DropdownMenuLabel>{userSession.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/account" className="flex flex-row gap-2 w-full">
            <SvgIcon
              src="/icons/user-icon.svg"
              alt="Account"
              width={16}
              height={16}
            />
            <span className="text-sm">Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <SvgIcon
            src="/icons/billing.svg"
            alt="Billing"
            width={16}
            height={16}
          />
          <span className="text-sm">Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => signOut({ redirectTo: "/" })}
          className="cursor-pointer"
        >
          <SvgIcon
            src="/icons/sign-out.svg"
            alt="Sign Out"
            width={16}
            height={16}
          />
          <span className="text-sm">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserContextMenu;
