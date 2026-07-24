
// components/HeroAnimation.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function HeroAnimation() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    },
    { scope: container } // auto-cleanup scoped to this component — critical for React
  );

  return (
    <div ref={container}>
      <h1 className="hero-title">Welcome</h1>
      <p className="hero-subtitle">Build something great</p>
    </div>
  );
}



// "use client";

// import { useRef } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function ScrollSection() {
//   const container = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       gsap.from(".fade-in-card", {
//         y: 60,
//         opacity: 0,
//         duration: 0.8,
//         stagger: 0.15,
//         scrollTrigger: {
//           trigger: ".fade-in-card",
//           start: "top 80%",
//         },
//       });
//     },
//     { scope: container },
//   );

//   return (
//     <div ref={container} className="grid grid-cols-3 gap-4">
//       <div className="fade-in-card">Card 1</div>
//       <div className="fade-in-card">Card 2</div>
//       <div className="fade-in-card">Card 3</div>
//     </div>
//   );
// }
