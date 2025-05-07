import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@scripts": path.resolve(__dirname, "./src/scripts"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@img": path.resolve(__dirname, "./public/img"),
    },
  },
  build: {
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    outDir: path.resolve(__dirname, "./build"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"), 
        main: path.resolve(__dirname, "./src/main.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const { facadeModuleId } = chunkInfo;
          if (facadeModuleId) {
            if (facadeModuleId.includes("pages/")) {
              const pageName = facadeModuleId.split("pages/")[1].split("/")[0];
              return `pages/${pageName}/[name].js`;
            }

            if (facadeModuleId.includes("components/")) {
              const compName = facadeModuleId
                .split("components/")[1]
                .split("/")[0];
              return `components/${compName}/[name].js`;
            }
          }

          return "js/[name].js";
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes("node_modules")) {
            const libName = chunkInfo.name
              .split("node_modules/")[1]
              .split("/")[0];
            return `js/vendor/${libName}.js`;
          }
          return "js/chunks/[name].js";
        },
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.names[0].split(".").pop() || "";
          const originalFileName = assetInfo.originalFileNames[0];
          if (originalFileName) {
            if (originalFileName.includes("pages/")) {
              const pageName = originalFileName
                .split("pages/")[1]
                .split("/")[0];
              return `pages/${pageName}/[name][extname]`;
            }
            if (originalFileName.includes("components/")) {
              const pageName = originalFileName
                .split("components/")[1]
                .split("/")[0];
              return `components/${pageName}/[name][extname]`;
            }
          }

          return (
            {
              css: "css/[name].css",
              scss: "css/[name].css",
              png: "images/[name][extname]",
              jpg: "images/[name][extname]",
              svg: "images/[name][extname]",
              webp: "images/[name][extname]",
              woff2: "fonts/[name][extname]",
              ttf: "fonts/[name][extname]",
            }[ext] || "assets/[name][extname]"
          );
        },
      },
    },
  },
});
