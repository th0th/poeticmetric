import { CSSProperties } from "react";

export const commonStyles: Record<string, CSSProperties> = {
  link: {
    color: "#117BBF",
    fontWeight: 700,
    textDecoration: "none",
  },
  textBold: {
    fontWeight: 700,
  },
};

export const notificationStyles: Record<string, CSSProperties> = {
  container: {
    borderTopColor: "#C53030",
    borderTopStyle: "solid",
    borderTopWidth: 5,
    paddingTop: 24,
  },
  content: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    fontSize: 24,
  },
};
