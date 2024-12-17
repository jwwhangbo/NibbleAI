"use client";
import clsx from "clsx";
import styles from "./hamburgers.module.css";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.png";
import searchsvg from "@/public/svg/search-alt-1.svg";

export default function TopNavbar() {
  const [isActive, setActive] = useState(false);
  return (
    <div className="w-full min-w-[375px] h-[56px] shadow-md flex-shrink-0">
      <div className="flex w-full px-[17px] h-full justify-between">
        <button
          className={clsx(`${styles.hamburger} ${styles["hamburger--spin"]}`, {
            [styles["is-active"]]: isActive,
          })}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setActive(!isActive);
          }}
        >
          <span className={styles["hamburger-box"]}>
            <span className={styles["hamburger-inner"]}></span>
          </span>
        </button>
        <Image src={logo} width="33" height="36" alt="logo" />
        <Image src={searchsvg} width="32" height="32" alt="search" />
      </div>
    </div>
  );
}
