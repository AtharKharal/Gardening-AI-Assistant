
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import { UploadIcon } from './icons/UploadIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64Data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      resolve({ base64: base64Data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};


const PlantIdentifier: React.FC = () => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setAnalysis(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await analyzeImage(base64, mimeType);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <label htmlFor="plant-upload" className="block text-lg font-medium text-green-800">Upload a plant photo</label>
          <div className="w-full aspect-square bg-green-100 rounded-lg border-2 border-dashed border-green-300 flex items-center justify-center p-4">
            {imageDataUrl ? (
              <img src={imageDataUrl} alt="Plant preview" className="max-w-full max-h-full object-contain rounded-md" />
            ) : (
              <div className="text-center text-green-600">
                <UploadIcon className="w-12 h-12 mx-auto" />
                <p className="mt-2">Your image will appear here</p>
              </div>
            )}
          </div>
          <div className="flex gap-4">
             <label className="flex-1 cursor-pointer bg-green-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300">
                <span>{imageFile ? "Change Image" : "Select Image"}</span>
                <input id="plant-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
             </label>
             <button
                onClick={handleAnalyze}
                disabled={!imageFile || isLoading}
                className="flex-1 flex items-center justify-center bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? <SpinnerIcon /> : 'Analyze Plant'}
              </button>
          </div>
        </div>
        <div className="space-y-4">
           <h3 className="text-lg font-medium text-green-800">Analysis Results</h3>
            <div className="w-full h-[26rem] bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-y-auto">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <SpinnerIcon />
                        <p className="mt-2">Analyzing your plant...</p>
                    </div>
                )}
                {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
                {analysis && (
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        {analysis.split('\n').map((line, index) => {
                             if (line.startsWith('#')) {
                                const level = line.match(/#/g)?.length || 1;
                                const text = line.replace(/#/g, '').trim();
                                if (level === 1) return <h1 key={index} className="text-2xl font-bold mt-4 mb-2 text-green-800">{text}</h1>;
                                if (level === 2) return <h2 key={index} className="text-xl font-semibold mt-3 mb-1 text-green-700">{text}</h2>;
                                return <h3 key={index} className="text-lg font-semibold mt-2 mb-1 text-green-600">{text}</h3>;
                            }
                            if (line.trim().startsWith('*')) {
                                return <li key={index} className="ml-5 list-disc">{line.replace('*', '').trim()}</li>
                            }
                            return <p key={index} className="mb-2">{line}</p>;
                        })}
                    </div>
                )}
                {!isLoading && !analysis && !error && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>Results will be displayed here.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlantIdentifier;
