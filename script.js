/*
Used in coding page for: code editor setup, code execution, test cases implementation
*/


// Editor init
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

let editor;
require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "",
        language: "python",
        theme: "vs-dark"
    });

    const params = new URLSearchParams(window.location.search);
    
    getTemplate({
        python: `class Solution:\n\tdef result(self, nums: {parameters}):\n\t\t# Write your code here\n`
    }, params.get("questionID"), "python").then(updatedTemplate => {
        if (editor) {
            editor.setValue(updatedTemplate);
        }
    }).catch(error => console.error("Error fetching template:", error));
});

// Templates for the execution
let execTemplates = {};

// Language change
document.getElementById('language-select').addEventListener('change', function (e) {
    const params = new URLSearchParams(window.location.search);
    const language = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), language);
    const templates = {
        python: `class Solution:\n\tdef result(self, nums: {parameters}):\n\t\t# Write your code here\n`,
        javascript: `class Solution {\n\tresult(nums) {\n\t\t// Write your code here\n\t}\n}`,
        cpp: `class Solution {\npublic:\n\t{return_type} result({parameters} nums) {\n\t// Write your code here\n\t}\n};`,
        java: 'class Solution {\n\t{return_type} result({parameters} nums) {\n\t\t// Write your code here\n\t}\n}',
        csharp: 'class Solution {\n\tpublic {return_type} Result({parameters} nums) {\n\t\t// Write your code here\n\t}\n}',
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
        if (data.error) {
            alert(data.error);
            return;
        }

            // Check if data contains expected fields
        if (!data.test_cases || !data.expected_output) {
            throw new Error("Missing test_cases or expected_output in response data.");
        }

        // Getting type of the input
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
                if (Array.isArray(testCases[0][0])) {
                    input_type = "2D Array";
                } else {
                    input_type = "Array";
                }
            } else if (typeof testCases[0] === "string") {
                input_type = "String";
            } else if (typeof testCases[0] === "boolean") {
                input_type = "Bool";
            } else if (typeof testCases[0] === "number") {
                input_type = Number.isInteger(testCases[0]) ? "Integer" : "Float";
            }
        }

        // Changing execution template for strictly typed languages
        execTemplates = {
            python: {
                prepend: "",
                append: `
import sys
import json
if __name__ == '__main__':
    input_data = sys.stdin.read().strip()
    try:
        parsed_input = json.loads(input_data)
    except json.JSONDecodeError:
        parsed_input = input_data
    solution = Solution()
    print(solution.result(parsed_input))
    `
            },
            javascript: {
                prepend: "",
                append: `
const fs = require('fs');
const inputText = fs.readFileSync(0, 'utf8').trim();
let input;
try {
    input = JSON.parse(inputText);
} catch (err) {
    input = inputText;
}
const solution = new Solution();
console.log(solution.result(input));
`
            },
            cpp: {
                prepend: `#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;
    `,
                append: input_type === "Array" ? `
int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.size() - 2);
    stringstream ss(input);
    string token;
    while (getline(ss, token, ',')) {
        nums.push_back(stoi(token));
    }
    Solution solution;
    cout << solution.result(nums) << endl;
    return 0;
}
` : input_type === "2D Array" ? `
int main() {
    string input;
    getline(cin, input);
    vector<vector<int>> nums;
    input = input.substr(1, input.size() - 2);  // Remove outer brackets
    stringstream ss(input);
    string token;
    while (getline(ss, token, ']')) {
        vector<int> row;
        token = token.substr(token.find('[') + 1);  // Remove opening bracket of row
        stringstream rowStream(token);
        string number;
        while (getline(rowStream, number, ',')) {
            row.push_back(stoi(number));
        }
        nums.push_back(row);
    }
    Solution solution;
    cout << solution.result(nums) << endl;
    return 0;
}
` : input_type === "Integer" ? `
int main() {
    int num;
    cin >> num;
    Solution solution;
    cout << solution.result(num) << endl;
    return 0;
}
` : input_type === "Float" ? `
int main() {
    double num;
    cin >> num;
    Solution solution;
    cout << solution.result(num) << endl;
    return 0;
}
` : input_type === "Bool" ? `
int main() {
    string input;
    getline(cin, input);
    bool value = (input == "true");
    Solution solution;
    cout << solution.result(value) << endl;
    return 0;
}
` : `
int main() {
    string input;
    getline(cin, input);
    Solution solution;
    cout << solution.result(input) << endl;
    return 0;
}
    `
            },
            java: {
                prepend: input_type === "Array" ? `
import java.util.*;
            
class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine().trim();
        input = input.substring(1, input.length() - 1);
        String[] parts = input.split(",");
        List<Integer> nums = new ArrayList<>();
        for (String part : parts) {
            nums.add(Integer.parseInt(part.trim()));
        }
        Solution solution = new Solution();
        System.out.println(solution.result(nums));
    }
}
` : input_type === "2D Array" ? `
import java.util.*;
            
class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine().trim();
        input = input.substring(1, input.length() - 1);  // Remove outer brackets
        String[] rows = input.split("],");
        List<List<Integer>> nums = new ArrayList<>();
        for (String row : rows) {
            row = row.replace("[", "").replace("]", "").trim();  // Clean up row brackets
            String[] parts = row.split(",");
            List<Integer> innerList = new ArrayList<>();
            for (String part : parts) {
                innerList.add(Integer.parseInt(part.trim()));
            }
            nums.add(innerList);
        }
        Solution solution = new Solution();
        System.out.println(solution.result(nums));
    }
}
` : input_type === "Integer" ? `
import java.util.*;
            
class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        Solution solution = new Solution();
        System.out.println(solution.result(num));
    }
}
` : input_type === "Float" ? `
import java.util.*;
            
class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double num = scanner.nextDouble();
        Solution solution = new Solution();
        System.out.println(solution.result(num));
    }
}
` : input_type === "Bool" ? `
import java.util.*;
            
class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean value = scanner.nextBoolean();
        Solution solution = new Solution();
        System.out.println(solution.result(value));
    }
}
` : `
import java.util.*;
            
class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine().trim();
        Solution solution = new Solution();
        System.out.println(solution.result(input));
    }
}
            `,
            
                append: ""
            },
            csharp: {
                prepend: `using System;
using System.Collections.Generic;
    `,
                append: input_type === "Array" ? `
class Program {
    static void Main() {
        string input = Console.ReadLine().Trim();
        input = input.Trim('[', ']');
        var parts = input.Split(',');
        List<int> nums = new List<int>();
        foreach (var part in parts) {
            nums.Add(int.Parse(part.Trim()));
        }
        Solution solution = new Solution();
        Console.WriteLine(solution.Result(nums));
    }
}
` : input_type === "2D Array" ? `
    class Program {
        static void Main() {
            string input = Console.ReadLine().Trim();
            input = input.Trim('[', ']');  // Remove outer brackets
            var rows = input.Split("],");
            List<List<int>> nums = new List<List<int>>();
            foreach (var row in rows) {
                var cleanedRow = row.Replace("[", "").Replace("]", "").Trim();  // Clean up row brackets
                var parts = cleanedRow.Split(',');
                List<int> innerList = new List<int>();
                foreach (var part in parts) {
                    innerList.Add(int.Parse(part.Trim()));
                }
                nums.Add(innerList);
            }
            Solution solution = new Solution();
            Console.WriteLine(solution.Result(nums));
        }
    }
` : input_type === "Integer" ? `
class Program {
    static void Main() {
        int num = int.Parse(Console.ReadLine().Trim());
        Solution solution = new Solution();
        Console.WriteLine(solution.Result(num));
    }
}
` : input_type === "Float" ? `
class Program {
    static void Main() {
        double num = double.Parse(Console.ReadLine().Trim());
        Solution solution = new Solution();
        Console.WriteLine(solution.Result(num));
    }
}
` : input_type === "Bool" ? `
class Program {
    static void Main() {
        bool value = bool.Parse(Console.ReadLine().Trim());
        Solution solution = new Solution();
        Console.WriteLine(solution.Result(value));
    }
}
` : `
class Program {
    static void Main() {
        string input = Console.ReadLine().Trim();
        Solution solution = new Solution();
        Console.WriteLine(solution.Result(input));
    }
}
    `
            }
        };

        // Getting type of the output
        let expectedOutput = [];
        try {
            expectedOutput = JSON.parse(data.expected_output);
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
        }

    } catch(error) {
        console.error("Error fetching or processing data for data_type:", error);
        alert("Something went wrong. Please try again later.");
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
            },
            "Integer": {
                python: "int",
                javascript: "number",
                cpp: "int",
                java: "int",
                csharp: "int",
            },
            "Bool": {
                python: "bool",
                javascript: "boolean",
                cpp: "bool",
                java: "boolean",
                csharp: "bool",
            },
            "Array": {
                python: "list",
                javascript: "Array",
                cpp: "std::vector<int>",
                java: "List<int>",
                csharp: "List<int>",
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
            },
            "Integer": {
                python: "int",
                javascript: "number",
                cpp: "int",
                java: "int",
                csharp: "int",
            },
            "Bool": {
                python: "bool",
                javascript: "boolean",
                cpp: "bool",
                java: "boolean",
                csharp: "bool",
            },
            "Array": {
                python: "list",
                javascript: "Array",
                cpp: "std::vector<int>",
                java: "List<int>",
                csharp: "List<int>",
            },
            "2D Array": {
                python: "list[list[int]]",
                javascript: "Array<Array<number>>",
                cpp: "std::vector<std::vector<int>>",
                java: "List<List<Integer>>",
                csharp: "List<List<int>>",
            }
        };

        return typeMapping[inputType]?.[language] || "void"; // Default to "void" if type not found
    }
    
    template = template.replace("{parameters}", getParameters(language, input_type));
    template = template.replace("{return_type}", getReturnType(language, output_type));  // Default for statically typed languages 

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
    document.getElementById('test-results').innerHTML = "Executing the code...";

    const language = (document.getElementById('language-select').value == "cpp") ? "c++" : document.getElementById('language-select').value;
    const code = editor.getValue();
    const finalCode = (execTemplates[document.getElementById('language-select').value].prepend || "") + code + execTemplates[document.getElementById('language-select').value].append;
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
                files: [{ name: "code", content: finalCode }],
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
            let output = result.run.output;

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
            .then(response => response.json())  // Process the response
            .then(data => console.log("Server Response:", data))  // Log it
            .catch(error => console.error("Fetch error:", error));

            console.log(JSON.stringify({ userID: userId, questionID: questionId, attempts: attempt }));
            alert("Congrats, question solved successfully!");
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
    document.getElementById('test-results').innerHTML = "Executing the code...";
    
    let language;
    let testInputs;
    let testResults = "";
    
    const code = editor.getValue();
    const finalCode = (execTemplates[document.getElementById('language-select').value].prepend || "") + code + execTemplates[document.getElementById('language-select').value].append;

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
                    files: [{ name: "code", content: finalCode }],
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
                let output = result.run.output;
    
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
