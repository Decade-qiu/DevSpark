import type { ReactNode } from "react";
import "./globals.css";
import ThemeProvider from "../src/components/ThemeProvider";

export const metadata = {
    title: "DevSpark – Smart RSS Reader",
    description: "A modern, intelligent RSS reader for developers",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
