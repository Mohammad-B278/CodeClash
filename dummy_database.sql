-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 08, 2025 at 10:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `2024_comp10120_cm13`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `achievementID` int(11) NOT NULL,
  `achievement_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`achievementID`, `achievement_name`) VALUES
(1, 'Won a pvp game'),
(2, 'Solved a problem'),
(3, 'Won 3 pvp games'),
(4, 'Solved 3 problems'),
(5, 'Won 5 pvp games'),
(6, 'Solved 5 problems'),
(7, 'Won 10 pvp games'),
(8, 'Solved 10 problems'),
(9, 'Won 20 pvp games'),
(10, 'Solved 20 problems');

-- --------------------------------------------------------

--
-- Table structure for table `performance`
--

CREATE TABLE `performance` (
  `performanceID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `leaderboard_problems` int(11) NOT NULL DEFAULT 0,
  `leaderboard_wins` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `performance`
--

INSERT INTO `performance` (`performanceID`, `userID`, `leaderboard_problems`, `leaderboard_wins`) VALUES
(1, 1, 1, 0),
(2, 2, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `questionID` int(11) NOT NULL,
  `title` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `example` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `difficulty` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `test_cases` varchar(10000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `expected_output` varchar(10000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `topics` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`questionID`, `title`, `description`, `example`, `difficulty`, `test_cases`, `expected_output`, `topics`) VALUES
(1, 'Rain Water', 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 'Example 1:\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n\nExplanation: The above elevation map (black section) is represented by array\n[0,1,0,2,1,0,1,3,2,1,2,1].\nIn this case, 6 units of rain water (blue section) are being trapped.\n\nExample 2:\nInput: height = [4,2,0,3,2,5]\nOutput: 9', 'Hard', '[[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], [1, 1, 1, 1, 1], [8, 10, 3, 2, 12, 4, 5, 7, 20, 25, 78, 1000, 1, 3, 5], [5], [4, 2], [1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [3, 0, 3], [5, 2, 0, 2, 1, 3, 1, 4], [100, 0, 50, 0, 100, 0, 50, 100, 0, 100]]', '[6, 0, 41, 0, 0, 0, 0, 3, 15, 500]', 'Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack'),
(2, 'Vowels Permutation', 'Given an integer n, your task is to count how many strings of length n can be formed under the following rules:\r\nEach character is a lower case vowel (\'a\', \'e\', \'i\', \'o\', \'u\')\r\nEach vowel \'a\' may only be followed by an \'e\'.\r\nEach vowel \'e\' may only be followed by an \'a\' or an \'i\'.\r\nEach vowel \'i\' may not be followed by another \'i\'.\r\nEach vowel \'o\' may only be followed by an \'i\' or a \'u\'.\r\nEach vowel \'u\' may only be followed by an \'a\'.\r\nSince the answer may be too large, return it modulo 10^9 + 7.', 'Example 1:\nInput: n = 1\nOutput: 5\n\nExplanation: All possible strings are: \"a\", \"e\", \"i\" , \"o\" and \"u\".\n\nExample 2:\nInput: n = 2\nOutput: 10\n\nExplanation: All possible strings are: \"ae\", \"ea\", \"ei\", \"ie\", \"ia\", \"io\", \"iu\",\n\"oi\", \"ou\" and \"ua\".\n\nExample 3: \nInput: n = 5\nOutput: 68', 'Hard', '[1, 2, 3, 4, 10, 100, 20000, 5, 6, 7]', '[5, 10, 19, 35, 1739, 173981881, 759959057, 68, 129, 249]', 'Dynamic Programming'),
(3, 'Longest Substring Without Repeating Characters', 'Given a string s, find the length of the longest \r\nsubstring\r\n without repeating characters.', 'Example 1:\nInput: s = \"abcabccc\"\nOutput: 3\n\nExplanation: The answer is \"abc\", with the length of 3.\n\nExample 2:\n\nInput: s = \"aaaaa\"\nOutput: 1\n\nExplanation: The answer is \"a\", with the length of 1.\n\nExample 3:\n\nInput: s = \"poowkew\"\nOutput: 4\n\nExplanation: The answer is \"owke\", with the length of 3.\n\nNotice that the answer must be a substring, \"powke\" is a subsequence and\nnot a substring.', 'Medium', '[\"abcabcbb\", \"abcdef\", \"aaaaaa\", \"\", \"x\", \"pwwkew\", \"abcddee\", \"123abcdabc\", \"@!@!abc\", \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"]', '[3, 6, 1, 0, 1, 3, 4, 7, 5, 1]', 'Hash Table, String, Sliding Window'),
(4, 'Container With Most Water', 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\r\n\r\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\r\n\r\nReturn the maximum amount of water a container can store.\r\n\r\nNotice that you may not slant the container.', 'Example 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\n\nExplanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7].\nIn this case, the max area of water (blue section) the container can contain is 49.\n\nExample 2:\nInput: height = [1,1]\nOutput: 1', 'Medium', '[[1, 8, 6, 2, 5, 4, 8, 3, 7], [1, 2], [5, 5, 5, 5, 5], [1, 2, 3, 4, 5, 6, 7, 8, 9], [9, 8, 7, 6, 5, 4, 3, 2, 1], [1, 2, 4, 8, 4, 2, 1], [1000, 1, 1000], [1, 100, 1, 1, 1], [3, 1, 2, 4, 5, 1, 6, 7, 8, 2], [1, 2, 3, 4, 1000, 10000]]', '[49, 1, 20, 20, 20, 8, 2000, 4, 24, 1000]', 'Array, Two Pointers, Greedy'),
(5, 'Unique Paths', 'You are given an m x n integer array grid. There is a robot initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.\r\n\r\nAn obstacle and space are marked as 1 or 0 respectively in grid. A path that the robot takes cannot include any square that is an obstacle.\r\n\r\nReturn the number of possible unique paths that the robot can take to reach the bottom-right corner.\r\n\r\nThe testcases are generated so that the answer will be less than or equal to 2 * 109', 'Example 1:\nInput: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]\nOutput: 2\n\nExplanation: There is one obstacle in the middle of the 3x3 grid above.\nThere are two ways to reach the bottom-right corner:\n1. Right -> Right -> Down -> Down\n2. Down -> Down -> Right -> Right\n\nExample 2:\nInput: obstacleGrid = [[0,1],[0,0]]\nOutput: 1', 'Medium', '[[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 1], [0, 0]], [[1, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 1]], [[0, 0, 0, 0, 0]], [[0], [0], [0], [0], [0]], [[0, 0, 1, 0, 0]], [[0, 0, 1], [1, 0, 0]], [[0, 0, 0], [0, 1, 0], [0, 0, 0]], [[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]]]', '[6, 1, 0, 0, 1, 1, 0, 1, 2, 1]', 'Array, Dynamic Programming, Matrix'),
(6, 'Find Minimum in Rotated Sorted Array', 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n\n● [4,5,6,7,0,1,2] if it was rotated 4 times.\n● [0,1,2,4,5,6,7] if it was rotated 7 times.\n\nNotice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].\nGiven the sorted array nums of unique elements, return the minimum element of this array IN O(LOG N) TIME.', 'Example 1:\nInput: nums = [3,4,5,1,2]\nOutput: 1\nExplanation: The original array was [1,2,3,4,5] rotated 3 times.\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2]\nOutput: 0\nExplanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.\n\nExample 3:\nInput: nums = [11,13,15,17]\nOutput: 11\nExplanation: The original array was [11,13,15,17] and it was rotated 4 times.', 'Medium', '[[3, 4, 5, 1, 2], [4, 5, 6, 7, 0, 1, 2], [11, 13, 15, 17], [2, 3, 4, 5, 6, 7, 8, 9, 10, 1], [1], [1000, 2000, 3000, 4000, 5000, 100, 200, 300, 400, 500, 600, 700, 800, 900], [-4000, -3000, -2000, -1000, -500, -100, -50, -25, -10, -9, -8, -7, -6, -5, -4, -3, -2, 1], [50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 1, 100, 200, 500, 1000, 1500, 2000], [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000], [9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 1, 2, 3, 4, 5, 6, 7, 8]]', '[1, 0, 11, 1, 1, 100, -4000, 1, 0, 1]', 'Array, Binary Search'),
(7, 'Longest Subarray of 1\'s After Deleting One Element', 'Given a binary array nums, you should delete one element from it.\n\nReturn the size of the longest non-empty subarray containing only 1\'s in the resulting array. Return 0 if there is no such subarray.', 'Example 1:\nInput: nums = [1,1,0,1]\nOutput: 3\nExplanation: After deleting the number in position 2, [1,1,1] contains 3 numbers with\nvalue of 1\'s.\n\nExample 2:\nInput: nums = [0,1,1,1,0,1,1,0,1]\nOutput: 5\nExplanation: After deleting the number in position 4, [0,1,1,1,1,1,0,1] longest\nsubarray with value of 1\'s is [1,1,1,1,1].\n\nExample 3:\nInput: nums = [1,1,1]\nOutput: 2\nExplanation: You must delete one element.', 'Medium', '[[1], [0,1,1,1,0,0,1,1,0,1] , [0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1, 1], [0, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]]', '[0, 3, 0, 2, 5, 10, 6, 5, 5, 1010]', 'Array, Dynamic Programming, Sliding Window'),
(8, 'Valid Parentheses', 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: 1. Open brackets must be closed by the same type of brackets. 2. Open brackets must be closed in the correct order. 3. Every close bracket has a corresponding open bracket of the same type.', 'Example 1: \nInput: s = \"()\"\nOutput: true\n\nExample 2: \nInput: s = \"()[]{}\"\nOutput: true\n\nExample 3: \nInput: s = \"(]\"\nOutput: false\n\nExample 4: \nInput: s = \"([])\"\nOutput: true', 'Easy', '[\"()\", \"([])\", \"{[()]}\", \"([)]\", \"(\", \"([])\", \"[({})]\", \"(\", \"[[\", \"]})\"]', '[true, true, true, false, false, true, true, false, false, false]', 'String, Stack'),
(9, 'Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top.\r\n\r\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?', 'Example 1:\nInput: n = 2\nOutput: 2\n\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps\n\nExample 2:\nInput: n = 3\nOutput: 3\n\nExplanation: There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step', 'Easy', '[2, 1, 3, 4, 5, 10, 6, 20, 33, 45]', '[2, 1, 3, 5, 8, 89, 13, 10946, 5702887, 1836311903]', 'Math, Dynamic Programming, Memoization'),
(10, 'Find Pivot Index', 'Given an array of integers nums, calculate the pivot index of this array.\r\n\r\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index\'s right.\r\n\r\nIf the index is on the left edge of the array, then the left sum is 0 because there are no elements to the left. This also applies to the right edge of the array.\r\n\r\nReturn the leftmost pivot index. If no such index exists, return -1.', 'Example 1:\nInput: nums = [1,7,3,6,5,6]\nOutput: 3\n\nExplanation:\nThe pivot index is 3.\nLeft sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11\nRight sum = nums[4] + nums[5] = 5 + 6 = 11\n\nExample 2:\nInput: nums = [1,2,3]\nOutput: -1\n\nExplanation:\nThere is no index that satisfies the conditions in the problem statement.\n\nExample 3:\nInput: nums = [2,1,-1]\nOutput: 0\n\nExplanation:\nThe pivot index is 0.\nLeft sum = 0 (no elements to the left of index 0)\nRight sum = nums[1] + nums[2] = 1 + -1 = 0', 'Easy', '[[1, 7, 3, 6, 5, 6], [1, 2, 3], [10], [1, 1], [1, 1, 1, 1, 1], [-1000, 0, 1000], [1, 2, 3, 4, 5], [-1, -1, -1, -1, -1], [0, 0, 1], [1, 2, 3, 4, 5, 6]]', '[3, -1, 0, -1, 2, -1, -1, 2, 2, -1]', 'Array, Prefix Sum');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `first_name` text DEFAULT NULL,
  `surname` text DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `num_problems_solved` int(11) NOT NULL DEFAULT 0,
  `num_wins` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `first_name`, `surname`, `username`, `password`, `email`, `num_problems_solved`, `num_wins`) VALUES
(1, 'Tester', 'Bob', 'DevTester', '$2y$10$GI5.c0zlCPpl4DL1PzxO5OwRQ7NKql9Q3U2YVHHVlFGGLJx1dcHnm', 'devtestmail@test.com', 1, 0),
(2, 'Tester', 'BoB', 'DevTester_1', '$2y$10$uG1sIRjWmov/CYgXdt47U.YQ6WyCPS3LDrkilkKyzY13k.mUs/Rvu', 'devtestmail1@test.com', 2, 3);

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `after_user_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    INSERT INTO performance (userID, leaderboard_problems, leaderboard_wins) 
    VALUES (NEW.userID, 0, 0);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_user_update` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
    IF OLD.num_problems_solved <> NEW.num_problems_solved THEN
        UPDATE performance 
        SET leaderboard_problems = NEW.num_problems_solved
        WHERE userID = NEW.userID;
    END IF;
    IF OLD.num_wins <> NEW.num_wins THEN
        UPDATE performance 
        SET leaderboard_wins = NEW.num_wins
        WHERE userID = NEW.userID;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `user_achievementID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `achievementID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_achievements`
--

INSERT INTO `user_achievements` (`user_achievementID`, `userID`, `achievementID`) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 2, 2),
(4, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_questions`
--

CREATE TABLE `user_questions` (
  `user_questionID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `questionID` int(11) DEFAULT NULL,
  `attempts` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_questions`
--

INSERT INTO `user_questions` (`user_questionID`, `userID`, `questionID`, `attempts`) VALUES
(1, 1, 1, 2),
(2, 2, 1, 1),
(3, 2, 10, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`achievementID`);

--
-- Indexes for table `performance`
--
ALTER TABLE `performance`
  ADD PRIMARY KEY (`performanceID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`questionID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`user_achievementID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `achievementID` (`achievementID`);

--
-- Indexes for table `user_questions`
--
ALTER TABLE `user_questions`
  ADD PRIMARY KEY (`user_questionID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `questionID` (`questionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `performance`
--
ALTER TABLE `performance`
  MODIFY `performanceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `questionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `user_achievementID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `user_questions`
--
ALTER TABLE `user_questions`
  MODIFY `user_questionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `performance`
--
ALTER TABLE `performance`
  ADD CONSTRAINT `performance_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievementID`) REFERENCES `achievements` (`achievementID`);

--
-- Constraints for table `user_questions`
--
ALTER TABLE `user_questions`
  ADD CONSTRAINT `user_questions_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `user_questions_ibfk_2` FOREIGN KEY (`questionID`) REFERENCES `questions` (`questionID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
