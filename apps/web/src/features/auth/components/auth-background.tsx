"use client";

import { motion } from "framer-motion";

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-df-bg-deep">
      {/* Mesh gradient blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[15%] -left-[10%] h-[600px] w-[600px] rounded-full bg-df-accent/15 blur-[150px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, -60, 0],
          x: [0, -60, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[30%] -right-[5%] h-[500px] w-[500px] rounded-full bg-df-accent-violet/10 blur-[130px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-15%] left-[30%] h-[450px] w-[450px] rounded-full bg-indigo-600/8 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[60%] left-[10%] h-[300px] w-[300px] rounded-full bg-violet-500/6 blur-[100px]"
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
    </div>
  );
}
