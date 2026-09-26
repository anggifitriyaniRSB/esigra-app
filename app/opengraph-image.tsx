import { ImageResponse } from "next/og";
import { BRAND_MARK_DATA_URI } from "@/lib/brand-mark";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "e-SIGRA — From Risk to Action.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1F3B2E",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src={BRAND_MARK_DATA_URI}
            width={44}
            height={44}
            style={{ borderRadius: 10 }}
          />
          <div style={{ fontSize: 28, color: "#F7F3E9", letterSpacing: "-0.01em" }}>e-SIGRA</div>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            letterSpacing: "0.18em",
            color: "#B9C7A6",
            textTransform: "uppercase"
          }}
        >
          Digital Preventive Health
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 82,
            fontWeight: 600,
            color: "#F7F3E9",
            lineHeight: 1.05
          }}
        >
          From Risk to Action.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 26,
            color: "#DEE5CD",
            maxWidth: 920,
            lineHeight: 1.4
          }}
        >
          Early risk screening, prioritised alerts, health-worker validation
          and structured follow-up — in one connected workflow.
        </div>
      </div>
    ),
    { ...size }
  );
}
