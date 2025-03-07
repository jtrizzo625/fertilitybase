import type { SVGProps } from "react"

export function FertilityLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M12 3C16.5 3 20 6.5 20 11C20 15.5 16.5 19 12 19C7.5 19 4 15.5 4 11C4 6.5 7.5 3 12 3Z"
        stroke="url(#gradient1)"
        fill="none"
        strokeWidth="1.5"
      />
      <path
        d="M12 7C14.2 7 16 8.8 16 11C16 13.2 14.2 15 12 15C9.8 15 8 13.2 8 11C8 8.8 9.8 7 12 7Z"
        stroke="url(#gradient2)"
        fill="none"
        strokeWidth="1.5"
      />
      <path d="M12 21V19" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 22C9 22 10.5 20.5 12 20.5C13.5 20.5 15 22 15 22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11C8 8.8 9.8 7 12 7" stroke="url(#gradient2)" fill="none" strokeWidth="1.5" />
      <path d="M12 7C14.2 7 16 8.8 16 11" stroke="url(#gradient2)" fill="none" strokeWidth="1.5" />
      <defs>
        <linearGradient id="gradient1" x1="4" y1="3" x2="20" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1AB3A6" />
          <stop offset="1" stopColor="#F24D80" />
        </linearGradient>
        <linearGradient id="gradient2" x1="8" y1="7" x2="16" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1AB3A6" />
          <stop offset="1" stopColor="#F24D80" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function FertilityLogoFilled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3C16.5 3 20 6.5 20 11C20 15.5 16.5 19 12 19C7.5 19 4 15.5 4 11C4 6.5 7.5 3 12 3Z"
        fill="url(#gradient1)"
        stroke="none"
      />
      <path
        d="M12 7C14.2 7 16 8.8 16 11C16 13.2 14.2 15 12 15C9.8 15 8 13.2 8 11C8 8.8 9.8 7 12 7Z"
        fill="white"
        fillOpacity="0.3"
        stroke="none"
      />
      <path d="M12 21V19" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 22C9 22 10.5 20.5 12 20.5C13.5 20.5 15 22 15 22" stroke="currentColor" strokeWidth="1.5" />
      <defs>
        <linearGradient id="gradient1" x1="4" y1="3" x2="20" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1AB3A6" />
          <stop offset="1" stopColor="#F24D80" />
        </linearGradient>
      </defs>
    </svg>
  )
}

