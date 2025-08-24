
import React, { useState, useCallback } from 'react';
import { generateContent } from './services/geminiService';
import type { GenerationResult } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [resumeInput, setResumeInput] = useState<string>('');
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [tone, setTone] = useState<string>('Default');
  const [roleLevel, setRoleLevel] = useState<string>('Default');
  const [generatedResult, setGeneratedResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!resumeInput.trim() || !jobDescriptionInput.trim()) {
      setError('Please provide both your resume/profile and the job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const result = await generateContent(resumeInput, jobDescriptionInput, tone, roleLevel, customInstructions);
      setGeneratedResult(result);
    } catch (err) {
      setError(err instanceof Error ? `An error occurred: ${err.message}` : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [resumeInput, jobDescriptionInput, tone, roleLevel, customInstructions]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <SparklesIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
              Assessly
            </h1>
          </div>
          <p className="mt-4 text-lg text-slate-400">
            Tailor your resume and craft the perfect cover letter in seconds.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection
            resume={resumeInput}
            setResume={setResumeInput}
            jobDescription={jobDescriptionInput}
            setJobDescription={setJobDescriptionInput}
            customInstructions={customInstructions}
            setCustomInstructions={setCustomInstructions}
            tone={tone}
            setTone={setTone}
            roleLevel={roleLevel}
            setRoleLevel={setRoleLevel}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
          
          <div className="flex flex-col">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-8">
                <h3 className="font-bold mb-2">Error</h3>
                <p>{error}</p>
              </div>
            )}
            <OutputSection
              isLoading={isLoading}
              result={generatedResult}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;