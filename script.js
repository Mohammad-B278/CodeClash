
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
    const params = new URLSearchParams(window.location.search);
    const language = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), language);
    const templates = {
        python: `class Solution:\n\tdef result(self, nums: {parameters}):\n\t\t# Write your code here\n\t\tpass`,
        javascript: `class Solution {\n\tresult(nums) {\n\t\t// Write your code here\n\t}\n}`,
        cpp: `class Solution {\npublic:\n\t{return_type} result({parameters} nums) {\n\t// Write your code here\n\t\t}\n};`,
        java: 'class Solution {\n\t{return_type} result({parameters} nums) {\n\t\t// Write your code here\n\t}\n}',
        csharp: 'class Solution {\n\tpublic {return_type} Result({parameters} nums) {\n\t\t// Write your code here\n\t}\n}',
        rust: '\n\nstruct Solution;\ninput_typel Solution {\n\tfn result(&self, nums: {parameters}) {\n\t\t// Write your code here\n\t}\n}'
    };
    getTemplate(templates, params.get("questionID"), language).then(updatedTemplate => {
        editor.setValue(updatedTemplate);
    });
});

async function getTemplate(languageTemplates, questionId, language) {
    let template = languageTemplates[language];
    // fetch logic
    let input_type = '';
    let output_type = '';
    try {
        // Fetching test case data from the server
        const response = await fetch(`fetch_question.php?questionID=${questionId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch question. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw response data:", data); 
        if (data.error) {
            alert(data.error);
            return;
        }

            // Check if data contains expected fields
        if (!data.test_cases || !data.expected_output) {
            throw new Error("Missing test_cases or expected_output in response data.");
        }

        //get type of input
        let testCases = [];
        try {
            console.log("Attempting to parse test cases...");
            testCases = JSON.parse(data.test_cases);
            console.log("Raw test_cases data:", data.test_cases)
        } catch (error) {
            console.error("Error parsing test cases:", error);
            testCases = [];
        }

        if (testCases.length > 0 && testCases[0] !== undefined) {
            if (Array.isArray(testCases[0])) {
                input_type = "Array";
            } else if (typeof testCases[0] === "string") {
                input_type = "String";
            } else if (typeof testCases[0] === "boolean") {
                input_type = "Bool";
            } else if (typeof testCases[0] === "number") {
                input_type = Number.isInteger(testCases[0]) ? "Integer" : "Float";
            }
        }
        
        console.log("Determined input_type:", input_type);


        //get type of output
        let expectedOutput = [];
        try {
            expectedOutput = JSON.parse(data.expected_output);
            console.log("Raw expected_output data:", data.expected_output);
        } catch (error) {
            console.error("Error parsing expected_output:", error);
            expectedOutput = [];
        }



        if (Array.isArray(expectedOutput[0])) {
            output_type = 'Array';
        } else if (typeof expectedOutput[0] === 'string') {
            output_type = 'String';
        } else if (typeof expectedOutput[0] === 'boolean') {
            output_type = 'Bool';
        } else if (typeof expectedOutput[0] === 'number') {
            output_type = Number.isInteger(expectedOutput[0]) ? "Integer" : "Float";       
        } else {
            output_type = 'Unknown Type';
            console.log('Type: ', typeof expectedOutput[0]);
        }

        console.log("Determined output_type:", output_type);

    } catch(error) {
        console.error("Error fetching or processing data for data_type:", error);
        alert("Something went wrong. Please try again later.");
    } finally {
        console.log("Before calling getParameters and getReturnType...");
        console.log("outputType before getReturnType:", output_type);
        console.log("inputType before getParameters:", input_type);
    }




    // Function to get return type based on language
    function getReturnType(language, outputType) {
        const typeMapping = {
            "String": {
                python: "str",
                javascript: "string",
                cpp: "std::string",
                java: "String",
                csharp: "string",
                rust: "String",
            },
            "Integer": {
                python: "int",
                javascript: "number",
                cpp: "int",
                java: "int",
                csharp: "int",
                rust: "i32",
            },
            "Bool": {
                python: "bool",
                javascript: "boolean",
                cpp: "bool",
                java: "boolean",
                csharp: "bool",
                rust: "bool",
            },
            "Array": {
                python: "List",
                javascript: "Array",
                cpp: "std::vector<>",
                java: "List<>",
                csharp: "List<>",
                rust: "Vec<>",
            }
        };

        return typeMapping[outputType]?.[language] || "void"; // Default to "void" if type not found
    }

    // Function to get input type based on language
    function getParameters(language, inputType) {
        const typeMapping = {
            "String": {
                python: "str",
                javascript: "string",
                cpp: "std::string",
                java: "String",
                csharp: "string",
                rust: "&String",
            },
            "Integer": {
                python: "int",
                javascript: "number",
                cpp: "int",
                java: "int",
                csharp: "int",
                rust: "i32",
            },
            "Bool": {
                python: "bool",
                javascript: "boolean",
                cpp: "bool",
                java: "boolean",
                csharp: "bool",
                rust: "bool",
            },
            "Array": {
                python: "List",
                javascript: "Array",
                cpp: "std::vector<>",
                java: "List<>",
                csharp: "List<>",
                rust: "&[i32]",
            }
        };

        return typeMapping[inputType]?.[language] || "void"; // Default to "void" if type not found
    }

    console.log("Before using output_type:", output_type);
    console.log("Before using input_type:", input_type);

    console.log("Language:", language);
    console.log("Template before replacement:", template);

    console.log("Parameters:", getParameters(language, input_type));
    console.log("Return Type:", getReturnType(language, output_type));

    
    template = template.replace("{parameters}", getParameters(language, input_type));
    template = template.replace("{return_type}", getReturnType(language, output_type));  // Default for statically typed languages 
    console.log("Template after replacement:", template);

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

let attempt = 0;
let isRunning = false;

//Running code
document.getElementById('run-code').addEventListener('click', async function () {
    if (isRunning) return alert("Please wait for the previous execution to finish");
    isRunning = true;

    const language = (document.getElementById('language-select').value == "cpp") ? "c++" : document.getElementById('language-select').value;
    const code = editor.getValue();
    let success = false;
    attempt += 1;

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
        const userId = await getUserID(); // Fetching user ID
        if (userId) {

            console.log("User ID:", userId);
            await fetch('solved.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: userId, questionID: questionId, attempts: attempt })
            })
            .then(response => response.json())  // <-- Process the response
            .then(data => console.log("Server Response:", data))  // <-- Log it
            .catch(error => console.error("Fetch error:", error));

            console.log(JSON.stringify({ userID: userId, questionID: questionId, attempts: attempt }));
            alert("Progress saved");
        } else {
            alert("Something clearly went wrong");
        }
        attempt = 0;
    }
    isRunning = false;
});

// Testcase code
document.getElementById('run-tests').addEventListener('click', async function () {
    if (isRunning) return alert("Please wait for the previous execution to finish");
    isRunning = true;
    
    let language;
    let testInputs;
    let testResults = "";
    
    const code = editor.getValue();

    try {
        language = document.getElementById('language-select').value;
        language = (language === "cpp") ? "c++" : language;

        const rawInput = document.getElementById('testcases').value.trim();
        if (!rawInput) throw new Error("Testcases are empty");

        try {
            testInputs = JSON.parse(rawInput);
            if (!Array.isArray(testInputs)) throw new Error("Test cases must be a valid JSON array!");
        } catch {
            throw new Error("Invalid format, please enter a valid array of testcases");
        }

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
                    stdin: JSON.stringify(testInputs[i]),
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
    } finally {
        document.getElementById('test-results').innerHTML = testResults || "Execution stopped due to an error - invalid testcases format or no testcases provided";
        isRunning = false;
    }
});