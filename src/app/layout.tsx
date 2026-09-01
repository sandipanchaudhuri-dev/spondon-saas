import type { Metadata } from "next";
import "./globals.css";
import "./branding.css";
export const metadata:Metadata={title:"Spondon | Pujo Operations",description:"Registration and banner operations for Spondon Sharod Somman."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
