import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = {
  title: "IPGC | Shyama Samman 2026",
  description: "Official IPGC Shyama Samman 2026 registration",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="ipgc-site">
        <div className="ipgc-site-content">{children}</div>
        <footer className="ipgc-global-footer">
          <a href="https://indianfestival.co.in/" target="_blank" rel="noopener noreferrer">
            Digital Experience by Indian Festival AI &amp; Innovation Lab
          </a>
        </footer>
      </body>
    </html>
  );
}
