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

loadPyodideAndPackages();

// Language change
document.getElementById('language-select').addEventListener('change', function (e) {
    const language = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), language);
    const templates = {
        python: `def {function_name}({parameters}):\n    # Write your code here\n    pass`,
        javascript: `function {function_name}({parameters}) {\n    // Write your code here\n}`,
        cpp: `#include <iostream>\nusing namespace std;\n\n{return_type} {function_name}({parameters}) {\n    // Write your code here\n}`,
    };
    editor.setValue(templates[language]);
});

function getTemplate(questionId, language) {
    const question = questions[questionId];
    let template = languageTemplates[language];

    template = template.replace("{function_name}", question.function_name);
    template = template.replace("{parameters}", question.parameters || "");
    template = template.replace("return_type", question.return_type || "void");  // Default for statically typed languages 
    //!!!NEEDS TO BE CHANGED DEPENDING ON A PROBLEM. MOST LIKELY WE'LL END UP ADDING FUNCTION NAME AND PARAMETERS TO THE DATABASE FOR THE QUESTION (AND RETURN TYPE CAN BE A PART OF THE FUNCTION NAME)!!!

    return template;
}

// Code running (PISTON API LOGIC HERE!!!)
document.getElementById('run-code').addEventListener('click', async function () {
    const language = document.getElementById('language-select').value;
    const code = editor.getValue();

    // Fetching test cases
    const params = new URLSearchParams(window.location.search);
    const questionId = params.get("id");

    if (!questionId) {
        alert("No question selected!");
        return;
    }

    const response = await fetch(`fetch_question.php?id=${questionId}`);
    const data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    // Transforming test cases and outputs
    const testInputs = data.test_cases.map(tc => tc.input);  // Test case inputs
    const expectedOutputs = data.test_cases.map(tc => tc.expected_output);  // Expected outputs

    console.log("Test Inputs:", testInputs);
    console.log("Expected Outputs:", expectedOutputs);

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