-- MySQL
-- The table section

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    descriptions TEXT NOT NULL,
    example TEXT NOT NULL,
    difficulty VARCHAR(10) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE test_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,  -- Hidden test cases for evaluation
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE solutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    user_id INT,  -- Link to users table if you have one
    languages VARCHAR(50), -- E.g., Python, Java, C++
    code TEXT NOT NULL,
    statuses VARCHAR(20) CHECK (status IN ('Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded')),
    error_message TEXT,  -- Stores errors if any
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Inserting data into tables

-- Easy, Q20
INSERT INTO questions (title, descriptions, example, difficulty)
VALUES 
('Valid Parentheses',
 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: 1. Open brackets must be closed by the same type of brackets. 2. Open brackets must be closed in the correct order. 3. Every close bracket has a corresponding open bracket of the same type.',
 'Example 1: Input: s = "()" Output: true \n Example 2: Input: s = "()[]{}" Output: true \n Example 3: Input: s = "(]" Output: false \n Example 4: Input: s = "([])" Output: true',
 'Easy');

-- Inserting solution for question 1
INSERT INTO solutions (question_id, languages, code)
VALUES (1, 'Python', 'def isValid(s): stack = []; mapping = {")": "(", "}": "{", "]": "["}; for char in s: if char in mapping: top_element = stack.pop() if stack else "#" if mapping[char] != top_element else stack.append(char) return not stack');

-- Inserting test cases for question 1
INSERT INTO test_cases (question_id, input, expected_output) 
VALUES (1, '()', 'True'),
       (1, '()[]{}', 'True'),
       (1, '(]', 'False'),
       (1, '([)]', 'False');



-- Easy, Q70

-- Easy, Q724

-- Medium, Q3

-- Medium, Q11

-- Medium, Q63

-- Medium, Q1004

-- Medium, Q1456

-- Hard, Q42

-- Hard, Q1220


-- Querying data