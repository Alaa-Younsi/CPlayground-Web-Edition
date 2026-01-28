import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { Terminal, Play, Save, Eye } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  onRun?: (code: string) => void;
  onSave?: (code: string) => void;
  showOutput?: boolean;
  output?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = `#include <stdio.h>

int main() {
    printf("Hello CPlayground!\\n");
    return 0;
}`,
  onRun,
  onSave,
  showOutput = false,
  output = ''
}) => {
  const [code, setCode] = useState(initialCode);
  const [history, setHistory] = useState<string[]>([]);

  const handleRun = () => {
    if (onRun) {
      onRun(code);
      setHistory([...history, `> Running program...`]);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(code);
      setHistory([...history, `> Code saved successfully.`]);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-gray-300 font-mono text-sm">editor.c</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </button>
          <button
            onClick={handleRun}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center"
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="400px"
          onChange={(value: string) => setCode(value)}
          className="text-lg"
        />
      </div>

      {showOutput && (
        <div className="border-t border-gray-700">
          <div className="bg-gray-800 px-4 py-2 flex items-center">
            <Eye className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-gray-300 font-mono">Output</span>
          </div>
          <div className="bg-black p-4 font-mono text-green-400 min-h-[100px] whitespace-pre">
            {output || "No output yet. Run your code to see results."}
          </div>
        </div>
      )}
    </div>
  );
};