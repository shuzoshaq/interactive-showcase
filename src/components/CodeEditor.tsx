'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'html' | 'css'>('javascript');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  
  // Sample code snippets
  const codeSnippets = {
    javascript: `// Interactive JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log("Fibonacci Sequence:");
console.log(results.join(", "));

// Create a simple animation
let counter = 0;
const animate = () => {
  counter++;
  console.log(\`Animation frame \${counter}\`);
  if (counter < 5) {
    setTimeout(animate, 500);
  } else {
    console.log("Animation complete!");
  }
};

animate();`,
    
    python: `# Interactive Python Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate first 10 Fibonacci numbers
results = []
for i in range(10):
    results.append(fibonacci(i))

print("Fibonacci Sequence:")
print(", ".join(map(str, results)))

# Create a simple animation
import time

def animate():
    for i in range(5):
        print(f"Animation frame {i+1}")
        time.sleep(0.5)
    print("Animation complete!")

animate()`,
    
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive HTML Example</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f0f0f0;
    }
    .container {
      text-align: center;
    }
    button {
      padding: 10px 20px;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
    #output {
      margin-top: 20px;
      padding: 15px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Interactive HTML Example</h1>
    <button id="actionButton">Click Me!</button>
    <div id="output">Click the button to see what happens</div>
  </div>

  <script>
    const button = document.getElementById('actionButton');
    const output = document.getElementById('output');
    let clickCount = 0;

    button.addEventListener('click', () => {
      clickCount++;
      output.textContent = \`Button clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
      
      // Change button color randomly
      const randomColor = \`#\${Math.floor(Math.random()*16777215).toString(16)}\`;
      button.style.backgroundColor = randomColor;
    });
  </script>
</body>
</html>`,
    
    css: `/* Interactive CSS Example */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.box {
  width: 100px;
  height: 100px;
  background-color: #3b82f6;
  border-radius: 10px;
  animation: pulse 2s infinite ease-in-out;
}

.circle {
  width: 80px;
  height: 80px;
  background-color: #8b5cf6;
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
}

.square {
  width: 60px;
  height: 60px;
  background-color: #ef4444;
  animation: rotate 4s infinite linear;
}

/* Hover effects */
.box:hover {
  animation-play-state: paused;
  background-color: #2563eb;
  cursor: pointer;
}

.circle:hover {
  animation-play-state: paused;
  background-color: #7c3aed;
  cursor: pointer;
}

.square:hover {
  animation-play-state: paused;
  background-color: #dc2626;
  cursor: pointer;
}`
  };
  
  // Set initial code
  useEffect(() => {
    setCode(codeSnippets[language]);
  }, [language, codeSnippets]);
  
  // Run code function
  const runCode = () => {
    setIsRunning(true);
    setError('');
    setOutput('');
    
    setTimeout(() => {
      try {
        if (language === 'javascript') {
          // Create a safe execution environment
          const originalConsoleLog = console.log;
          const logs: string[] = [];
          
          // Override console.log
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
            originalConsoleLog(...args);
          };
          
          // Execute code with timeout to prevent infinite loops
          const timeoutId = setTimeout(() => {
            setError('Execution timed out. Your code might have an infinite loop.');
            setIsRunning(false);
            console.log = originalConsoleLog;
          }, 3000);
          
          // Execute code
          try {
            // Function constructor is needed here for dynamic code execution
            new Function(code)();
            clearTimeout(timeoutId);
          } catch (e) {
            logs.push(`Error: ${e instanceof Error ? e.message : String(e)}`);
          }
          
          // Restore console.log
          console.log = originalConsoleLog;
          
          setOutput(logs.join('\n'));
        } else if (language === 'python') {
          setOutput('Python execution is simulated in this demo.\n\nFibonacci Sequence:\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34\n\nAnimation frame 1\nAnimation frame 2\nAnimation frame 3\nAnimation frame 4\nAnimation frame 5\nAnimation complete!');
        } else if (language === 'html') {
          setOutput('HTML preview would be displayed here in a real environment.');
        } else if (language === 'css') {
          setOutput('CSS animations would be applied to elements in a real environment.');
        }
      } catch (e) {
        setError(`Error: ${e instanceof Error ? e.message : String(e)}`);
      }
      
      setIsRunning(false);
    }, 1000);
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <div className="flex flex-wrap gap-2">
          <motion.button
            className={`px-4 py-2 rounded-full text-sm ${
              language === 'javascript' 
                ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('javascript')}
          >
            JavaScript
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-full text-sm ${
              language === 'python' 
                ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('python')}
          >
            Python
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-full text-sm ${
              language === 'html' 
                ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('html')}
          >
            HTML
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-full text-sm ${
              language === 'css' 
                ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('css')}
          >
            CSS
          </motion.button>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            className={`px-3 py-1 rounded-full text-sm ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white font-bold shadow-lg border-2 border-gray-600' 
                : 'bg-gray-300 text-gray-800 border-2 border-gray-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme('dark')}
          >
            Dark
          </motion.button>
          <motion.button
            className={`px-3 py-1 rounded-full text-sm ${
              theme === 'light' 
                ? 'bg-gray-200 text-gray-800 font-bold shadow-lg border-2 border-gray-400' 
                : 'bg-gray-800 text-white border-2 border-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme('light')}
          >
            Light
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-inner p-2 h-[400px] overflow-auto">
          <textarea
            className="w-full h-full bg-transparent outline-none p-2 font-mono text-sm resize-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ display: 'none' }}
          />
          <SyntaxHighlighter
            language={language}
            style={theme === 'dark' ? vscDarkPlus : prism}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              height: '100%',
              fontSize: '0.875rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Output</h3>
            <motion.button
              className="px-4 py-2 rounded-full bg-accent text-white text-sm font-bold flex items-center gap-2 shadow-lg border-2 border-accent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runCode}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Code
                </>
              )}
            </motion.button>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-inner p-4 h-[362px] overflow-auto font-mono text-sm">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-400 dark:text-gray-600 h-full flex items-center justify-center">
                Run the code to see the output
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Note: Code execution is simulated for demonstration purposes.
      </div>
    </div>
  );
};

export default CodeEditor;
