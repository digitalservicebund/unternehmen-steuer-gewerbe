import tsLint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: ["coverage/", "dist/"] },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true, // Required for type-aware linting
      },
    },
    plugins: {
      "@typescript-eslint": tsLint,
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          types: ["boolean"],
          format: null,
          prefix: ["is", "has", "can", "should"],
        },
      ],
    },
  },
];
