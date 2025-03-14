"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { catA, catB, dietary } from "@/src/categories";
import Link from "next/link";
export default function Navlinks() {
  const path = usePathname();
  const startsWith = path.split("/")[1];

  return (
    <NavigationMenu.Root className="hidden sm:flex flex-col max-w-[1200px] m-auto h-[50px] justify-center px-[30px]">
      <NavigationMenu.List className="flex gap-2 items-center">
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={clsx([
              "block py-2 px-4 rounded-lg text-sm hover:underline decoration-[#ff8a00] decoration-2 underline-offset-2 font-semibold tracking-widest",
              { "underline pointer-events-none": path === "/" },
            ])}
            href="/"
          >
            HOME
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="h-fit py-2 px-4 rounded-lg data-[state=open]:underline decoration-[#ff8a00] underline-offset-2 decoration-2 text-sm font-semibold">
            CATEGORY
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="bg-orange-100 w-auto p-2">
            <table className="table-fixed border-collapse w-full max-w-[1200px] m-auto">
              <tbody>
                {catA.map((cat, idx) => {
                  if (idx < catA.length - 5) {
                    return (
                      <tr
                        key={`catA-${idx}`}
                        className="*:whitespace-nowrap *:pr-2 *:py-1 *:pl-[25px]"
                      >
                        <td>
                          {idx < 5 && (
                            <Link
                              href={`/category?catA=${cat}`}
                              className="hover:font-bold hover:text-[#ff8a00]"
                            >
                              {cat.replace("_", " ")}
                            </Link>
                          )}
                        </td>
                        <td>
                          {idx + 5 < catA.length && (
                            <Link
                              href={`/category?catA=${catA[idx + 5]}`}
                              className="hover:font-bold hover:text-[#ff8a00]"
                            >
                              {catA[idx + 5].replace("_", " ")}
                            </Link>
                          )}
                        </td>
                        <td>
                          {catB[idx] && (
                            <Link
                              href={`/category?catB=${catB[idx]}`}
                              className="hover:font-bold hover:text-[#ff8a00]"
                            >
                              {catB[idx].replace("_", " ")}
                            </Link>
                          )}
                        </td>
                        <td>
                          {dietary[idx] && (
                            <Link
                              href={`/category?dietary=${dietary[idx]}`}
                              className="hover:font-bold hover:text-[#ff8a00]"
                            >
                              {dietary[idx]}
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={clsx([
              "block py-2 px-4 rounded-lg hover:underline decoration-[#ff8a00] decoration-2 underline-offset-2 text-sm font-semibold tracking-widest",
              {
                "underline pointer-events-none": startsWith === "dashboard",
              },
            ])}
            href="/dashboard"
          >
            DASHBOARD
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={clsx([
              "block py-2 px-4 rounded-lg hover:underline decoration-[#ff8a00] decoration-2 underline-offset-2 text-sm font-semibold tracking-widest",
              {
                "underline pointer-events-none": startsWith === "saved",
              },
            ])}
            href="/saved"
          >
            SAVED
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Indicator className="top-full z-10 flex h-2.5 items-end justify-center overflow-hidden">
          {" "}
          {/* transition-[width,transform_250ms_ease] data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn */}
          <div className="relative top-[50%] size-2.5 rotate-45 rounded-tl-sm bg-orange-100" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>
      <div className="perspective-[2000px] absolute left-0 right-0 top-full flex">
        <NavigationMenu.Viewport className="relative h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] rounded-md bg-white" />
      </div>
    </NavigationMenu.Root>
  );
}
