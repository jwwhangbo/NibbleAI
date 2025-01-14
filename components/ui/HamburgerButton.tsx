"use client";
import clsx from "clsx";
import styles from "./hamburgers.module.css";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";

export default function HamburgerButton({className, ...props}: React.HTMLAttributes<HTMLButtonElement>) {
  const { active, setActive } = useNavbarStore((state) => state);
  return (
    <button
      className={clsx([className, `${styles.hamburger} ${styles["hamburger--spin"]}`, {
        [styles["is-active"]]: active,
      }])}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setActive();
      }}
      {...props}
    >
      <span className={styles["hamburger-box"]}>
        <span className={styles["hamburger-inner"]}></span>
      </span>
    </button>
  );
}
