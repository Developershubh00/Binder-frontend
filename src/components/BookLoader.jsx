import { useEffect, useRef, useId } from "react";

const BookLoader = ({ size = 72, color = "#8f8f8f" }) => {
  const svgRef = useRef(null);
  const maskId = useId(); // unique id so multiple loaders on one page don't collide

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = (event) => {
      const svg = svgRef.current;
      if (!svg) return;
      if (event.matches) {
        svg.pauseAnimations?.();
      } else {
        svg.unpauseAnimations?.();
      }
    };

    updateMotionPreference(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMotionPreference);
      return () =>
        mediaQuery.removeEventListener("change", updateMotionPreference);
    }
  }, []);

  const animationValues = `
    M 59.500 38.400 C 64.000 35.100 69.100 33.300 74.300 33.300 L 74.300 53.700 C 69.100 53.700 64.200 55.400 59.500 58.500 Z;
    M 59.500 38.400 C 62.800 32.300 66.300 28.200 69.600 27.600 L 69.600 51.000 C 66.000 51.700 62.500 54.400 59.500 58.500 Z;
    M 59.500 38.400 C 60.800 30.500 62.000 25.800 62.800 25.400 L 62.800 49.800 C 61.800 51.100 60.500 54.800 59.500 58.500 Z;
    M 59.500 38.400 C 59.500 30.000 59.500 25.000 59.500 25.000 L 59.500 49.400 C 59.500 51.500 59.500 55.000 59.500 58.500 Z;
    M 59.500 38.400 C 58.200 30.500 57.000 25.800 56.200 25.400 L 56.200 49.800 C 57.200 51.100 58.500 54.800 59.500 58.500 Z;
    M 59.500 38.400 C 56.200 32.300 52.700 28.200 49.400 27.600 L 49.400 51.000 C 53.000 51.700 56.500 54.400 59.500 58.500 Z;
    M 59.500 38.400 C 55.100 35.100 50.800 33.300 46.000 33.300 L 46.000 53.700 C 51.000 53.700 55.200 55.400 59.500 58.500 Z
  `;

  const animationKeySplines =
    "0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1";

  const animationProps = {
    attributeName: "d",
    dur: "0.778s",
    repeatCount: "indefinite",
    calcMode: "spline",
    keyTimes: "0.000;0.180;0.400;0.500;0.600;0.820;1.000",
    keySplines: animationKeySplines,
    values: animationValues,
  };

  const visuallyHidden = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  };

  return (
    <span role="status" aria-live="polite">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 94 90"
        aria-hidden="true"
        focusable="false"
        style={{
          width: typeof size === "number" ? `${size}px` : size,
          height: "auto",
          display: "block",
          color,
          overflow: "visible",
        }}
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="94"
            height="90"
          >
            <rect x="0" y="0" width="94" height="90" fill="white" />
            <path
              fill="black"
              d="M 59.500 38.400 C 64.000 35.100 69.100 33.300 74.300 33.300 L 74.300 53.700 C 69.100 53.700 64.200 55.400 59.500 58.500 Z"
            >
              <animate {...animationProps} />
            </path>
          </mask>
        </defs>

        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask={`url(#${maskId})`}
        >
          <path d="M59.5 38.4 C55.1 35.1 50.8 33.3 46 33.3 L46 53.7 C51 53.7 55.2 55.4 59.5 58.5" />
          <path d="M59.5 38.4 C64 35.1 69.1 33.3 74.3 33.3 L74.3 53.7 C69.1 53.7 64.2 55.4 59.5 58.5" />
          <path d="M59.5 38.4 L59.5 59.1" />
        </g>

        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M 59.500 38.400 C 64.000 35.100 69.100 33.300 74.300 33.300 L 74.300 53.700 C 69.100 53.700 64.200 55.400 59.500 58.500 Z"
        >
          <animate {...animationProps} />
        </path>
      </svg>
      <span style={visuallyHidden}>Loading</span>
    </span>
  );
};

export default BookLoader;
