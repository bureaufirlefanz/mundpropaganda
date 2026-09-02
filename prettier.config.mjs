/**
 * Formatierung. Bewusst nah an Prettiers Voreinstellungen, weil der Bestand
 * ohnehin schon so aussieht: Von 27.979 Codezeilen liegen 27.199 unter 80
 * Spalten, es gibt keine einzige Tabulator-Einrückung, und alle 456 Importe
 * stehen in doppelten Anführungszeichen. Gemessen, nicht geschätzt — deshalb
 * ist die Umstellung ein Werkzeug, das den vorhandenen Stil festhält, und
 * nicht eines, das einen neuen durchsetzt.
 *
 * Die Werte stehen trotzdem ausgeschrieben da. Voreinstellungen ändern sich
 * zwischen Hauptversionen, und dann formatiert ein Prettier-Update
 * unangekündigt das ganze Verzeichnis um.
 */
export default {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",

  /* Ohne dieses Plugin kann Prettier .astro nicht lesen — es kennt weder das
     Frontmatter über den drei Strichen noch die Vorlagensyntax darunter. */
  plugins: ["prettier-plugin-astro"],

  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" },
    },
    {
      /* Markdown lebt von Zeilenumbrüchen, die jemand absichtlich gesetzt
         hat — in Tabellen und in umbrochenem Fließtext. `preserve` lässt sie
         stehen, statt Absätze zu einer langen Zeile zusammenzuziehen. */
      files: ["*.md"],
      options: { proseWrap: "preserve" },
    },
  ],
};
