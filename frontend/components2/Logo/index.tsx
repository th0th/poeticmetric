import classNames from "classnames";
import styles from "./Logo.module.scss";

export type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["svg"]>, {
  logotype?: boolean;
}>;

export default function Logo({ className, logotype = false, ...props }: Props) {
  return (
    <svg {...props} className={classNames(styles.logo, className)} fill="none" viewBox={logotype ? "0 0 529 100" : "0 0 100 100"}>
      <circle cx="50" cy="50" fill="url(#paint0_linear)" r="50" />

      <path
        d="M40.2863 39.6961L34.6706 45.3118L6.07449 73.9059C3.2686 68.7608 1.33919 63.0686 0.490173 57.0294L29.0549 28.4647C32.1568 25.3647 37.1843 25.3647 40.2843 28.4667H40.2863C40.3098 28.4902 40.3333 28.5137 40.3568 28.5392C43.3863 31.6431 43.3627 36.6177 40.2863 39.6961V39.6961Z"
        fill="#A7C5FD"
      />
      <path
        d="M99.6451 44.0118L72.1236 71.5333C69.0216 74.6353 63.9941 74.6353 60.8922 71.5333L29.0549 39.6961C27.5039 38.1451 26.7294 36.1137 26.7294 34.0804C26.7294 32.0471 27.5039 30.0157 29.0549 28.4647C32.1569 25.3647 37.1843 25.3647 40.2843 28.4667L40.3569 28.5392L63.9745 52.1549C65.3726 53.5549 67.6432 53.5549 69.0412 52.1549L94.3353 26.8608C97.0745 32.1 98.9138 37.8863 99.6451 44.0118V44.0118Z"
        fill="#EBEFF0"
      />

      {logotype ? (
        <>
          <path
            className={styles.logotype}
            d="M128.08 74.432C126.688 74.432 125.56 74.024 124.696 73.208C123.88 72.344 123.472 71.192 123.472 69.752V27.632C123.472 26.24 123.856 25.16 124.624 24.392C125.44 23.624 126.544 23.24 127.936 23.24H145.648C151.072 23.24 155.296 24.608 158.32 27.344C161.344 30.032 162.856 33.824 162.856 38.72C162.856 43.616 161.344 47.432 158.32 50.168C155.296 52.904 151.072 54.272 145.648 54.272H132.76V69.752C132.76 71.192 132.328 72.344 131.464 73.208C130.648 74.024 129.52 74.432 128.08 74.432ZM144.496 47.144C150.88 47.144 154.072 44.36 154.072 38.792C154.072 33.224 150.88 30.44 144.496 30.44H132.76V47.144H144.496Z"
          />
          <path
            className={styles.logotype}
            d="M185.002 74.576C181.402 74.576 178.234 73.832 175.498 72.344C172.81 70.856 170.722 68.72 169.234 65.936C167.746 63.152 167.002 59.912 167.002 56.216C167.002 52.52 167.746 49.304 169.234 46.568C170.722 43.784 172.81 41.648 175.498 40.16C178.234 38.672 181.402 37.928 185.002 37.928C188.602 37.928 191.746 38.672 194.434 40.16C197.17 41.648 199.258 43.784 200.698 46.568C202.186 49.304 202.93 52.52 202.93 56.216C202.93 59.912 202.186 63.152 200.698 65.936C199.258 68.72 197.17 70.856 194.434 72.344C191.746 73.832 188.602 74.576 185.002 74.576ZM184.93 67.592C187.858 67.592 190.09 66.632 191.626 64.712C193.162 62.792 193.93 59.96 193.93 56.216C193.93 52.52 193.162 49.712 191.626 47.792C190.09 45.824 187.882 44.84 185.002 44.84C182.122 44.84 179.89 45.824 178.306 47.792C176.77 49.712 176.002 52.52 176.002 56.216C176.002 59.96 176.77 62.792 178.306 64.712C179.842 66.632 182.05 67.592 184.93 67.592Z"
          />
          <path
            className={styles.logotype}
            d="M238.224 64.352C239.04 64.352 239.688 64.664 240.168 65.288C240.696 65.912 240.96 66.752 240.96 67.808C240.96 69.296 240.072 70.544 238.296 71.552C236.664 72.464 234.816 73.208 232.752 73.784C230.688 74.312 228.72 74.576 226.848 74.576C221.184 74.576 216.696 72.944 213.384 69.68C210.072 66.416 208.416 61.952 208.416 56.288C208.416 52.688 209.136 49.496 210.576 46.712C212.016 43.928 214.032 41.768 216.624 40.232C219.264 38.696 222.24 37.928 225.552 37.928C228.72 37.928 231.48 38.624 233.832 40.016C236.184 41.408 238.008 43.376 239.304 45.92C240.6 48.464 241.248 51.464 241.248 54.92C241.248 56.984 240.336 58.016 238.512 58.016H217.272C217.56 61.328 218.496 63.776 220.08 65.36C221.664 66.896 223.968 67.664 226.992 67.664C228.528 67.664 229.872 67.472 231.024 67.088C232.224 66.704 233.568 66.176 235.056 65.504C236.496 64.736 237.552 64.352 238.224 64.352ZM225.768 44.264C223.32 44.264 221.352 45.032 219.864 46.568C218.424 48.104 217.56 50.312 217.272 53.192H233.544C233.448 50.264 232.728 48.056 231.384 46.568C230.04 45.032 228.168 44.264 225.768 44.264Z"
          />
          <path
            className={styles.logotype}
            d="M266.405 67.736C268.805 67.88 270.005 68.96 270.005 70.976C270.005 72.128 269.525 73.016 268.565 73.64C267.653 74.216 266.333 74.456 264.605 74.36L262.661 74.216C254.597 73.64 250.565 69.32 250.565 61.256V45.56H246.965C245.669 45.56 244.661 45.272 243.941 44.696C243.269 44.12 242.933 43.28 242.933 42.176C242.933 41.072 243.269 40.232 243.941 39.656C244.661 39.08 245.669 38.792 246.965 38.792H250.565V32.168C250.565 30.872 250.973 29.84 251.789 29.072C252.605 28.304 253.709 27.92 255.101 27.92C256.445 27.92 257.525 28.304 258.341 29.072C259.157 29.84 259.565 30.872 259.565 32.168V38.792H265.685C266.981 38.792 267.965 39.08 268.637 39.656C269.357 40.232 269.717 41.072 269.717 42.176C269.717 43.28 269.357 44.12 268.637 44.696C267.965 45.272 266.981 45.56 265.685 45.56H259.565V61.904C259.565 65.456 261.197 67.352 264.461 67.592L266.405 67.736Z"
          />
          <path
            className={styles.logotype}
            d="M279.16 74.432C277.864 74.432 276.784 74.072 275.92 73.352C275.104 72.584 274.696 71.504 274.696 70.112V42.32C274.696 40.928 275.104 39.872 275.92 39.152C276.784 38.432 277.864 38.072 279.16 38.072C280.456 38.072 281.536 38.432 282.4 39.152C283.264 39.872 283.696 40.928 283.696 42.32V70.112C283.696 71.504 283.264 72.584 282.4 73.352C281.536 74.072 280.456 74.432 279.16 74.432ZM279.16 31.664C277.528 31.664 276.232 31.232 275.272 30.368C274.312 29.456 273.832 28.28 273.832 26.84C273.832 25.4 274.312 24.248 275.272 23.384C276.232 22.52 277.528 22.088 279.16 22.088C280.744 22.088 282.016 22.52 282.976 23.384C283.984 24.248 284.488 25.4 284.488 26.84C284.488 28.28 284.008 29.456 283.048 30.368C282.088 31.232 280.792 31.664 279.16 31.664Z"
          />
          <path
            className={styles.logotype}
            d="M308.601 74.576C305.097 74.576 302.001 73.832 299.313 72.344C296.673 70.856 294.633 68.744 293.193 66.008C291.753 63.272 291.033 60.08 291.033 56.432C291.033 52.784 291.777 49.568 293.265 46.784C294.801 43.952 296.937 41.768 299.673 40.232C302.409 38.696 305.553 37.928 309.105 37.928C310.977 37.928 312.849 38.192 314.721 38.72C316.641 39.248 318.321 39.968 319.761 40.88C321.297 41.888 322.065 43.16 322.065 44.696C322.065 45.752 321.801 46.616 321.273 47.288C320.793 47.912 320.145 48.224 319.329 48.224C318.801 48.224 318.249 48.104 317.673 47.864C317.097 47.624 316.521 47.336 315.945 47C314.889 46.376 313.881 45.896 312.921 45.56C311.961 45.176 310.857 44.984 309.609 44.984C306.633 44.984 304.329 45.968 302.697 47.936C301.113 49.856 300.321 52.64 300.321 56.288C300.321 59.888 301.113 62.672 302.697 64.64C304.329 66.56 306.633 67.52 309.609 67.52C310.809 67.52 311.865 67.352 312.777 67.016C313.737 66.632 314.793 66.128 315.945 65.504C316.665 65.072 317.289 64.76 317.817 64.568C318.345 64.328 318.873 64.208 319.401 64.208C320.169 64.208 320.817 64.544 321.345 65.216C321.873 65.888 322.137 66.728 322.137 67.736C322.137 68.552 321.945 69.272 321.561 69.896C321.225 70.472 320.649 71 319.833 71.48C318.345 72.44 316.617 73.208 314.649 73.784C312.681 74.312 310.665 74.576 308.601 74.576Z"
          />
          <path
            className={styles.logotype}
            d="M373.997 22.88C375.341 22.88 376.421 23.312 377.237 24.176C378.053 24.992 378.461 26.096 378.461 27.488V70.112C378.461 71.456 378.077 72.512 377.309 73.28C376.541 74.048 375.533 74.432 374.285 74.432C373.037 74.432 372.053 74.048 371.333 73.28C370.613 72.512 370.253 71.456 370.253 70.112V40.448L358.013 63.632C357.437 64.688 356.813 65.48 356.141 66.008C355.469 66.488 354.677 66.728 353.765 66.728C352.853 66.728 352.061 66.488 351.389 66.008C350.717 65.528 350.093 64.736 349.517 63.632L337.205 40.808V70.112C337.205 71.408 336.821 72.464 336.053 73.28C335.333 74.048 334.349 74.432 333.101 74.432C331.853 74.432 330.869 74.048 330.149 73.28C329.429 72.512 329.069 71.456 329.069 70.112V27.488C329.069 26.096 329.453 24.992 330.221 24.176C331.037 23.312 332.117 22.88 333.461 22.88C335.333 22.88 336.797 23.912 337.853 25.976L353.837 56.432L369.749 25.976C370.805 23.912 372.221 22.88 373.997 22.88Z"
          />
          <path
            className={styles.logotype}
            d="M416.536 64.352C417.352 64.352 418 64.664 418.48 65.288C419.008 65.912 419.272 66.752 419.272 67.808C419.272 69.296 418.384 70.544 416.608 71.552C414.976 72.464 413.128 73.208 411.064 73.784C409 74.312 407.032 74.576 405.16 74.576C399.496 74.576 395.008 72.944 391.696 69.68C388.384 66.416 386.728 61.952 386.728 56.288C386.728 52.688 387.448 49.496 388.888 46.712C390.328 43.928 392.344 41.768 394.936 40.232C397.576 38.696 400.552 37.928 403.864 37.928C407.032 37.928 409.792 38.624 412.144 40.016C414.496 41.408 416.32 43.376 417.616 45.92C418.912 48.464 419.56 51.464 419.56 54.92C419.56 56.984 418.648 58.016 416.824 58.016H395.584C395.872 61.328 396.808 63.776 398.392 65.36C399.976 66.896 402.28 67.664 405.304 67.664C406.84 67.664 408.184 67.472 409.336 67.088C410.536 66.704 411.88 66.176 413.368 65.504C414.808 64.736 415.864 64.352 416.536 64.352ZM404.08 44.264C401.632 44.264 399.664 45.032 398.176 46.568C396.736 48.104 395.872 50.312 395.584 53.192H411.856C411.76 50.264 411.04 48.056 409.696 46.568C408.352 45.032 406.48 44.264 404.08 44.264Z"
          />
          <path
            className={styles.logotype}
            d="M444.718 67.736C447.118 67.88 448.318 68.96 448.318 70.976C448.318 72.128 447.838 73.016 446.878 73.64C445.966 74.216 444.646 74.456 442.918 74.36L440.974 74.216C432.91 73.64 428.878 69.32 428.878 61.256V45.56H425.278C423.982 45.56 422.974 45.272 422.254 44.696C421.582 44.12 421.246 43.28 421.246 42.176C421.246 41.072 421.582 40.232 422.254 39.656C422.974 39.08 423.982 38.792 425.278 38.792H428.878V32.168C428.878 30.872 429.286 29.84 430.102 29.072C430.918 28.304 432.022 27.92 433.414 27.92C434.758 27.92 435.838 28.304 436.654 29.072C437.47 29.84 437.878 30.872 437.878 32.168V38.792H443.998C445.294 38.792 446.278 39.08 446.95 39.656C447.67 40.232 448.03 41.072 448.03 42.176C448.03 43.28 447.67 44.12 446.95 44.696C446.278 45.272 445.294 45.56 443.998 45.56H437.878V61.904C437.878 65.456 439.51 67.352 442.774 67.592L444.718 67.736Z"
          />
          <path
            className={styles.logotype}
            d="M472.664 38.072C473.912 37.976 474.896 38.24 475.616 38.864C476.336 39.488 476.696 40.424 476.696 41.672C476.696 42.968 476.384 43.928 475.76 44.552C475.136 45.176 474.008 45.584 472.376 45.776L470.216 45.992C467.384 46.28 465.296 47.24 463.952 48.872C462.656 50.504 462.008 52.544 462.008 54.992V70.112C462.008 71.504 461.576 72.584 460.712 73.352C459.848 74.072 458.768 74.432 457.472 74.432C456.176 74.432 455.096 74.072 454.232 73.352C453.416 72.584 453.008 71.504 453.008 70.112V42.248C453.008 40.904 453.416 39.872 454.232 39.152C455.096 38.432 456.152 38.072 457.4 38.072C458.648 38.072 459.656 38.432 460.424 39.152C461.192 39.824 461.576 40.808 461.576 42.104V44.984C462.488 42.872 463.832 41.24 465.608 40.088C467.432 38.936 469.448 38.288 471.656 38.144L472.664 38.072Z"
          />
          <path
            className={styles.logotype}
            d="M485.035 74.432C483.739 74.432 482.659 74.072 481.795 73.352C480.979 72.584 480.571 71.504 480.571 70.112V42.32C480.571 40.928 480.979 39.872 481.795 39.152C482.659 38.432 483.739 38.072 485.035 38.072C486.331 38.072 487.411 38.432 488.275 39.152C489.139 39.872 489.571 40.928 489.571 42.32V70.112C489.571 71.504 489.139 72.584 488.275 73.352C487.411 74.072 486.331 74.432 485.035 74.432ZM485.035 31.664C483.403 31.664 482.107 31.232 481.147 30.368C480.187 29.456 479.707 28.28 479.707 26.84C479.707 25.4 480.187 24.248 481.147 23.384C482.107 22.52 483.403 22.088 485.035 22.088C486.619 22.088 487.891 22.52 488.851 23.384C489.859 24.248 490.363 25.4 490.363 26.84C490.363 28.28 489.883 29.456 488.923 30.368C487.963 31.232 486.667 31.664 485.035 31.664Z"
          />
          <path
            className={styles.logotype}
            d="M514.476 74.576C510.972 74.576 507.876 73.832 505.188 72.344C502.548 70.856 500.508 68.744 499.068 66.008C497.628 63.272 496.908 60.08 496.908 56.432C496.908 52.784 497.652 49.568 499.14 46.784C500.676 43.952 502.812 41.768 505.548 40.232C508.284 38.696 511.428 37.928 514.98 37.928C516.852 37.928 518.724 38.192 520.596 38.72C522.516 39.248 524.196 39.968 525.636 40.88C527.172 41.888 527.94 43.16 527.94 44.696C527.94 45.752 527.676 46.616 527.148 47.288C526.668 47.912 526.02 48.224 525.204 48.224C524.676 48.224 524.124 48.104 523.548 47.864C522.972 47.624 522.396 47.336 521.82 47C520.764 46.376 519.756 45.896 518.796 45.56C517.836 45.176 516.732 44.984 515.484 44.984C512.508 44.984 510.204 45.968 508.572 47.936C506.988 49.856 506.196 52.64 506.196 56.288C506.196 59.888 506.988 62.672 508.572 64.64C510.204 66.56 512.508 67.52 515.484 67.52C516.684 67.52 517.74 67.352 518.652 67.016C519.612 66.632 520.668 66.128 521.82 65.504C522.54 65.072 523.164 64.76 523.692 64.568C524.22 64.328 524.748 64.208 525.276 64.208C526.044 64.208 526.692 64.544 527.22 65.216C527.748 65.888 528.012 66.728 528.012 67.736C528.012 68.552 527.82 69.272 527.436 69.896C527.1 70.472 526.524 71 525.708 71.48C524.22 72.44 522.492 73.208 520.524 73.784C518.556 74.312 516.54 74.576 514.476 74.576Z"
          />
        </>
      ) : null}

      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="0" x2="100" y1="0" y2="100">
          <stop stopColor="#3C91E6" />
          <stop offset="1" stopColor="#26639F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
