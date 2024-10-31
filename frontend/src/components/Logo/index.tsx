import { JSX, PropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Logo.module.css";

type LogoProps = PropsWithoutRef<JSX.IntrinsicElements["svg"]>;

export default function Logo({ className, ...props }: LogoProps) {
  return (
    <svg {...props} className={clsx(styles.logo, className)} fill="none" viewBox="0 0 100 100">
      <circle cx="50" cy="50" fill="url(#paint0_linear)" r="50" />

      <path
        d="M40.2863 39.6961L34.6706 45.3118L6.07449 73.9059C3.2686 68.7608 1.33919 63.0686 0.490173 57.0294L29.0549 28.4647C32.1568 25.3647 37.1843 25.3647 40.2843 28.4667H40.2863C40.3098 28.4902 40.3333 28.5137 40.3568 28.5392C43.3863 31.6431 43.3627 36.6177 40.2863 39.6961V39.6961Z"
        fill="#A7C5FD"
      />
      <path
        d="M99.6451 44.0118L72.1236 71.5333C69.0216 74.6353 63.9941 74.6353 60.8922 71.5333L29.0549 39.6961C27.5039 38.1451 26.7294 36.1137 26.7294 34.0804C26.7294 32.0471 27.5039 30.0157 29.0549 28.4647C32.1569 25.3647 37.1843 25.3647 40.2843 28.4667L40.3569 28.5392L63.9745 52.1549C65.3726 53.5549 67.6432 53.5549 69.0412 52.1549L94.3353 26.8608C97.0745 32.1 98.9138 37.8863 99.6451 44.0118V44.0118Z"
        fill="#EBEFF0"
      />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="0" x2="100" y1="0" y2="100">
          <stop stop-color="#3C91E6"></stop>
          <stop offset="1" stop-color="#26639F"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}
