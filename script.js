document.getElementById('profile-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.profile-pic').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
// Editor init
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

let editor;
require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "",
        language: "python",
        theme: "vs-dark"
    });
});

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

// Needs to be rewritten
function getTemplate(questionId, language) {
    const question = questions[questionId];
    let template = languageTemplates[language];

    template = template.replace("{function_name}", question.function_name);
    template = template.replace("{parameters}", question.parameters || "");
    template = template.replace("return_type", question.return_type || "void");  // Default for statically typed languages 
    //!!!NEEDS TO BE CHANGED DEPENDING ON A PROBLEM. MOST LIKELY WE'LL END UP ADDING FUNCTION NAME AND PARAMETERS TO THE DATABASE FOR THE QUESTION (AND RETURN TYPE CAN BE A PART OF THE FUNCTION NAME)!!!

    return template;
}

async function getUserID() {
    const response = await fetch('session.php');
    const data = await response.json();
    
    if (data.error) {
        console.log("User not logged in.");
        return null;
    }
    
    return data.userid;
}

// Code logic

let attempts = 0;

//Running code
document.getElementById('run-code').addEventListener('click', async function () {
    const language = (document.getElementById('language-select').value == "cpp") ? "c++" : document.getElementById('language-select').value;
    const code = editor.getValue();
    let success = false;
    attempts += 1;

    // Fetching test cases
    const params = new URLSearchParams(window.location.search);
    const questionId = params.get("questionID");

    if (!questionId) {
        alert("No question selected!");
        return;
    }

    const response = await fetch(`fetch_question.php?questionID=${questionId}`);
    const data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    // Transforming test cases and outputs
    const testInputs = JSON.parse(data.test_cases);
    const expectedOutputs = JSON.parse(data.expected_output);

    console.log("Test Inputs:", testInputs);
    console.log("Expected Outputs:", expectedOutputs);

    let testResults = "";

    const lang = await fetch("https://emkc.org/api/v2/piston/runtimes");
    const languages = await lang.json();
    console.log("Languages: ", languages)
    const executionVersion = languages
        .filter(l => l.language === String(language))
        .map(l => l.version);

    let lastRun = 0;

    for (let i = 0; i < testInputs.length; i++) {
        console.log(`Test Inputs ${i}: ${String(testInputs[i])}`);
        try {
            
            let now = Date.now();
            let timeLength = now - lastRun;
            if (timeLength < 300) {
                await new Promise(resolve => setTimeout(resolve, 300 - timeLength));
            }
    
            lastRun = Date.now();

            const codeData = {
                language: language,
                version: String(executionVersion.sort().reverse()[0]),
                files: [{ name: "code", content: code }],
                stdin: String(testInputs[i]),
            };

            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(codeData),
            });

            const result = await response.json();
            console.log("Piston API Response:", result);
            let output = result.run.output;
            console.log("Piston API Response:", output, result.run.output, result.run.stdout);

            output = output.trim().replace(/\s+/g, ' ');
            if (output === "True") output = "true";
            if (output === "False") output = "false";

            const expected = expectedOutputs[i];
            
            if (output === String(expected)) {
                testResults += `Test ${i + 1} Passed.<br>Input: ${testInputs[i]}<br>Output: ${output}<br>Expected: ${expected}<br><br>`;
                success = true;
            } else {
                testResults = `Test ${i + 1} Failed.<br>Input: ${testInputs[i]}<br>Output: ${output}<br>Expected: ${expected}<br><br>`;
                success = false;
                break;
            }
        } catch (error) {
            console.error('Error executing code:', error);
            testResults = `Test ${i + 1} Error: ${error.message}`;
            success = false;
            break;
        }
    }
    document.getElementById('test-results').innerHTML = testResults;

    if (success)
    {
        const userId = await getUserSession(); // Fetching user ID
        if (userId) {
            console.log("User ID:", userId);
            await fetch('solved.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: userId, questionID: questionId, attempts: attempts })
            });
            alert("Progress saved");
        } else {
            alert("Something clearly went wrong");
        }
    }
});

// Testcase code
document.getElementById('run-tests').addEventListener('click', async function () {
    const language = (document.getElementById('language-select').value == "cpp") ? "c++" : document.getElementById('language-select').value;
    const testInputs = document.getElementById('testcases').value.trim().split("\n").map(line => JSON.parse(line));
    const code = editor.getValue();
    
    let testResults = "";

    const lang = await fetch("https://emkc.org/api/v2/piston/runtimes");
    const languages = await lang.json();
    const executionVersion = languages
        .filter(l => l.language === String(language))
        .map(l => l.version);

    let lastRun = 0;

    for (let i = 0; i < testInputs.length; i++) {
        console.log(`Test Inputs ${i}: ${String(testInputs[i])}`);
        try {
            
            let now = Date.now();
            let timeLength = now - lastRun;
            if (timeLength < 300) {
                await new Promise(resolve => setTimeout(resolve, 300 - timeLength));
            }
    
            lastRun = Date.now();

            const codeData = {
                language: language,
                version: String(executionVersion.sort().reverse()[0]),
                files: [{ name: "code", content: code }],
                stdin: String(testInputs[i]),
            };

            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(codeData),
            });

            const result = await response.json();
            console.log("Piston API Response:", result);
            let output = result.run.output;
            console.log("Piston API Response:", output, result.run.output, result.run.stdout);

            output = output.trim().replace(/\s+/g, ' ');
            if (output === "True") output = "true";
            if (output === "False") output = "false";
            
            testResults += `Test ${i + 1}.<br>Input: ${testInputs[i]}<br>Output: ${output}<br><br>`;
            
        } catch (error) {
            console.error('Error executing code:', error);
            testResults = `Test ${i + 1} Error: ${error.message}`;
            break;
        }
    }
    document.getElementById('test-results').innerHTML = testResults;
});