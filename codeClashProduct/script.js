/*Node.js is used to fetch the data from table.sql(PostgreSQL)
to generate code templates dynamically */

//PHP backend setup
const instanceId = localStorage.getItem("instanceId") || Date.now().toString();
localStorage.setItem("instanceId", instanceId);

async function syncData(status, time) {
    try {
        const response = await fetch("sync.php", {
            method: "POST",
            body: new URLSearchParams({ instanceId, status, time }),
        });
        const result = await response.json();
        console.log("Sync Data Response:", result);
        if (!result.success) {
            console.error("Error syncing data:", result.error);
        }
        return result;
    } catch (error) {
        console.error("Sync Data Error:", error);
    }
}


async function fetchLeaderboard() {
    const response = await fetch("sync.php");
    const data = await response.json();
    const leaderboard = Object.entries(data)
        .sort((a, b) => a[1].time - b[1].time)
        .map(([id, info], index) => `${index + 1}. Instance ${id} - Time: ${info.time}s`);
    document.getElementById("test-results").innerText = leaderboard.join("\n");
}

async function checkForCompletion() {
    const pollInterval = 1000; // Interval in milliseconds to check for completion

    async function poll() {
        const response = await fetch("sync.php");
        const data = await response.json();
        const allSolved = Object.values(data).every(d => d.status === "solved");

        if (allSolved) {
            alert("All instances solved! Showing leaderboard...");
            fetchLeaderboard();
        } else {
            // If not all solved, check again after the interval
            setTimeout(poll, pollInterval);
        }
    }

    // Start the polling process
    await poll();
}

syncData("unsolved", 0);

// Editor init
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

let editor;
require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "function sumArray(nums) {\n    // Write your code here \n    return nums.reduce((a, b) => a + b, 0);\n}",
        language: "javascript",
        theme: "vs-dark"
    });
});

// pyodide (for python code running) init
let pyodideInstance;

async function loadPyodideAndPackages() {
    pyodideInstance = await loadPyodide();
    console.log("Pyodide loaded");
}

let timerInterval;
let elapsedTime = 0;

// Timer
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    document.getElementById('timer').innerText = formatTime(elapsedTime);
    timerInterval = setInterval(() => {
        elapsedTime++;
        document.getElementById('timer').innerText = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

startTimer();
loadPyodideAndPackages();

// Language change
document.getElementById('language-select').addEventListener('change', function (e) {
    const language = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), language);
    const templates = {
        python: `def {function_name}({parameters}):\n    # Write your code here\n    pass`,
        python3: `def {function_name}({parameters}):\n    # Write your code here\n    pass`,
        javascript: `function {function_name}({parameters}) {\n    // Write your code here\n}`,
        java: `public class Solution {\n    public static {return_type} {function_name}({parameters}) {\n        // Write your code here\n    }\n}`,
        csharp: `using System;\nclass Program {\n    static {return_type} {function_name}({parameters}) {\n        // Write your code here\n    }\n}`,
        cpp: `#include <iostream>\nusing namespace std;\n\n{return_type} {function_name}({parameters}) {\n    // Write your code here\n}`,
        c: `#include <stdio.h>\n\n{return_type} {function_name}({parameters}) {\n    // Write your code here\n}`,
        typeScript: `function {function_name}({parameters}): {return_type} {\n    // Write your code here\n}`,
        php: `<?php\nfunction {function_name}({parameters}) {\n    // Write your code here\n}\n?>`,
        swift: `func {function_name}({parameters}) -> {return_type} {\n    // Write your code here\n}`,
        go: `package main\nimport "fmt"\nfunc {function_name}({parameters}) {return_type} {\n    // Write your code here\n}`,
        kotlin: `fun {function_name}({parameters}): {return_type} {\n    // Write your code here\n}`,
        rust: `fn {function_name}({parameters}) -> {return_type} {\n    // Write your code here\n}`,
        dart: `{return_type} {function_name}({parameters}) {\n    // Write your code here\n}`,
        ruby: `def {function_name}({parameters})\n    # Write your code here\nend`,
        bash: `function {function_name}() {\n    # Write your code here\n}`,
        elixir: `defmodule Solution do\n    def {function_name}({parameters}) do\n        # Write your code here\n    end\nend`,
        erlang: `{function_name}({parameters}) ->\n    % Write your code here.`,
        racket: `(define ({function_name} {parameters})\n  ;; Write your code here\n)`,
    };
    editor.setValue(templates[language]);
});

// Setting templates for each questions (e.g if you code in python3 the initial function woulde be def sort_num(): )

function getTemplate(questionId, language) {
    const question = questions[questionId];
    let template = languageTemplates[language];

    template = template.replace("{function_name}", question.function_name);
    template = template.replace("{parameters}", question.parameters || "");
    template = template.replace("return_type", question.return_type || "void");  // Default for statically typed languages

    return template;
}



// Code running
document.getElementById('run-code').addEventListener('click', async function () {
    const language = document.getElementById('language-select').value;
    const code = editor.getValue();

    // Send request to PHP backend for execution
    const response = await fetch('run_code.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
    });

    const result = await response.json();
    document.getElementById('test-results').innerText = result.run.stdout || result.run.stderr;
});


    // Pre-made inputs + answers
    const testInputs = [
        [1, 2, 3],
        [4, 5, 6],
        [-1, -2, -3],
        [0, 0],
        [-123, 4, 123, -4],
    ];
    const expectedOutputs = [6, 15, -6, 0, 0];

    let success = true;
    const results = [];

    if (language === "python" && pyodideInstance) {
        try {
            // Python function
            const pythonFunction = `
import json
${code}

def test_solution():
    test_inputs = ${JSON.stringify(testInputs)}
    expected_outputs = ${JSON.stringify(expectedOutputs)}
    results = []
    for nums, expected in zip(test_inputs, expected_outputs):
        try:
            result = sumArray(nums)
            results.append({
                "input": nums,
                "output": result,
                "expected": expected,
                "correct": result == expected
            })
        except Exception as e:
            results.append({
                "input": nums,
                "output": str(e),
                "expected": expected,
                "correct": False
            })
    return json.dumps(results)
`;
            // Run python function
            const pythonResults = await pyodideInstance.runPythonAsync(`
${pythonFunction}
test_solution()

`);
            const parsedResults = JSON.parse(pythonResults);
            console.log("Python Results:", parsedResults);

            // Result formating
            parsedResults.forEach(result => {
                const isCorrect = result.correct;
                if (!isCorrect) success = false;
                results.push(
                    `Input: ${JSON.stringify(result.input)}\nExpected: ${result.expected}\nOutput: ${result.output}\nResult: ${
                        isCorrect ? "Correct" : "Incorrect"
                    }`
                );
            });
        } catch (error) {
            console.error("Python execution error:", error);
            success = false;
            results.push(`Python Execution Error: ${error.message}`);
        }
    } else if (language === "javascript") {
        try {
            // JavaScript function
            const userFunction = new Function("nums", code + "\nreturn sumArray(nums);");

            // Run code
            testInputs.forEach((input, index) => {
                try {
                    const output = userFunction(input);
                    const isCorrect = output === expectedOutputs[index];
                    if (!isCorrect) success = false;
                    results.push(
                        `Input: ${JSON.stringify(input)}\nExpected: ${expectedOutputs[index]}\nOutput: ${output}\nResult: ${
                            isCorrect ? "Correct" : "Incorrect"
                        }`
                    );
                } catch (error) {
                    success = false;
                    results.push(`Input: ${JSON.stringify(input)}\nError: ${error.message}`);
                }
            });
        } catch (error) {
            success = false
            console.error("JavaScript execution error:", error);
            results.push(`JavaScript Execution Error: ${error.message}`);
        }
    } else {
        // C++ in the future
        success = false
        results.push("Work in progress");
    }

    // Final output
    document.getElementById('test-results').innerText = results.join("\n\n");

    // Display success message
    if (success) {
        alert("All test cases passed successfully!");
        stopTimer();
        const time = elapsedTime;
        await syncData("solved", time);
        await checkForCompletion();
    } else {
        alert("Some test cases failed. Check the results for details.");
    }
});

// Testcase code
document.getElementById('run-tests').addEventListener('click', async function () {
    const language = document.getElementById('language-select').value;
    const testCases = document.getElementById('testcases').value.trim().split("\n");
    const results = [];

    if (language === "python" && pyodideInstance) {
        for (const testCase of testCases) {
            try {
                const nums = JSON.parse(testCase);
                const result = await pyodideInstance.runPythonAsync(`
nums = ${testCase}
${editor.getValue()}
sumArray(nums)
`);
                results.push(`Input: ${testCase}\nOutput: ${result}`);
            } catch (error) {
                results.push(`Input: ${testCase}\nError: ${error.message}`);
            }
        }
    } else if (language === "javascript") {
        const userFunction = new Function("nums", editor.getValue() + "\nreturn sumArray(nums);");
        for (const testCase of testCases) {
            try {
                const nums = JSON.parse(testCase);
                results.push(`Input: ${testCase}\nOutput: ${userFunction(nums)}`);
            } catch (error) {
                results.push(`Input: ${testCase}\nError: ${error.message}`);
            }
        }
    } else {
        results.push("Work in progress");
    }

    document.getElementById('test-results').innerText = results.join("\n\n");
});


