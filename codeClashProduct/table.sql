-- Postgre SQL

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(10) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE  -- Hidden test cases for evaluation
);

CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    user_id INT,  -- Link to users table if you have one
    language VARCHAR(50), -- E.g., Python, Java, C++
    code TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded')),
    error_message TEXT,  -- Stores errors if any
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
