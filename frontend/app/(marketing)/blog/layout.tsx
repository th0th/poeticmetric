import { Metadata } from "next";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  description: "Stay up to date on the latest privacy-first and regulation-compliant website analytics news, tips, and best practices with PoeticMetric&apos;s blog. Learn how to use data to improve your website and better understand your users, all while keeping their privacy and compliance top of mind.",
  title: {
    absolute: "Privacy-focused website analytics tips and best practices - PoeticMetric Blog",
    template: "%s - PoeticMetric Blog",
  },
};

export default function Layout({ children }: LayoutProps) {
  return children;
}
