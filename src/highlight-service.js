const _ = require('lodash');

const supportedLangs = [
    { name: "Auto", mode: "auto", extension: "" },
    { name: "Apache", mode: "apache", mime: "text/apache", custom: !0 },
    { name: "Bash", mode: "shell", mime: "application/x-sh", extension: ["sh", "bash"] },
    { name: "Plain Text", mode: "text" },
    { name: "C", mode: "clike", mime: "text/x-csrc", short: "c", extension: "" },
    { name: "C++", mode: "clike", mime: "text/x-c++src", short: "cpp", extension: "cpp" },
    { name: "C#", mode: "clike", mime: "text/x-csharp", short: "cs", extension: "cs" },
    { name: "Clojure", mode: "clojure", extension: "clj" },
    { name: "Cobol", mode: "cobol", extension: "cbl" },
    { name: "CoffeeScript", mode: "coffeescript", extension: "coffee" },
    { name: "Crystal", mode: "crystal" },
    { name: "CSS", mode: "css", extension: "css" },
    { name: "D", mode: "d", extension: "d" },
    { name: "Dart", mode: "dart", extension: "dart" },
    { name: "Diff", mode: "diff", mime: "text/x-diff" },
    { name: "Django", mode: "django" },
    { name: "Docker", mode: "dockerfile" },
    { name: "Elixir", mode: "elixir", custom: !0, extension: ["ex", "exs"] },
    { name: "Elm", mode: "elm", extension: "elm" },
    { name: "Erlang", mode: "erlang", extension: "erl" },
    { name: "Fortran", mode: "fortran", extension: "f90" },
    { name: "F#", mode: "mllike", extension: "fsx" },
    { name: "GraphQL", mode: "graphql", custom: !0 },
    { name: "Go", mode: "go", extension: "go" },
    { name: "Groovy", mode: "groovy", extension: "groovy" },
    { name: "Handlebars", mode: "handlebars" },
    { name: "Haskell", mode: "haskell", extension: "hs" },
    { name: "Haxe", mode: "haxe", extension: "hx" },
    { name: "HTML", mode: "htmlmixed", extension: "HTML" },
    { name: "Java", mode: "clike", mime: "text/x-java", short: "java", extension: "java" },
    { name: "JavaScript", mode: "javascript", short: "javascript", extension: "js" },
    { name: "JSON", mode: "javascript", mime: "application/json", short: "json", extension: "json" },
    { name: "JSX", mode: "jsx", extension: "jsx" },
    { name: "Julia", mode: "julia", extension: "jl" },
    { name: "Kotlin", mode: "clike", mime: "text/x-kotlin", short: "kotlin", extension: "kt" },
    { name: "LaTeX", mode: "stex", extension: "tex" },
    { name: "Lisp", mode: "commonlisp", extension: "lsp" },
    { name: "Lua", mode: "lua", extension: "lua" },
    { name: "Markdown", mode: "markdown", extension: "md" },
    { name: "Mathematica", mode: "mathematica", extension: "m?" },
    { name: "MATLAB/Octave", mode: "octave", mime: "text/x-octave", extension: "m?" },
    // { name: "MySQL", mode: "sql", mime: "text/x-mysql", short: "mysql", extension: "sql" },
    { name: "NGINX", mode: "nginx" },
    { name: "Nim", mode: "nimrod", custom: !0, extension: "nim" },
    { name: "Objective C", mode: "clike", mime: "text/x-objectivec", short: "objectivec", extension: "m" },
    { name: "OCaml", mode: "mllike", extension: "ml" },
    { name: "Pascal", mode: "pascal", extension: "pas" },
    { name: "Perl", mode: "perl", extension: "pl" },
    { name: "PHP", mode: "php", mime: "text/x-php", short: "php", extension: "php" },
    { name: "PowerShell", mode: "powershell", extension: "ps1" },
    { name: "Python", mode: "python", extension: "py" },
    { name: "R", mode: "r", extension: "R" },
    { name: "Ruby", mode: "ruby", extension: "rb" },
    { name: "Rust", mode: "rust", extension: "rs" },
    { name: "Sass", mode: "sass", extension: "sass" },
    { name: "Scala", mode: "clike", mime: "text/x-scala", short: "scala", extension: "scala" },
    { name: "Smalltalk", mode: "smalltalk", extension: "st" },
    { name: "SQL", mode: "sql", extension: "sql" },
    { name: "Stylus", mode: "stylus", mime: "stylus" },
    { name: "Swift", mode: "swift", extension: "swift" },
    { name: "TCL", mode: "tcl", extension: "tcl" },
    { name: "TOML", mode: "toml", extension: "" },
    { name: "TypeScript", mode: "javascript", mime: "application/typescript", short: "typescript", extension: "ts" },
    { name: "VB.NET", mode: "vb", extension: "vb" },
    { name: "Verilog", mode: "verilog", extension: "v" },
    { name: "VHDL", mode: "vhdl", extension: "vhdl" },
    { name: "Vue", mode: "vue", extension: "vue" },
    { name: "XML", mode: "xml", extension: "xml" },
    { name: "YAML", mode: "yaml", extension: "yaml" }
];


module.exports = {
    /**
     * returns Carbon's lang name bsaed on file extension 
     * @param {string} extension 
     */
    getCarbonLangByFileExtension(extension) {
        const langDesc = _.find(supportedLangs, langDescription => {
            if(_.isArray(langDescription.extension)) {
                return langDescription.extension.includes(extension);
            } else {
                return langDescription.extension === extension;
            }
        });
        return langDesc || supportedLangs[0];
    }
}