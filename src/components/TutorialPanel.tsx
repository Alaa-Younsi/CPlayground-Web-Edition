import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Code } from 'lucide-react';
import type { User as UserType } from '../Types';

interface TutorialPanelProps {
  username: string;
  onBack: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const TutorialPanel: React.FC<TutorialPanelProps> = ({ username, onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<'basics' | 'pointers' | 'data-structures' | 'quiz' | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>(Array(5).fill(-1));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCodeExample, setShowCodeExample] = useState<string>('');

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Which function prints to stdout in C?",
      options: ["printf", "print", "cout", "System.out.println"],
      correctAnswer: 0,
      explanation: "The printf() function is used to print formatted output to stdout in C."
    },
    {
      id: 2,
      question: "Which operator is used to get a variable's address?",
      options: ["*", "&", "->", "."],
      correctAnswer: 1,
      explanation: "The & operator returns the memory address of a variable."
    },
    {
      id: 3,
      question: "Which header file is required for dynamic memory allocation?",
      options: ["stdio.h", "stdlib.h", "string.h", "math.h"],
      correctAnswer: 1,
      explanation: "stdlib.h contains declarations for malloc(), calloc(), free(), etc."
    },
    {
      id: 4,
      question: "Which loop checks condition at the end?",
      options: ["while", "for", "do-while", "repeat-until"],
      correctAnswer: 2,
      explanation: "do-while loop executes the code block once before checking the condition."
    },
    {
      id: 5,
      question: "What is the base index for arrays in C?",
      options: ["0", "1", "-1", "It depends"],
      correctAnswer: 0,
      explanation: "C arrays are zero-indexed - the first element is at index 0."
    }
  ];

  const codeExamples = {
    basics: `#include <stdio.h>

int main() {
    // Variable declaration
    int number = 42;
    float pi = 3.14159;
    char letter = 'A';
    
    // Printing values
    printf("Number: %d\\n", number);
    printf("Pi: %.2f\\n", pi);
    printf("Letter: %c\\n", letter);
    
    // Taking input
    int age;
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("You are %d years old\\n", age);
    
    return 0;
}`,

    pointers: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int x = 10;
    int *ptr = &x;  // ptr stores address of x
    
    printf("Value of x: %d\\n", x);
    printf("Address of x: %p\\n", &x);
    printf("Value of ptr: %p\\n", ptr);
    printf("Value at ptr: %d\\n", *ptr);  // Dereferencing
    
    // Dynamic memory allocation
    int *arr = (int*)malloc(5 * sizeof(int));
    if (arr != NULL) {
        for (int i = 0; i < 5; i++) {
            arr[i] = i * 10;
            printf("arr[%d] = %d\\n", i, arr[i]);
        }
        free(arr);  // Always free allocated memory
    }
    
    return 0;
}`,

    dataStructures: `#include <stdio.h>
#include <stdlib.h>

// Node for linked list
struct Node {
    int data;
    struct Node* next;
};

// Stack structure
struct Stack {
    int top;
    unsigned capacity;
    int* array;
};

// Create a new node
struct Node* createNode(int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

// Create a stack
struct Stack* createStack(unsigned capacity) {
    struct Stack* stack = (struct Stack*)malloc(sizeof(struct Stack));
    stack->capacity = capacity;
    stack->top = -1;
    stack->array = (int*)malloc(stack->capacity * sizeof(int));
    return stack;
}

int main() {
    // Linked list example
    struct Node* head = createNode(1);
    head->next = createNode(2);
    head->next->next = createNode(3);
    
    // Stack example
    struct Stack* stack = createStack(100);
    
    return 0;
}`
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correctAnswers = quizAnswers.reduce((count, answer, index) => {
      return answer === quizQuestions[index].correctAnswer ? count + 1 : count;
    }, 0);

    if (correctAnswers > 0) {
      // Update user stats
      const users = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
      const userIndex = users.findIndex((u: UserType) => u.username === username);
      if (userIndex !== -1) {
        users[userIndex].quizzes++;
        localStorage.setItem('cplayground_users', JSON.stringify(users));
      }
    }
  };

  const handleQuizReset = () => {
    setQuizAnswers(Array(5).fill(-1));
    setQuizSubmitted(false);
  };

  const renderTopicContent = () => {
    switch (selectedTopic) {
      case 'basics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">C Language Basics</h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">📝 Variables and Data Types</h3>
                <p className="text-gray-300">
                  C provides several basic data types:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-300">
                  <li><code className="bg-gray-900 px-1 rounded">int</code> - integers</li>
                  <li><code className="bg-gray-900 px-1 rounded">float</code> - floating point numbers</li>
                  <li><code className="bg-gray-900 px-1 rounded">double</code> - double precision floating point</li>
                  <li><code className="bg-gray-900 px-1 rounded">char</code> - single character</li>
                  <li><code className="bg-gray-900 px-1 rounded">void</code> - no value</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🖨️ Input/Output</h3>
                <p className="text-gray-300">
                  Use <code className="bg-gray-900 px-1 rounded">printf()</code> for output and 
                  <code className="bg-gray-900 px-1 rounded ml-1">scanf()</code> for input.
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🔁 Control Structures</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li><strong>if-else</strong> - conditional execution</li>
                  <li><strong>for</strong> - counting loop</li>
                  <li><strong>while</strong> - condition-checked loop</li>
                  <li><strong>do-while</strong> - execute-then-check loop</li>
                  <li><strong>switch</strong> - multi-way branch</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'pointers':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">Pointers and Memory</h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">📍 What are Pointers?</h3>
                <p className="text-gray-300">
                  Pointers are variables that store memory addresses. They're powerful but must be used carefully.
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🔑 Key Operators</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    <code className="bg-gray-900 px-1 rounded">&</code> - Address-of operator
                    <p className="ml-4 text-sm">Gets the memory address of a variable</p>
                  </li>
                  <li>
                    <code className="bg-gray-900 px-1 rounded">*</code> - Dereference operator
                    <p className="ml-4 text-sm">Accesses the value at a memory address</p>
                  </li>
                  <li>
                    <code className="bg-gray-900 px-1 rounded">-&gt;</code> - Structure pointer operator
                    <p className="ml-4 text-sm">Accesses structure members through pointers</p>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">💾 Dynamic Memory</h3>
                <p className="text-gray-300 mb-2">Functions from stdlib.h:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li><code className="bg-gray-900 px-1 rounded">malloc()</code> - Allocates memory</li>
                  <li><code className="bg-gray-900 px-1 rounded">calloc()</code> - Allocates and zeros memory</li>
                  <li><code className="bg-gray-900 px-1 rounded">realloc()</code> - Resizes allocated memory</li>
                  <li><code className="bg-gray-900 px-1 rounded">free()</code> - Frees allocated memory</li>
                </ul>
                <p className="text-red-400 mt-2">⚠️ Always free allocated memory to prevent leaks!</p>
              </div>
            </div>
          </div>
        );

      case 'data-structures':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-400">Data Structures in C</h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🏗️ Arrays</h3>
                <p className="text-gray-300">
                  Fixed-size collection of elements of the same type, stored in contiguous memory.
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🔗 Linked Lists</h3>
                <p className="text-gray-300">
                  Dynamic collection of nodes where each node contains data and a pointer to the next node.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-300">
                  <li><strong>Singly Linked List</strong> - One direction traversal</li>
                  <li><strong>Doubly Linked List</strong> - Bidirectional traversal</li>
                  <li><strong>Circular Linked List</strong> - Last node points to first</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">📚 Stacks and Queues</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    <strong>Stack</strong> - LIFO (Last In, First Out)
                    <p className="ml-4 text-sm">Operations: push(), pop(), peek()</p>
                  </li>
                  <li>
                    <strong>Queue</strong> - FIFO (First In, First Out)
                    <p className="ml-4 text-sm">Operations: enqueue(), dequeue(), front()</p>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🌳 Trees and Graphs</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li><strong>Binary Tree</strong> - Each node has at most 2 children</li>
                  <li><strong>Binary Search Tree</strong> - Ordered binary tree</li>
                  <li><strong>Graph</strong> - Collection of nodes and edges</li>
                  <li><strong>Hash Table</strong> - Key-value pairs with fast access</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-400">C Programming Quiz</h2>
            <p className="text-gray-300">Test your knowledge with these 5 questions about C programming!</p>
            
            <div className="space-y-6">
              {quizQuestions.map((question, index) => (
                <div key={question.id} className="bg-gray-800/50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">
                    Q{index + 1}: {question.question}
                  </h3>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-3 rounded cursor-pointer ${
                          quizAnswers[index] === optIndex
                            ? 'bg-blue-900/50 border border-blue-700'
                            : 'bg-gray-900/50 hover:bg-gray-800/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optIndex}
                          checked={quizAnswers[index] === optIndex}
                          onChange={() => {
                            const newAnswers = [...quizAnswers];
                            newAnswers[index] = optIndex;
                            setQuizAnswers(newAnswers);
                          }}
                          className="mr-3"
                          disabled={quizSubmitted}
                        />
                        <span>{option}</span>
                        
                        {quizSubmitted && (
                          <span className="ml-auto">
                            {optIndex === question.correctAnswer ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : quizAnswers[index] === optIndex ? (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            ) : null}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  
                  {quizSubmitted && (
                    <div className="mt-4 p-3 bg-gray-900/50 rounded">
                      <p className="text-sm text-gray-300">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex gap-4">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded font-semibold"
                    disabled={quizAnswers.includes(-1)}
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleQuizReset}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
                  >
                    Try Again
                  </button>
                )}
                
                {quizSubmitted && (
                  <div className="flex-1 p-4 bg-gray-800 rounded">
                    <p className="text-lg">
                      Score: <span className="font-bold">
                        {quizAnswers.filter((answer, idx) => 
                          answer === quizQuestions[idx].correctAnswer
                        ).length} / 5
                      </span>
                    </p>
                    {quizAnswers.filter((answer, idx) => 
                      answer === quizQuestions[idx].correctAnswer
                    ).length >= 4 ? (
                      <p className="text-green-400 mt-2">Excellent work! 🎉</p>
                    ) : (
                      <p className="text-yellow-400 mt-2">Keep learning! Review the tutorials 📚</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-3xl font-bold font-mono">📚 Learn C</h1>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-gray-400">Student: {username}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">📖 Topics</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTopic('basics')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedTopic === 'basics'
                      ? 'bg-blue-900/50 border border-blue-700 text-blue-300'
                      : 'bg-gray-900/50 hover:bg-gray-800/50'
                  }`}
                >
                  1. C Language Basics
                </button>
                <button
                  onClick={() => setSelectedTopic('pointers')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedTopic === 'pointers'
                      ? 'bg-purple-900/50 border border-purple-700 text-purple-300'
                      : 'bg-gray-900/50 hover:bg-gray-800/50'
                  }`}
                >
                  2. Pointers & Memory
                </button>
                <button
                  onClick={() => setSelectedTopic('data-structures')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedTopic === 'data-structures'
                      ? 'bg-green-900/50 border border-green-700 text-green-300'
                      : 'bg-gray-900/50 hover:bg-gray-800/50'
                  }`}
                >
                  3. Data Structures
                </button>
                <button
                  onClick={() => setSelectedTopic('quiz')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedTopic === 'quiz'
                      ? 'bg-yellow-900/50 border border-yellow-700 text-yellow-300'
                      : 'bg-gray-900/50 hover:bg-gray-800/50'
                  }`}
                >
                  🎯 Quiz Challenge
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold mb-3">📊 Your Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Tutorials Completed</span>
                    <span className="text-green-400">2/3</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Quiz Score</span>
                    <span className="text-blue-400">80%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {selectedTopic ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                {renderTopicContent()}
                
                {/* Code Example Button */}
                {selectedTopic !== 'quiz' && (
                  <div className="mt-8">
                    <button
                      onClick={() => setShowCodeExample(selectedTopic)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center"
                    >
                      <Code className="w-5 h-5 mr-2" />
                      Show Code Example
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h2 className="text-2xl font-bold mb-2">Welcome to C Tutorials</h2>
                <p className="text-gray-300 mb-6">
                  Select a topic from the sidebar to start learning. Each tutorial includes:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 p-4 rounded">
                    <div className="text-2xl mb-2">📝</div>
                    <h3 className="font-bold">Theory</h3>
                    <p className="text-sm text-gray-400">Detailed explanations</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded">
                    <div className="text-2xl mb-2">💻</div>
                    <h3 className="font-bold">Code Examples</h3>
                    <p className="text-sm text-gray-400">Practical demonstrations</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-bold">Quizzes</h3>
                    <p className="text-sm text-gray-400">Test your knowledge</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Example Modal */}
      {showCodeExample && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-800">
              <h3 className="text-xl font-bold">Code Example</h3>
              <button
                onClick={() => setShowCodeExample('')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              <pre className="bg-black p-4 rounded text-green-400 font-mono text-sm">
                {codeExamples[showCodeExample as keyof typeof codeExamples]}
              </pre>
            </div>
            <div className="p-4 bg-gray-800">
              <p className="text-gray-300">
                Copy this code and try it in the editor! Modify it to learn more.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};