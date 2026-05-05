export default function LandingIcon({ size = 20, className, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1200 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      focusable="false"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M193.828 137.109L75 375H562.5V75H294.609C251.953 75 213.047 99.1406 193.828 137.109ZM637.5 375H1125L1006.17 137.109C986.953 99.1406 948.047 75 905.391 75H637.5V375ZM1125 450H75V975C75 1057.73 142.266 1125 225 1125H975C1057.73 1125 1125 1057.73 1125 975V450Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="40"
      />
    </svg>
  );
}
