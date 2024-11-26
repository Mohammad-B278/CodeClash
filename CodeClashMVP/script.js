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
        javascript: "function sumArray(nums) {\n    // Write your code here \n    return nums.reduce((a, b) => a + b, 0);\n}",
        python: "def sumArray(nums):\n    # Write your code here\n    return sum(nums)",
        cpp: "#include <vector>\nusing namespace std;\nint sumArray(vector<int>& nums) {\n    // Write your code here\n    int sum = 0;\n    for (int num : nums) sum += num;\n    return sum;\n}"
    };
    editor.setValue(templates[language]);
});

// Code running
document.getElementById('run-code').addEventListener('click', async function () {
    const language = document.getElementById('language-select').value;
    const code = editor.getValue();

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
