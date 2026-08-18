// components/HeroAnimation.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function InteractiveCard() {
  const cardRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: cardRef });

  // contextSafe ensures GSAP gets proper cleanup
  const onMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.5 });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, { scale: 0.5, duration: 0.3 });
  });

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="p-6 bg-white shadow-lg rounded-xl cursor-pointer"
    >
      Hover me
    </div>
  );
}

// Register the plugin once
gsap.registerPlugin(ScrollTrigger);

function MyComponent() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Your animations here
      gsap.from(".element", {
        scrollTrigger: {
          trigger: ".element",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <div className="element">Content</div>
    </div>
  );
}

function ScrollSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".reveal-text", {
        scrollTrigger: {
          trigger: ".reveal-text", // element that triggers the animation
          start: "top 90%", // when top of element hits 80% of viewport
          end: "top 30%", // animation completes here
          scrub: 1, // smooth scrubbing (1s delay)
          // markers: true,       // debug lines (remove in production)
        },
        y: 100,
        opacity: 0,
        duration: 1,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center"
    >
      <h2 className="reveal-text text-5xl font-bold">I animate on scroll</h2>
    </section>
  );
}

function Sequence() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" }, // apply to all children
      });

      tl.from(".title", { y: -80, opacity: 0, duration: 0.8 })
        .from(".subtitle", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4") // overlap by 0.4s
        .from(".card", { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1 })
        .to(".button", { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 }); // little pulse
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <h1 className="title">Main Title</h1>
      <p className="subtitle">Description here</p>
      <div className="card">Card 1</div>
      <div className="card">Card 2</div>
      <button className="button">Click Me</button>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".animate-item", {
        x: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 1, // each item starts 0.2s after the previous
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  ); // only look inside containerRef

  return (
    <div ref={containerRef} className="p-10">
      <h1 className="animate-item text-4xl font-bold">Hello World</h1>
      <p className="animate-item text-gray-600">Welcome to my site</p>
      <button className="animate-item bg-blue-600 text-white px-6 py-2 rounded">
        Get Started
      </button>
    </div>
  );
}

export default function HeroAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const boxRef = useRef(null);

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
    { scope: container }, // auto-cleanup scoped to this component — critical for React
  );

  useGSAP(() => {
    // This runs after the component mounts
    gsap.from(boxRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "elastic",
    });
  }, []); // Empty deps = run once on mount

  return (
    <>
      <div ref={container}>
        <h1 className="hero-title">Welcome</h1>
        <p className="hero-subtitle">Build something great</p>
      </div>

      <div ref={boxRef} className="w-32 h-32 bg-blue-500 rounded-lg" />

      <Hero />

      <Sequence />
      <InteractiveCard />
      <MyComponent />

      <ScrollSection />
    </>
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
