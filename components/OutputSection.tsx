import React, { useState, useEffect } from 'react';
import type { GenerationResult } from '../services/geminiService';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';
import { DownloadDocxButton } from './DownloadDocxButton';
import { LoadingSpinner } from './LoadingSpinner';
import { DocumentTextIcon, ChartBarIcon } from './icons';

interface OutputSectionProps {
  isLoading: boolean;
  result: GenerationResult | null;
}

const EditableOutputCard: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const [currentContent, setCurrentContent] = useState(content);

    useEffect(() => {
        setCurrentContent(content);
    }, [content]);

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-sky-300">{title}</h3>
                <div className="flex items-center space-x-2">
                    <CopyButton textToCopy={currentContent} />
                    <DownloadButton textToDownload={currentContent} filename={title.replace(/\s+/g, '_')} />
                    <DownloadDocxButton textToDownload={currentContent} filename={title.replace(/\s+/g, '_')} />
                </div>
            </div>
            <textarea
                value={currentContent}
                onChange={(e) => setCurrentContent(e.target.value)}
                className="w-full h-96 bg-slate-900/70 border border-slate-600 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200"
                aria-label={`Editable content for ${title}`}
            />
        </div>
    );
};

const KeywordAnalysisCard: React.FC<{ keywords: string[] }> = ({ keywords }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-semibold text-sky-300 mb-4">Keyword Analysis</h3>
        <div className="flex flex-wrap gap-2">
            {(keywords && keywords.length > 0) ? keywords.map((keyword, index) => (
                <span key={index} className="bg-cyan-900/50 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">
                    {keyword}
                </span>
            )) : <p className="text-slate-400">No keywords were extracted.</p>}
        </div>
    </div>
);

const AlignmentAnalysisCard: React.FC<{ strengths: string[], gaps: string[] }> = ({ strengths, gaps }) => (
     <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-semibold text-sky-300 mb-4">Resume & Job Alignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-bold text-green-400 mb-2">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {(strengths && strengths.length > 0) ? strengths.map((item, index) => <li key={index}>{item}</li>) : <li>No specific strengths identified.</li>}
                </ul>
            </div>
            <div>
                 <h4 className="font-bold text-amber-400 mb-2">Potential Gaps</h4>
                 <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {(gaps && gaps.length > 0) ? gaps.map((item, index) => <li key={index}>{item}</li>) : <li>No potential gaps identified.</li>}
                </ul>
            </div>
        </div>
    </div>
);


const Placeholder: React.FC<{ title: string; text: string; }> = ({ title, text }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 border-dashed">
        <h3 className="text-xl font-semibold text-sky-300 mb-4">{title}</h3>
        <p className="text-slate-400">{text}</p>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            active
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        role="tab"
        aria-selected={active}
    >
        {children}
    </button>
);

export const OutputSection: React.FC<OutputSectionProps> = ({ isLoading, result }) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'analysis'>('documents');
  
  useEffect(() => {
    // When a new result comes in, switch to the documents tab
    if (result) {
      setActiveTab('documents');
    }
  }, [result]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <LoadingSpinner className="w-12 h-12 text-cyan-400" />
        <p className="mt-4 text-slate-400 text-lg">AI is working its magic...</p>
        <p className="text-slate-500 text-sm">Analyzing fit and crafting documents.</p>
      </div>
    );
  }

  if (!result) {
    return (
        <Placeholder title="Your Results Will Appear Here" text="Once you provide your resume and a job description, your tailored documents and a detailed analysis will be generated." />
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2 p-1 bg-slate-900/50 rounded-lg self-start" role="tablist">
          <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
              <DocumentTextIcon className="w-5 h-5" />
              <span>Documents</span>
          </TabButton>
          <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
              <ChartBarIcon className="w-5 h-5" />
              <span>Analysis</span>
          </TabButton>
      </div>
      
      <div role="tabpanel">
        {activeTab === 'documents' && (
          <div className="flex flex-col space-y-8 animate-fade-in">
              <EditableOutputCard title="Tailored Resume" content={result.tailoredResume} />
              <EditableOutputCard title="Personalized Cover Letter" content={result.coverLetter} />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="flex flex-col space-y-8 animate-fade-in">
              <KeywordAnalysisCard keywords={result.keywordAnalysis} />
              <AlignmentAnalysisCard strengths={result.alignmentAnalysis.strengths} gaps={result.alignmentAnalysis.gaps} />
          </div>
        )}
      </div>
    </div>
  );
};