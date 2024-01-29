import {
  HomeIcon,
  PersonIcon,
  BookmarkFilledIcon,
  CalendarIcon,
  FileIcon,
  PieChartIcon,
  CardStackPlusIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store/store";

const secondaryNavigation = [
  { name: "Website redesign", href: "#", initial: "W", current: false },
  { name: "GraphQL API", href: "#", initial: "G", current: false },
  {
    name: "Customer migration guides",
    href: "#",
    initial: "C",
    current: false,
  },
  { name: "Profit sharing program", href: "#", initial: "P", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Navigation = {
  name: string;
  href: string;
  icon: any;
  count?: string;
  current: boolean;
  avatar?: string;
};

interface NavProps {
  navigation: Navigation[];
}

const MinimizedNavigation: React.FC<NavProps> = ({ navigation }) => {
  return (
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      <li>
        <ul role="list" className="-mx-2 space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-100 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600",
                  "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                )}
              >
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={`${item.name}'s avatar`}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
                      "h-6 w-6 shrink-0",
                    )}
                    aria-hidden="true"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

const Navigation = () => {
  const { userDetails } = useSelector((state: RootState) => state.auth);

  console.log(userDetails);

  const navigation = [
    {
      name: "Profile",
      href: "/profile",
      icon: PersonIcon,
      current: false,
      avatar: userDetails?.avatarUrl,
    },
    { name: "Dashboard", href: "/", icon: HomeIcon, count: "5", current: true },
    {
      name: "Journal",
      href: "/journal",
      icon: CardStackPlusIcon,
      current: false,
    },
    {
      name: "To Do",
      href: "/todo",
      icon: FileTextIcon,
      current: false,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: BookmarkFilledIcon,
      count: "12",
      current: false,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
      count: "20+",
      current: false,
    },
    { name: "Documents", href: "/documents", icon: FileIcon, current: false },
    { name: "Reports", href: "#", icon: PieChartIcon, current: false },
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimeoutRef = useRef<number | null>(null);

  const expandNavigation = () => {
    if (collapseTimeoutRef.current !== null) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const collapseNavigation = () => {
    collapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300) as unknown as number; // Cast the return value to number
  };

  return (
    <nav
      className={`flex ${isExpanded ? "max-w-xs" : "max-w-7"} flex-1 flex-col`}
      aria-label="Sidebar"
      onMouseEnter={expandNavigation}
      onMouseLeave={collapseNavigation}
    >
      {isExpanded ? (
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                    {item.count ? (
                      <span
                        className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-50 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                        aria-hidden="true"
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Projects
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                    )}
                  >
                    <span
                      className={classNames(
                        item.current
                          ? "border-indigo-600 text-indigo-600"
                          : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                      )}
                    >
                      {item.initial}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      ) : (
        <MinimizedNavigation navigation={navigation} />
      )}
    </nav>
  );
};

export default Navigation;
