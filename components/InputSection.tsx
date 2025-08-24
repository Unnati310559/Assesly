
import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { parseFile } from '../services/fileParser';
import { DocumentArrowUpIcon } from './icons';

interface InputSectionProps {
  resume: string;
  setResume: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  customInstructions: string;
  setCustomInstructions: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  roleLevel: string;
  setRoleLevel: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resume,
  setResume,
  jobDescription,
  setJobDescription,
  customInstructions,
  setCustomInstructions,
  tone,
  setTone,
  roleLevel,
  setRoleLevel,
  onSubmit,
  isLoading,
}) => {
  const [fileError, setFileError] = useState<Record<string, string | null>>({ resume: null, jobDescription: null });
  const [isParsing, setIsParsing] = useState<Record<string, boolean>>({ resume: false, jobDescription: false });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
    fieldType: 'resume' | 'jobDescription'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(prev => ({ ...prev, [fieldType]: true }));
    setFileError(prev => ({ ...prev, [fieldType]: null }));

    try {
      const text = await parseFile(file);
      setter(text);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred during parsing.';
      setFileError(prev => ({ ...prev, [fieldType]: message }));
    } finally {
      setIsParsing(prev => ({ ...prev, [fieldType]: false }));
      // Reset file input value to allow re-uploading the same file
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="resume" className="block text-sm font-medium text-slate-300">
            Your Resume / Profile
          </label>
          <label
            htmlFor="resume-upload"
            className={`flex items-center space-x-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium ${isLoading || isParsing.resume ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>{isParsing.resume ? 'Parsing...' : 'Upload File'}</span>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileUpload(e, setResume, 'resume')}
              disabled={isLoading || isParsing.resume}
            />
          </label>
        </div>
        {fileError.resume && <p className="text-sm text-red-400 mb-2">{fileError.resume}</p>}
        <textarea
          id="resume"
          rows={8}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 placeholder-slate-500"
          placeholder="Paste your raw resume text or upload a file..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          disabled={isLoading || isParsing.resume}
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="job-description" className="block text-sm font-medium text-slate-300">
            Target Job Description
          </label>
           <label
            htmlFor="jd-upload"
            className={`flex items-center space-x-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium ${isLoading || isParsing.jobDescription ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>{isParsing.jobDescription ? 'Parsing...' : 'Upload File'}</span>
            <input
              id="jd-upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileUpload(e, setJobDescription, 'jobDescription')}
              disabled={isLoading || isParsing.jobDescription}
            />
          </label>
        </div>
        {fileError.jobDescription && <p className="text-sm text-red-400 mb-2">{fileError.jobDescription}</p>}
        <textarea
          id="job-description"
          rows={8}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 placeholder-slate-500"
          placeholder="Paste the full job description or upload a file..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading || isParsing.jobDescription}
        />
      </div>

      <div>
          <label htmlFor="custom-instructions" className="block text-sm font-medium text-slate-300 mb-2">
            Custom Instructions / Keywords (Optional)
          </label>
        <textarea
          id="custom-instructions"
          rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 placeholder-slate-500"
          placeholder="e.g., Emphasize my experience in React Native, mention I'm a quick learner..."
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">
            Cover Letter Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200"
          >
            <option>Default</option>
            <option>Formal</option>
            <option>Confident</option>
            <option>Friendly</option>
            <option>Persuasive</option>
          </select>
        </div>
        <div>
          <label htmlFor="role-level" className="block text-sm font-medium text-slate-300 mb-2">
            Role Level
          </label>
          <select
            id="role-level"
            value={roleLevel}
            onChange={(e) => setRoleLevel(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200"
          >
            <option>Default</option>
            <option>Entry-level</option>
            <option>Mid-level</option>
            <option>Senior-level</option>
            <option>Executive</option>
          </select>
        </div>
      </div>


      <button
        onClick={onSubmit}
        disabled={isLoading || isParsing.resume || isParsing.jobDescription}
        className="flex items-center justify-center w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-900/30 hover:shadow-cyan-700/50 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5 mr-3" />
            Generating...
          </>
        ) : (
          'Generate My Documents'
        )}
      </button>
    </div>
  );
};